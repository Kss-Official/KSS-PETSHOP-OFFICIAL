import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import { getCloudinaryImageUrl } from '../../lib/utils';
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
} from 'lucide-react';

interface VetDoctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  address: string;
  openStatus: string;
  category: 'clinic' | 'hospital';
  lat: number;
  lng: number;
  pinColor: string;
  placeholderLabel: string;
}

export const FindVetPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Open Now' | 'Clinic' | 'Hospital'>('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [locationSearch, setLocationSearch] = useState('MG Road, Bangalore');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

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

  const doctorsList: VetDoctor[] = [
    {
      id: '1',
      name: 'Dr. Rahul Sharma',
      specialization: 'General Veterinarian',
      rating: 4.8,
      reviewsCount: 128,
      distanceKm: 1.2,
      address: 'Pawfect Care Clinic, Brigade Road',
      openStatus: 'Open Now',
      category: 'clinic',
      lat: 12.9730,
      lng: 77.6080,
      pinColor: '#3FA65C',
      placeholderLabel: 'Dr. Rahul S.',
    },
    {
      id: '2',
      name: 'Dr. Priya Mehta',
      specialization: 'Veterinary Surgeon',
      rating: 4.9,
      reviewsCount: 96,
      distanceKm: 1.5,
      address: 'City Pet Surgical Center, Residency Rd',
      openStatus: 'Open Now',
      category: 'hospital',
      lat: 12.9715,
      lng: 77.6030,
      pinColor: '#EF7C3C',
      placeholderLabel: 'Dr. Priya M.',
    },
    {
      id: '3',
      name: 'Dr. Arjun Verma',
      specialization: 'Exotic Pet Specialist',
      rating: 4.7,
      reviewsCount: 78,
      distanceKm: 2.1,
      address: 'Fauna Animal Hospital, Indiranagar',
      openStatus: 'Open Now',
      category: 'hospital',
      lat: 12.9780,
      lng: 77.6140,
      pinColor: '#8B5CF6',
      placeholderLabel: 'Dr. Arjun V.',
    },
    {
      id: '4',
      name: 'Dr. Neha Kapoor',
      specialization: 'Avian & Exotic Veterinarian',
      rating: 4.6,
      reviewsCount: 64,
      distanceKm: 2.8,
      address: 'Feather & Fur Clinic, Ulsoor',
      openStatus: 'Closes 8 PM',
      category: 'clinic',
      lat: 12.9810,
      lng: 77.6010,
      pinColor: '#06B6D4',
      placeholderLabel: 'Dr. Neha K.',
    },
  ];

  const popularSearches = ['Emergency Vet', 'Dental Care', 'Puppy Vaccination'];

  const filteredDoctors = doctorsList.filter((doc) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Open Now') return doc.openStatus === 'Open Now';
    if (selectedFilter === 'Clinic') return doc.category === 'clinic';
    if (selectedFilter === 'Hospital') return doc.category === 'hospital';
    return true;
  });

  // Initialize interactive Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const centerLat = 12.9756;
    const centerLng = 77.6066;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Standard OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Custom pulse icon for User location (Red pin)
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
        <strong style="color: #16241B; font-size: 13px;">📍 Your Location</strong>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #556658;">MG Road, Bangalore</p>
      </div>
    `);

    // Doctor clinic markers
    doctorsList.forEach((doc) => {
      const docIcon = L.divIcon({
        className: 'custom-doc-marker',
        html: `
          <div style="
            background: ${doc.pinColor};
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
          <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #16241B;">${doc.name}</h4>
          <p style="margin: 2px 0; font-size: 11px; color: #3FA65C; font-weight: 600;">${doc.specialization}</p>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #556658; margin-top: 4px;">
            <span style="color: #F5A623;">★ ${doc.rating}</span>
            <span>(${doc.reviewsCount} reviews)</span>
          </div>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #888;">📍 ${doc.distanceKm} km away</p>
        </div>
      `);
    });

    // Faint route dashed polyline to the closest vet
    const nearestDoc = doctorsList[0];
    L.polyline(
      [
        [centerLat, centerLng],
        [nearestDoc.lat, nearestDoc.lng],
      ],
      {
        color: '#3FA65C',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.7,
      }
    ).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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
                      {['MG Road, Bangalore', 'Indiranagar, Bangalore', 'Koramangala, Bangalore', 'Whitefield, Bangalore'].map((loc) => (
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
                  Compassionate care for your pets. Find trusted veterinarians in your area.
                </p>

                {/* Single White Search Bar (3 elements) */}
                <div className="bg-white p-2.5 sm:p-3 rounded-3xl sm:rounded-full border border-[#D5EAD9] shadow-[0_12px_35px_-8px_rgba(40,122,65,0.12)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Location Input */}
                  <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                    <MapPin className="w-4 h-4 text-[#3FA65C] shrink-0" />
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Enter location..."
                      className="w-full text-sm font-semibold text-[#1B2B1E] placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Specialization Dropdown */}
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

                  {/* Submit Button */}
                  <Button variant="primary" size="md" className="rounded-full px-6 py-3 shrink-0 flex items-center justify-center gap-2 text-sm font-black">
                    <Search className="w-4 h-4" />
                    Find a Vet
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

              {/* Right Hero Image Slot with Floating Speech Bubble Callout */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="relative w-full max-w-[420px] aspect-[4/3.5] rounded-3xl overflow-hidden bg-white/70 border-2 border-[#D5EAD9] p-3 shadow-lg flex items-center justify-center">
                  <ImagePlaceholder
                    label="Group photo of dog, rabbit, guinea pig, parrot & tortoise"
                    className="rounded-2xl"
                  />

                  {/* Speech Bubble Callout */}
                  <div className="absolute -top-4 -right-2 sm:-right-4 bg-[#FFE8A3] border border-[#F5D875] text-[#1B2B1E] px-4 py-2 rounded-2xl rounded-br-none shadow-xl text-xs font-black flex items-center gap-2 animate-float-slow z-20">
                    <span>Your pet's health. Our priority! ❤️</span>
                  </div>

                  {/* Decorative Paw Print Badge */}
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
            <button className="text-sm font-extrabold text-[#3FA65C] hover:text-[#2E8B48] flex items-center gap-1 transition-colors cursor-pointer">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 9 Specialization Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
            {specializations.map((spec) => {
              const IconComp = spec.icon;
              return (
                <div
                  key={spec.name}
                  onClick={() => setSelectedSpecialization(spec.name)}
                  className="bg-white rounded-2xl p-3 border border-[#EDE7D9] shadow-xs hover:shadow-md hover:border-[#3FA65C] transition-all duration-200 flex flex-col items-center text-center cursor-pointer group"
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

        {/* 4. Top Veterinarians Near You + Our Location (Two Column) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Top Veterinarians (8 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-black text-[#1B2B1E] tracking-tight">
                  Top Veterinarians Near You
                </h2>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {(['All', 'Open Now', 'Clinic', 'Hospital'] as const).map((filter) => (
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

              {/* Stacked Doctor Cards */}
              <div className="space-y-4">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Circular Photo Placeholder */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 border-2 border-[#E5DFCE] shadow-xs">
                        <ImagePlaceholder label={doc.placeholderLabel} className="rounded-full" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-[#1B2B1E]">
                            {doc.name}
                          </h3>
                          <span title="Verified Veterinarian" className="inline-flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-[#3FA65C] shrink-0" />
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-[#EF7C3C]">
                          {doc.specialization}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#556658] pt-0.5">
                          <span className="flex items-center gap-1 text-[#F5A623] font-extrabold">
                            <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating}
                          </span>
                          <span>({doc.reviewsCount} reviews)</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#1B2B1E]">
                            <MapPin className="w-3 h-3 text-[#3FA65C]" /> {doc.distanceKm} km away
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className="text-[11px] font-bold text-[#287A41] bg-[#E3F3E9] px-2.5 py-1 rounded-full">
                        {doc.openStatus}
                      </span>
                      <button className="px-5 py-2 rounded-full border-2 border-[#3FA65C] text-[#3FA65C] hover:bg-[#3FA65C] hover:text-white font-extrabold text-xs transition-colors cursor-pointer">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <button className="w-full py-3.5 rounded-2xl border-2 border-[#3FA65C] text-[#3FA65C] hover:bg-[#3FA65C] hover:text-white font-black text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                View All Veterinarians <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column: Our Location Live Map (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2B1E] tracking-tight">
                Our Location
              </h2>

              <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#EDE7D9] shadow-sm space-y-3">
                {/* Live Interactive Leaflet Map Container */}
                <div
                  ref={mapContainerRef}
                  className="w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden z-10 border border-[#E2DDD2]"
                />

                {/* Below Map Info Bar */}
                <div className="flex items-center justify-between text-xs font-semibold px-1 pt-1">
                  <div className="flex items-center gap-2 text-[#1B2B1E]">
                    <div className="w-6 h-6 rounded-full bg-[#EFF8F0] border border-[#D5EAD9] flex items-center justify-center text-[#3FA65C] shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-extrabold block">Your Location</span>
                      <span className="text-[#556658] text-[11px]">MG Road, Bangalore, Karnataka</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLocationDropdownOpen(true)}
                    className="text-[#3FA65C] hover:text-[#2E8B48] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Change Location <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Feature Strip (4 Cards) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="bg-[#E3F3E9] rounded-3xl p-5 border border-[#C5E9D0] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#287A41] flex items-center justify-center shadow-xs mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Verified Veterinarians</h3>
                <p className="text-xs text-[#445548] leading-snug">All vets are verified and highly qualified.</p>
              </div>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xs">
                <ImagePlaceholder label="Cat" className="rounded-2xl" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FBEEDD] rounded-3xl p-5 border border-[#F4DCBE] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#C2410C] flex items-center justify-center shadow-xs mb-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Nearby Locations</h3>
                <p className="text-xs text-[#445548] leading-snug">Find trusted vets close to you.</p>
              </div>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xs">
                <ImagePlaceholder label="Cat" className="rounded-2xl" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#EDE6F7] rounded-3xl p-5 border border-[#DCD0F0] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#7E22CE] flex items-center justify-center shadow-xs mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Flexible Appointments</h3>
                <p className="text-xs text-[#445548] leading-snug">Book appointments that fit your schedule.</p>
              </div>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xs">
                <ImagePlaceholder label="Rabbit" className="rounded-2xl" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FBE4E9] rounded-3xl p-5 border border-[#F6CBD5] relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-xs">
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="w-8 h-8 rounded-full bg-white text-[#E11D48] flex items-center justify-center shadow-xs mb-2">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#1B2B1E]">Compassionate Care</h3>
                <p className="text-xs text-[#445548] leading-snug">Your pet's health is our top priority.</p>
              </div>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xs">
                <ImagePlaceholder label="Guinea Pig" className="rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA Banner */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 overflow-visible">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Left 3D Cat with Sunglasses */}
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

              {/* Right Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Happy Pet. Happy Home.<br className="hidden sm:inline" /> <span className="text-[#EF7C3C]">It's That Simple.</span>
                </h2>
                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Join thousands of pet parents who trust us for everything their pets need.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button className="px-8 py-3.5 bg-[#16241B] hover:bg-[#253A2C] text-white font-black rounded-full shadow-[0_8px_20px_rgba(22,36,27,0.3)] transition-all flex items-center gap-2 text-base cursor-pointer">
                    🐾 Join the Pack
                  </button>

                  <div className="bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-full border border-white/50 shadow-xs flex items-center gap-2">
                    <span className="text-xs font-bold text-[#16241B]">
                      4.8/5 ⭐⭐⭐⭐⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};

export default FindVetPage;
