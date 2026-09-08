import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../features/auth/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  ChevronDown,
  Search,
  Stethoscope,
  Scissors,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Heart,
  Pill,
  Bird,
  MoreHorizontal,
  Star,
  ExternalLink,
  Calendar,
  CheckCircle2,
  ArrowRight,
  X,
} from 'lucide-react';

interface VetDoctor {
  id: number;
  fullName: string;
  title: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  city: string;
  state?: string;
  country?: string;
  address?: string;
  consultationFee: number;
  availableDays?: string;
  availableHours?: string;
  imageUrl?: string;
  lat?: number;
  lng?: number;
}

export const FindVetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Open Now' | 'Surgeon' | 'General'>('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [locationSearch, setLocationSearch] = useState('New York, USA');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [doctorsList, setDoctorsList] = useState<VetDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [bookingVet, setBookingVet] = useState<VetDoctor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [petName, setPetName] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Cloudinary CTA Cat Image asset
  const ctaCatUrl = getCloudinaryImageUrl('cta_cat_sunglasses_flawless_seamless');

  const specializations = [
    { name: 'General Veterinarian', icon: Stethoscope, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]', border: 'border-[#C3ECD0]' },
    { name: 'Surgery', icon: Scissors, bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]', border: 'border-[#FDE047]' },
    { name: 'Dental Care', icon: Sparkles, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]', border: 'border-[#FECDD3]' },
    { name: 'Dermatology', icon: ShieldCheck, bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]', border: 'border-[#E9D5FF]' },
    { name: 'Emergency Care', icon: AlertCircle, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', border: 'border-[#BAE6FD]' },
    { name: 'Cardiology', icon: Heart, bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]' },
    { name: 'Oncology', icon: Pill, bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
    { name: 'Exotic Pet Care', icon: Bird, bg: 'bg-[#FEF08A]', text: 'text-[#A16207]', border: 'border-[#FDE047]' },
    { name: 'More', icon: MoreHorizontal, bg: 'bg-[#F3F4F6]', text: 'text-[#4B5563]', border: 'border-[#E5E7EB]' },
  ];

  const popularSearches = ['Emergency Care', 'Dental Care', 'Surgery', 'General Veterinarian'];

  const fetchVets = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/vets')
      .then((res) => {
        // Enrich coordinates if not in DB
        const enriched = (res.data || []).map((vet: VetDoctor, i: number) => ({
          ...vet,
          lat: vet.lat || 40.7128 + (i * 0.008 - 0.015),
          lng: vet.lng || -74.006 + (i * 0.007 - 0.01),
        }));
        setDoctorsList(enriched);

        // Check if vetId was passed via query parameter
        const queryVetId = searchParams.get('vetId');
        if (queryVetId) {
          const matched = enriched.find((v: VetDoctor) => v.id.toString() === queryVetId);
          if (matched) {
            setBookingVet(matched);
          }
        }
      })
      .catch(() => {
        setError('Failed to load veterinarians. Please check your connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVets();
  }, []);

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSearch =
      searchTerm === '' ||
      doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpec =
      selectedSpecialization === 'All Specializations' ||
      doc.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());

    if (!matchesSearch || !matchesSpec) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Open Now') return true;
    if (selectedFilter === 'Surgeon') return doc.specialization.toLowerCase().includes('surgeon');
    if (selectedFilter === 'General') return doc.specialization.toLowerCase().includes('general');
    return true;
  });

  // Interactive Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const centerLat = 40.7128;
    const centerLng = -74.006;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // User location pin
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; background: rgba(239, 68, 68, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 20px; height: 20px; background: #EF4444; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([centerLat, centerLng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div style="font-family: inherit; padding: 2px;">
        <strong style="color: #16241B; font-size: 13px;">📍 Current Area</strong>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #556658;">${locationSearch}</p>
      </div>
    `);

    // Doctor pins
    filteredDoctors.forEach((doc) => {
      if (!doc.lat || !doc.lng) return;
      const docIcon = L.divIcon({
        className: 'custom-doc-marker',
        html: `
          <div style="
            background: #3FA65C;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 12px;
            cursor: pointer;
          ">
            🐾
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([doc.lat, doc.lng], { icon: docIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 170px; padding: 2px;">
          <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #16241B;">${doc.fullName}</h4>
          <p style="margin: 2px 0; font-size: 11px; color: #3FA65C; font-weight: 600;">${doc.specialization}</p>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #556658; margin-top: 4px;">
            <span style="color: #F5A623;">★ ${doc.rating || 4.9}</span>
            <span>(${doc.reviewsCount || 80} reviews)</span>
          </div>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #888;">📍 ${doc.city}, ${doc.country || 'USA'}</p>
        </div>
      `);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [filteredDoctors, locationSearch]);

  const handleOpenBooking = (vet: VetDoctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingVet(vet);
    setBookingDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setBookingSuccess(false);
    setBookingError(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingVet) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      await apiClient.post('/customer/appointments', {
        vetId: bookingVet.id,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        petName: petName || 'My Pet',
        reason: bookingNotes || 'Regular checkup',
      });
      setBookingSuccess(true);
    } catch {
      setBookingError('Unable to confirm appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B2B1E] flex flex-col font-sans selection:bg-[#EF7C3C]/20 selection:text-[#EF7C3C]">
      {/* 1. Navbar */}
      <Navbar activePage="find-a-vet" />

      <main className="flex-1 space-y-16 md:space-y-20 pb-16">
        {/* 2. Hero / Search Section */}
        <section className="bg-[#EFF8F0] border-b border-[#D8EDE0] pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Search Box & Headings */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Location Pill */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                    className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-[#CDE5D5] px-4 py-2 rounded-full text-xs font-bold text-[#1B2B1E] shadow-xs hover:border-[#3FA65C] transition-all cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#3FA65C]" />
                    <span>{locationSearch}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {isLocationDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white border border-[#E5DFCE] rounded-2xl shadow-xl p-2 z-30 space-y-1 text-xs font-semibold">
                      {['New York, USA', 'Chicago, USA', 'Los Angeles, USA', 'San Francisco, USA'].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setLocationSearch(loc);
                            setIsLocationDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#EFF8F0] hover:text-[#3FA65C] transition-colors"
                        >
                          📍 {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#1B2B1E] leading-[1.12]">
                  Find the Best <span className="text-[#EF7C3C]">Vet Near</span> You.
                </h1>

                <p className="text-base sm:text-lg text-[#445548] max-w-xl font-normal leading-relaxed">
                  Compassionate care for your pets. Find verified veterinarians with live appointment booking.
                </p>

                {/* Single White Search Bar */}
                <div className="bg-white p-2.5 sm:p-3 rounded-3xl sm:rounded-full border border-[#D5EAD9] shadow-[0_12px_35px_-8px_rgba(40,122,65,0.12)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                    <Search className="w-4 h-4 text-[#3FA65C] shrink-0" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search vet name, specialty, city..."
                      className="w-full text-sm font-semibold text-[#1B2B1E] placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                  </div>

                  <div className="flex-1 flex items-center px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full text-sm font-semibold text-[#1B2B1E] focus:outline-none bg-transparent cursor-pointer"
                    >
                      <option value="All Specializations">All Specializations</option>
                      {specializations.slice(0, 8).map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => document.getElementById('vets-directory')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full px-6 py-3 shrink-0 flex items-center justify-center gap-2 text-sm font-black"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>

                {/* Popular Searches */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <span className="text-xs font-bold text-[#556658]">Popular Searches:</span>
                  {popularSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedSpecialization(tag)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#DDF3E4] text-[#287A41] hover:bg-[#C9ECD3] transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Hero Image Card */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="relative w-full max-w-[420px] aspect-[4/3.5] rounded-3xl overflow-hidden bg-white/70 border-2 border-[#D5EAD9] p-3 shadow-lg flex items-center justify-center">
                  <img
                    src={getCloudinaryImageUrl('hero_dog_cat_green_bg')}
                    alt="Veterinary Care"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute -top-4 -right-2 sm:-right-4 bg-[#FFE8A3] border border-[#F5D875] text-[#1B2B1E] px-4 py-2 rounded-2xl rounded-br-none shadow-xl text-xs font-black flex items-center gap-2 animate-float-slow z-20">
                    <span>Your pet's health. Our priority! ❤️</span>
                  </div>
                  <div className="absolute -bottom-3 left-4 bg-[#3FA65C] text-white px-3 py-1.5 rounded-full shadow-md text-xs font-extrabold flex items-center gap-1.5 z-20">
                    <span>🐾 100% Verified Vets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Search by Specialization */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2B1E] tracking-tight">
              Search by Specialization
            </h2>
            <button
              onClick={() => setSelectedSpecialization('All Specializations')}
              className="text-sm font-extrabold text-[#3FA65C] hover:text-[#2E8B48] flex items-center gap-1 transition-colors cursor-pointer"
            >
              Reset Filters <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
            {specializations.map((spec) => {
              const IconComp = spec.icon;
              const isSelected = selectedSpecialization === spec.name;
              return (
                <div
                  key={spec.name}
                  onClick={() =>
                    setSelectedSpecialization(spec.name === 'More' ? 'All Specializations' : spec.name)
                  }
                  className={`bg-white rounded-2xl p-3 border transition-all duration-200 flex flex-col items-center text-center cursor-pointer group ${
                    isSelected
                      ? 'border-[#3FA65C] ring-2 ring-[#3FA65C]/20 shadow-md'
                      : 'border-[#EDE7D9] shadow-xs hover:border-[#3FA65C]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full ${spec.bg} border ${spec.border} ${spec.text} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 shadow-2xs`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1B2B1E] leading-tight line-clamp-2">
                    {spec.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Top Veterinarians Near You + Map Section */}
        <section id="vets-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Veterinarians List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-black text-[#1B2B1E] tracking-tight">
                  Top Veterinarians ({filteredDoctors.length})
                </h2>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {(['All', 'Open Now', 'Surgeon', 'General'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                        selectedFilter === filter
                          ? 'bg-[#3FA65C] text-white shadow-xs'
                          : 'bg-white border border-[#E5DFCE] text-[#445548] hover:bg-[#F3EDE0]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctors List */}
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-[#EDE7D9] space-y-3">
                      <div className="flex gap-4 items-center">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <ErrorState message={error} onRetry={fetchVets} />
              ) : filteredDoctors.length === 0 ? (
                <EmptyState
                  title="No veterinarians found"
                  description="Try adjusting your search criteria or selecting a different specialization."
                  actionLabel="Reset Search"
                  onAction={() => {
                    setSearchTerm('');
                    setSelectedSpecialization('All Specializations');
                    setSelectedFilter('All');
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 border-2 border-[#E5DFCE] shadow-xs bg-[#F4EFE6]">
                          <img
                            src={doc.imageUrl || getCloudinaryImageUrl('vet_dr_sarah_mitchell')}
                            alt={doc.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-[#1B2B1E]">
                              {doc.fullName}
                            </h3>
                            <span title="Verified Veterinarian" className="inline-flex items-center">
                              <CheckCircle2 className="w-4 h-4 text-[#3FA65C] shrink-0" />
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-[#EF7C3C]">
                            {doc.title || doc.specialization}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#556658] pt-0.5">
                            <span className="flex items-center gap-1 text-[#F5A623] font-extrabold">
                              <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating ? doc.rating.toFixed(1) : '4.9'}
                            </span>
                            <span>({doc.reviewsCount || 45} reviews)</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#1B2B1E]">
                              <MapPin className="w-3 h-3 text-[#3FA65C]" /> {doc.city}, {doc.country || 'USA'}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-[#287A41]">
                              ${doc.consultationFee ? doc.consultationFee.toFixed(2) : '50.00'} / visit
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <span className="text-[11px] font-bold text-[#287A41] bg-[#E3F3E9] px-2.5 py-1 rounded-full">
                          Available Today
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenBooking(doc)}
                          className="rounded-full px-5 py-2 text-xs font-extrabold"
                        >
                          Book Appointment 🐾
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Interactive Map */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2B1E] tracking-tight">
                Clinic Locations
              </h2>

              <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#EDE7D9] shadow-sm space-y-3">
                <div
                  ref={mapContainerRef}
                  className="w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden z-10 border border-[#E2DDD2]"
                />

                <div className="flex items-center justify-between text-xs font-semibold px-1 pt-1">
                  <div className="flex items-center gap-2 text-[#1B2B1E]">
                    <div className="w-6 h-6 rounded-full bg-[#EFF8F0] border border-[#D5EAD9] flex items-center justify-center text-[#3FA65C] shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-extrabold block">Location Filter</span>
                      <span className="text-[#556658] text-[11px]">{locationSearch}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLocationDropdownOpen(true)}
                    className="text-[#3FA65C] hover:text-[#2E8B48] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Change City <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Appointment Booking Modal */}
        {bookingVet && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#EDE7D9] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setBookingVet(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-[#E6F9EC] text-[#287A41] rounded-full flex items-center justify-center mx-auto shadow-xs border border-[#C3ECD0]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[#16241B]">Appointment Booked!</h3>
                  <p className="text-sm text-[#556658]">
                    Your appointment with <span className="font-bold text-[#16241B]">{bookingVet.fullName}</span> has been confirmed for{' '}
                    <span className="font-bold text-[#3FA65C]">{bookingDate} at {bookingTime}</span>.
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        setBookingVet(null);
                        navigate('/profile?tab=appointments');
                      }}
                      className="w-full"
                    >
                      View in My Appointments
                    </Button>
                    <button
                      onClick={() => setBookingVet(null)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-700 py-1"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-[#EF7C3C] uppercase tracking-wider">Book an Appointment</span>
                    <h3 className="text-xl font-black text-[#16241B] mt-0.5">{bookingVet.fullName}</h3>
                    <p className="text-xs text-[#556658]">{bookingVet.specialization} • {bookingVet.city}</p>
                  </div>

                  {bookingError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                      {bookingError}
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-[#334437]">Pet Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bella"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-[#334437]">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-[#334437]">Preferred Time</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-bold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-[#334437]">Reason / Symptoms</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Routine vaccination and annual checkup"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#FAF6EE] border border-[#E5DFCE] rounded-xl text-xs font-semibold text-[#16241B] focus:outline-none focus:border-[#3FA65C]"
                    />
                  </div>

                  <div className="p-3 bg-[#EFF8F0] border border-[#D5EAD9] rounded-xl flex items-center justify-between text-xs font-bold text-[#16241B]">
                    <span>Consultation Fee:</span>
                    <span className="text-sm font-black text-[#287A41]">
                      ${bookingVet.consultationFee ? bookingVet.consultationFee.toFixed(2) : '50.00'}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={bookingLoading}
                    className="w-full font-black py-3"
                  >
                    {bookingLoading ? 'Confirming Appointment...' : 'Confirm Appointment 🐾'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 6. Feature Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#E3F3E9] rounded-3xl p-5 border border-[#C5E9D0] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#287A41] flex items-center justify-center shadow-xs mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Verified Veterinarians</h3>
                <p className="text-xs text-[#445548] leading-snug">All vets are verified and background checked.</p>
              </div>
            </div>

            <div className="bg-[#FBEEDD] rounded-3xl p-5 border border-[#F4DCBE] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#C2410C] flex items-center justify-center shadow-xs mb-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Nearby Locations</h3>
                <p className="text-xs text-[#445548] leading-snug">Find trusted vets close to your neighborhood.</p>
              </div>
            </div>

            <div className="bg-[#EDE6F7] rounded-3xl p-5 border border-[#DCD0F0] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#7E22CE] flex items-center justify-center shadow-xs mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Instant Scheduling</h3>
                <p className="text-xs text-[#445548] leading-snug">Book appointments with real-time confirmation.</p>
              </div>
            </div>

            <div className="bg-[#FBE4E9] rounded-3xl p-5 border border-[#F6CBD5] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#E11D48] flex items-center justify-center shadow-xs mb-2">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Compassionate Care</h3>
                <p className="text-xs text-[#445548] leading-snug">Your pet's health and happiness is our priority.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA Banner */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 overflow-visible">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              <div className="lg:col-span-5 flex justify-center items-end relative overflow-visible z-20">
                <div className="relative -mt-24 sm:-mt-32 lg:-mt-40 -mb-6 sm:-mb-10 lg:-mb-14 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] flex justify-center items-end pointer-events-none">
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/30 rounded-full blur-xl -z-10" />
                  <img
                    src={ctaCatUrl}
                    alt="Cool cat wearing sunglasses"
                    className="w-full h-auto object-contain [filter:drop-shadow(0_12px_18px_rgba(0,0,0,0.18))_drop-shadow(0_28px_40px_rgba(180,83,9,0.30))]"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Happy Pet. Happy Home.<br className="hidden sm:inline" /> <span className="text-[#EF7C3C]">It's That Simple.</span>
                </h2>
                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Join thousands of pet parents who trust us for everything their pets need.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-[0_8px_20px_rgba(0,158,102,0.3)] transition-all flex items-center gap-2 text-base cursor-pointer"
                  >
                    🐾 Join the Pack
                  </button>

                  <div className="bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-full border border-white/50 shadow-xs flex items-center gap-2">
                    <span className="text-xs font-bold text-[#16241B]">
                      4.9/5 ⭐⭐⭐⭐⭐ Rated by 25,000+ Pet Parents
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default FindVetPage;
