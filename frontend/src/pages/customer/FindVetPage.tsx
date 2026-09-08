import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CtaBanner } from '../../components/layout/CtaBanner';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl, getVetImageUrl } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../features/auth/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  Stethoscope,
  Scissors,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Heart,
  Pill,
  Bird,
  PawPrint,
  Star,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface VetDoctor {
  id: number;
  name: string;
  fullName?: string;
  title?: string;
  specialization: string;
  secondarySpecialization?: string;
  petTypes?: string;
  experienceYears?: number;
  rating?: number;
  reviewsCount?: number;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  consultationFee?: number;
  availableDays?: string;
  availableHours?: string;
  photoUrl?: string;
  imageUrl?: string;
  lat?: number;
  lng?: number;
}

const CLINIC_LOCATION = {
  name: 'Pawfectly Veterinary Care Center',
  address: '123 Pawfectly Way, New York, NY 10001',
  lat: 40.7128,
  lng: -74.006,
  phone: '1-800-PAWFECT',
  hours: 'Mon-Sun: 8:00 AM - 9:00 PM (24/7 Emergency)',
};

export const FindVetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [inputSearchTerm, setInputSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [inputSpecialization, setInputSpecialization] = useState('All Specializations');
  const [appliedSpecialization, setAppliedSpecialization] = useState('All Specializations');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;
  const [doctorsList, setDoctorsList] = useState<VetDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const specializations = [
    { name: 'General Veterinarian', icon: Stethoscope, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]', border: 'border-[#C3ECD0]' },
    { name: 'Surgery', icon: Scissors, bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]', border: 'border-[#FDE047]' },
    { name: 'Dental Care', icon: Sparkles, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]', border: 'border-[#FECDD3]' },
    { name: 'Dermatology', icon: ShieldCheck, bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]', border: 'border-[#E9D5FF]' },
    { name: 'Emergency Care', icon: AlertCircle, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', border: 'border-[#BAE6FD]' },
    { name: 'Cardiology', icon: Heart, bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]' },
    { name: 'Oncology', icon: Pill, bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
    { name: 'Exotic Pet Care', icon: Bird, bg: 'bg-[#FEF08A]', text: 'text-[#A16207]', border: 'border-[#FDE047]' },
  ];

  const popularSearches = ['Emergency Care', 'Dental Care', 'Surgery', 'General Veterinarian'];

  const fetchVets = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/vets')
      .then((res) => {
        setDoctorsList(res.data || []);

        // Check if vetId was passed via query parameter
        const queryVetId = searchParams.get('vetId');
        if (queryVetId) {
          if (!isAuthenticated) {
            navigate('/login');
          } else {
            navigate(`/profile?tab=appointments&vetId=${queryVetId}`);
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

  const handleExecuteSearch = () => {
    setAppliedSearchTerm(inputSearchTerm.trim());
    setAppliedSpecialization(inputSpecialization);
    document.getElementById('vets-directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSpecializationSelect = (specName: string) => {
    const next = appliedSpecialization === specName ? 'All Specializations' : specName;
    setInputSpecialization(next);
    setAppliedSpecialization(next);
  };


  const filteredDoctors = doctorsList.filter((doc) => {
    const docName = (doc.name || doc.fullName || '').toLowerCase();
    const docSpec = (doc.specialization || '').toLowerCase();
    const docSecSpec = (doc.secondarySpecialization || '').toLowerCase();
    const docPets = (doc.petTypes || '').toLowerCase();
    const docCity = (doc.city || '').toLowerCase();
    const term = appliedSearchTerm.toLowerCase();

    const matchesSearch =
      appliedSearchTerm === '' ||
      docName.includes(term) ||
      docSpec.includes(term) ||
      docSecSpec.includes(term) ||
      docPets.includes(term) ||
      docCity.includes(term);

    const matchesSpec =
      appliedSpecialization === 'All Specializations' ||
      docSpec.includes(appliedSpecialization.toLowerCase()) ||
      docSecSpec.includes(appliedSpecialization.toLowerCase());

    return matchesSearch && matchesSpec;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearchTerm, appliedSpecialization]);

  const totalPages = Math.ceil(filteredDoctors.length / PAGE_SIZE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Interactive Leaflet Map showing single official clinic location
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [CLINIC_LOCATION.lat, CLINIC_LOCATION.lng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Single Official Clinic Pin
    const clinicIcon = L.divIcon({
      className: 'custom-clinic-marker',
      html: `
        <div style="position: relative; display: flex; items-center: center; justify-content: center; width: 44px; height: 44px;">
          <div style="position: absolute; width: 44px; height: 44px; background: rgba(40, 122, 65, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="
            background: #287A41;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid #FFFFFF;
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 16px;
            cursor: pointer;
            z-index: 10;
          ">
            🏥
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const clinicMarker = L.marker([CLINIC_LOCATION.lat, CLINIC_LOCATION.lng], { icon: clinicIcon }).addTo(map);
    clinicMarker.bindPopup(`
      <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 900; color: #16241B;">${CLINIC_LOCATION.name}</h4>
        <p style="margin: 0 0 4px 0; font-size: 11px; color: #287A41; font-weight: 700;">📍 ${CLINIC_LOCATION.address}</p>
        <p style="margin: 0 0 4px 0; font-size: 10px; color: #556658;">🕒 ${CLINIC_LOCATION.hours}</p>
        <p style="margin: 0; font-size: 10px; color: #EF7C3C; font-weight: 700;">📞 ${CLINIC_LOCATION.phone}</p>
      </div>
    `).openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleOpenBooking = (vet: VetDoctor) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/profile?tab=appointments&vetId=${vet.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B2B1E] flex flex-col font-sans selection:bg-[#EF7C3C]/20 selection:text-[#EF7C3C]">
      {/* 1. Navbar */}
      <Navbar activePage="find-a-vet" />

      <main className="flex-1 space-y-16 md:space-y-20 pb-16">
        {/* 2. Hero / Search Section */}
        <section id="find-vet-hero" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">

            {/* Left — Text & Search (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-left z-20">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1B2B1E] leading-[1.1]">
                Find the Best <span className="text-[#EF7C3C]">Vet Near</span> You.
              </h1>

              <p className="text-base sm:text-lg text-[#445548] max-w-sm font-normal leading-relaxed">
                Compassionate care for your pets.<br />Find trusted veterinarians in your area.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-full border border-[#D5EAD9] shadow-[0_8px_30px_-6px_rgba(40,122,65,0.18)] flex items-center pr-1.5 py-1.5 pl-5">
                <Search className="w-4 h-4 text-[#3FA65C] shrink-0 mr-3" />
                <input
                  type="text"
                  value={inputSearchTerm}
                  onChange={(e) => setInputSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleExecuteSearch();
                    }
                  }}
                  placeholder="Search vet name, specialty, city..."
                  className="flex-1 min-w-0 text-sm font-semibold text-[#1B2B1E] placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
                <div className="w-px h-5 bg-gray-200 mx-3 shrink-0" />
                <select
                  value={inputSpecialization}
                  onChange={(e) => setInputSpecialization(e.target.value)}
                  className="text-sm font-semibold text-[#1B2B1E] focus:outline-none bg-transparent cursor-pointer pr-2 shrink-0"
                >
                  <option value="All Specializations">All Specializations</option>
                  {specializations.slice(0, 8).map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleExecuteSearch}
                  className="ml-2 rounded-full px-6 py-2.5 shrink-0 flex items-center gap-1.5 text-sm font-black whitespace-nowrap"
                >
                  <Search className="w-3.5 h-3.5" />
                  Find a Vet
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs font-semibold text-[#556658]">Popular Searches :</span>
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setInputSpecialization(tag);
                      setAppliedSpecialization(tag);
                      document.getElementById('vets-directory')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#287A41] hover:underline cursor-pointer transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Hero Image (7 cols), bigger, shifted left like HomePage */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-center items-center lg:-translate-x-6 xl:-translate-x-10">
              <div className="relative w-full max-w-[700px] lg:max-w-[900px] xl:max-w-[1050px] flex items-center justify-center overflow-visible py-4 sm:py-6">
                <img
                  src={getCloudinaryImageUrl('find_vet_hero')}
                  alt="Your pet's health, Our priority!"
                  className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none"
                />
              </div>
            </div>

          </div>
        </section>


        {/* 3. Search by Specialization */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2B1E] tracking-tight">
                Search by <span className="text-[#EF7C3C]">Specialization</span><span className="text-[#1B2B1E]">.</span>
              </h2>
              <p className="text-xs text-[#556658] font-medium mt-1">
                Filter veterinarians based on their area of expertise.
              </p>
            </div>
            <a
              href="/find-a-vet"
              className="shrink-0 text-sm font-bold text-[#3FA65C] hover:text-[#287A41] transition-colors flex items-center gap-1 pb-0.5"
            >
              View All <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {specializations.map((spec) => {
              const IconComp = spec.icon;
              const isSelected = appliedSpecialization === spec.name;
              return (
                <div
                  key={spec.name}
                  onClick={() => handleSpecializationSelect(spec.name)}
                  className={`bg-white rounded-2xl p-3 border transition-all duration-200 flex flex-col items-center text-center cursor-pointer group ${isSelected
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
            <div className="lg:col-span-7 space-y-4">
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
                    setInputSearchTerm('');
                    setAppliedSearchTerm('');
                    setInputSpecialization('All Specializations');
                    setAppliedSpecialization('All Specializations');
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {paginatedDoctors.map((doc) => {
                    const displayName = doc.name || doc.fullName || 'Veterinarian';
                    const photo = getVetImageUrl(displayName, doc.photoUrl, doc.id);
                    return (
                      <div
                        key={doc.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 border-2 border-[#E5DFCE] shadow-xs bg-[#F4EFE6]">
                            <img
                              src={photo}
                              alt={displayName}
                              className="w-full h-full object-cover object-[center_20%]"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-black text-[#1B2B1E]">
                                {displayName}
                              </h3>
                              <span title="Verified Veterinarian" className="inline-flex items-center">
                                <CheckCircle2 className="w-4 h-4 text-[#3FA65C] shrink-0" />
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-[#EF7C3C]">
                              {doc.specialization}
                            </p>
                            {doc.secondarySpecialization && (
                              <p className="text-xs text-[#556658] font-medium">
                                {doc.secondarySpecialization}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#556658] pt-0.5">
                              <span className="flex items-center gap-1 text-[#F5A623] font-extrabold">
                                <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating ? doc.rating.toFixed(1) : '4.9'}
                              </span>
                              <span>({doc.reviewsCount || 45} reviews)</span>
                              <span>•</span>
                              <span>{doc.experienceYears || 10}+ yrs exp</span>
                              {doc.petTypes && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#287A41] font-bold flex items-center gap-1">
                                    <PawPrint className="w-3 h-3 text-[#287A41]" />
                                    <span>{doc.petTypes}</span>
                                  </span>
                                </>
                              )}
                              <span>•</span>
                              <span className="flex items-center gap-1 text-[#1B2B1E]">
                                <MapPin className="w-3 h-3 text-[#3FA65C]" /> {doc.city || 'New York, USA'}
                              </span>
                              <span>•</span>
                              <span className="font-bold text-[#287A41]">
                                ${doc.consultationFee ? doc.consultationFee.toFixed(2) : '50.00'} / visit
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <span className="text-[11px] font-bold text-[#287A41] bg-[#E3F3E9] px-2.5 py-1 rounded-full whitespace-nowrap">
                            Available Today
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenBooking(doc)}
                            className="px-3.5 py-1.5 bg-[#009E66] hover:bg-[#008757] text-white text-xs font-bold rounded-full shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="w-9 h-9 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#16241B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF6EE] transition-colors shadow-2xs cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 rounded-full text-xs font-black transition-all cursor-pointer shadow-2xs ${isCurrent
                                ? 'bg-[#009E66] text-white shadow-sm scale-105'
                                : 'bg-white border border-[#E5DFCE] text-[#16241B] hover:bg-[#FAF6EE]'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="w-9 h-9 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#16241B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF6EE] transition-colors shadow-2xs cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Interactive Map */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2B1E] tracking-tight">
                Clinic Location
              </h2>

              <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#EDE7D9] shadow-sm space-y-3">
                <div
                  ref={mapContainerRef}
                  className="w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden z-10 border border-[#E2DDD2]"
                />

                <div className="flex items-center justify-between text-xs font-semibold px-1 pt-1">
                  <div className="flex items-center gap-2.5 text-[#1B2B1E]">
                    <div className="w-8 h-8 rounded-full bg-[#EFF8F0] border border-[#D5EAD9] flex items-center justify-center text-[#287A41] shrink-0 shadow-2xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm block">{CLINIC_LOCATION.name}</span>
                      <span className="text-[#556658] text-xs font-semibold block">{CLINIC_LOCATION.address}</span>
                      <span className="text-[#287A41] text-[11px] font-bold block mt-0.5">📞 {CLINIC_LOCATION.phone} • {CLINIC_LOCATION.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



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

        {/* 7. Shared CTA Banner */}
        <CtaBanner
          title={
            <>
              Expert Care.{' '}
              <span
                className="text-[#EF7C3C]"
                style={{ WebkitTextStroke: '0.75px #16241B' }}
              >
                Verified Vets.
              </span>
              <br className="hidden sm:inline" /> Book an Appointment Today.
            </>
          }
          subtitle="Connect with top-rated licensed veterinarians near you for in-clinic consultations and expert pet care."
          customSrc="https://res.cloudinary.com/vphylrop/image/upload/v1788886319/ChatGPT_Image_Sep_8_2026_10_21_30_PM.png"
        />

      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default FindVetPage;
