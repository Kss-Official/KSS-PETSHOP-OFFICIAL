import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CtaBanner } from '../../components/layout/CtaBanner';
import { getCloudinaryImageUrl, getVetImageUrl } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../features/auth/AuthContext';
import {
  ChevronRight,
  Stethoscope,
  Utensils,
  Scissors,
  Pill,
  Gamepad2,
  Calendar,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Sparkles,
  Headphones,
} from 'lucide-react';

interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
}

interface VetItem {
  id: number;
  name: string;
  specialization: string;
  secondarySpecialization?: string;
  petTypes?: string;
  experienceYears?: number;
  reviewsCount?: number;
  city?: string;
  consultationFee?: number;
  photoUrl?: string;
  rating?: number;
}

export const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [vets, setVets] = useState<VetItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingVets, setLoadingVets] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Cloudinary image assets
  const heroCloudinaryUrl = getCloudinaryImageUrl('hero_dog_cat_green_bg');
  const service01Url = getCloudinaryImageUrl('service_01_vet_care');
  const service02Url = getCloudinaryImageUrl('service_03_grooming_puppy_tub');
  const service03Url = getCloudinaryImageUrl('service_02_pet_food_rabbit_bowl');
  const service04Url = getCloudinaryImageUrl('service_04_pharmacy_cat_med');
  const service05Url = getCloudinaryImageUrl('service_05_toys_kittens_play');
  const avatar1Url = getCloudinaryImageUrl('avatar_user_1');
  const avatar2Url = getCloudinaryImageUrl('avatar_user_2');
  const avatar3Url = getCloudinaryImageUrl('avatar_user_3');
  const avatar4Url = getCloudinaryImageUrl('avatar_user_4');

  const vetScrollRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Dogs', 'Cats', 'Birds', 'Rabbits', 'Exotic Pets'];

  const fetchHomeData = () => {
    setLoadingServices(true);
    setLoadingVets(true);

    apiClient
      .get('/services')
      .then((res) => {
        setServices(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setServices([]);
      })
      .finally(() => setLoadingServices(false));

    apiClient
      .get('/vets')
      .then((res) => {
        setVets(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setVets([]);
      })
      .finally(() => setLoadingVets(false));
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const filteredVets = vets.filter((vet) => {
    if (activeCategory === 'All') return true;
    const petLower = activeCategory.toLowerCase();
    if (vet.petTypes && vet.petTypes.toLowerCase().includes(petLower)) return true;
    if (activeCategory === 'Exotic Pets' && (
      (vet.specialization && vet.specialization.toLowerCase().includes('exotic')) ||
      (vet.petTypes && (vet.petTypes.toLowerCase().includes('bird') || vet.petTypes.toLowerCase().includes('rabbit') || vet.petTypes.toLowerCase().includes('exotic')))
    )) return true;
    return false;
  });

  const handleVetScroll = () => {
    if (vetScrollRef.current) {
      vetScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const getServiceVisuals = (name: string, iconUrl?: string) => {
    const lower = (name || '').toLowerCase();
    let icon = <Sparkles className="w-5 h-5" />;
    let badgeBg = 'bg-[#D6F842] text-[#163824]';
    let defaultImg = service01Url;

    if (lower.includes('vet') || lower.includes('care') || lower.includes('health') || lower.includes('doctor')) {
      icon = <Stethoscope className="w-5 h-5" />;
      badgeBg = 'bg-[#D6F842] text-[#163824]';
      defaultImg = service01Url;
    } else if (lower.includes('food') || lower.includes('nutri') || lower.includes('diet')) {
      icon = <Utensils className="w-5 h-5" />;
      badgeBg = 'bg-[#FEE440] text-[#634700]';
      defaultImg = service03Url;
    } else if (lower.includes('groom') || lower.includes('bath') || lower.includes('spa')) {
      icon = <Scissors className="w-5 h-5" />;
      badgeBg = 'bg-[#FFD6E8] text-[#9E1B58]';
      defaultImg = service02Url;
    } else if (lower.includes('pharm') || lower.includes('med') || lower.includes('drug')) {
      icon = <Pill className="w-5 h-5" />;
      badgeBg = 'bg-[#BAE6FD] text-[#0369A1]';
      defaultImg = service04Url;
    } else if (lower.includes('toy') || lower.includes('play') || lower.includes('enrich')) {
      icon = <Gamepad2 className="w-5 h-5" />;
      badgeBg = 'bg-[#E9D5FF] text-[#6B21A8]';
      defaultImg = service05Url;
    } else if (lower.includes('board') || lower.includes('daycare') || lower.includes('stay')) {
      icon = <ShieldCheck className="w-5 h-5" />;
      badgeBg = 'bg-[#FED7AA] text-[#9A3412]';
      defaultImg = avatar2Url;
    } else if (lower.includes('train') || lower.includes('behav') || lower.includes('class')) {
      icon = <Sparkles className="w-5 h-5" />;
      badgeBg = 'bg-[#C7D2FE] text-[#3730A3]';
      defaultImg = avatar3Url;
    } else if (lower.includes('trans') || lower.includes('ambul') || lower.includes('ride')) {
      icon = <Truck className="w-5 h-5" />;
      badgeBg = 'bg-[#FBCFE8] text-[#9D174D]';
      defaultImg = avatar4Url;
    }

    const img = iconUrl ? getCloudinaryImageUrl(iconUrl) : defaultImg;
    return { icon, badgeBg, img };
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] flex flex-col font-sans selection:bg-[#EF7C3C]/20 selection:text-[#EF7C3C]">
      {/* 1. Navbar */}
      <Navbar activePage="home" />

      <main className="flex-1 space-y-16 md:space-y-24 py-8 md:py-12">
        {/* 2. Hero Section */}
        <section id="home" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Hero Left Content (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-20">
              <Badge variant="orange" className="inline-flex">
                ALL THE LOVE. ALL THE CARE.
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#16241B] leading-[1.1] font-sans">
                Because Your Pet Has{' '}
                <span className="text-[#EF7C3C]">Better Taste</span> Than You.
              </h1>

              <p className="text-base sm:text-lg text-[#445548] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Expert vets, ridiculously good food, toys, treats and everything
                your furry roommate needs — all in one happy place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/find-a-vet">
                  <Button variant="primary" size="lg">
                    Find a Vet
                  </Button>
                </Link>
                <Link to="/pharmacy">
                  <Button variant="secondary" size="lg">
                    Shop Essentials
                  </Button>
                </Link>
              </div>

              {/* Social Proof Row */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EE] object-cover object-top shadow-xs"
                    src={avatar1Url}
                    alt="Pet Parent 1"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EE] object-cover object-top shadow-xs"
                    src={avatar2Url}
                    alt="Pet Parent 2"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EE] object-cover object-top shadow-xs"
                    src={avatar3Url}
                    alt="Pet Parent 3"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EE] object-cover object-top shadow-xs"
                    src={avatar4Url}
                    alt="Pet Parent 4"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#334437]">
                  Loved by 25,000+<br />
                  pets & parents
                </span>
              </div>
            </div>

            {/* Hero Right Visual Stack */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end items-center lg:translate-x-14 xl:translate-x-20">
              <div className="relative w-full max-w-[1000px] lg:max-w-[1350px] flex items-center justify-center lg:justify-end overflow-visible py-6 sm:py-8">
                {/* Main Hero Cutout Image */}
                <div className="w-full relative flex items-center justify-center lg:justify-end overflow-visible z-10">
                  <img
                    src={heroCloudinaryUrl}
                    alt="Dog and Cat"
                    className="w-full max-h-[680px] sm:max-h-[780px] lg:max-h-[880px] scale-110 lg:scale-120 object-contain drop-shadow-2xl origin-right"
                  />
                </div>

                {/* Floating Callout Cards */}
                <div className="absolute -top-6 left-[22%] sm:left-[26%] -translate-x-1/2 bg-[#EE9D1A] border border-[#D98A00] text-[#16241B] px-4 py-2 rounded-2xl rounded-bl-none shadow-xl text-xs sm:text-sm font-bold flex flex-col animate-float-slow z-20">
                  <span className="font-bold text-black leading-tight">Your pet called.</span>
                  <span className="font-medium text-black/90 text-[11px] sm:text-xs">They need a vet.</span>
                </div>

                <div className="absolute top-2 right-2 sm:right-6 lg:right-10 bg-white border border-[#EBE5D6] text-[#16241B] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed z-20 whitespace-nowrap">
                  <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-base shrink-0">
                    🍪
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-none mb-0.5">Professional</span>
                    <span className="text-xs sm:text-sm font-bold text-[#16241B] leading-tight">Treat Tester</span>
                  </div>
                </div>

                <div className="absolute top-[36%] sm:top-[38%] -left-6 sm:-left-12 lg:-left-16 -translate-y-1/2 bg-[#C5EAD4] border border-[#A7DBC0] text-[#16241B] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl flex flex-col gap-0.5 animate-float-slow z-20">
                  <span className="text-[11px] sm:text-xs text-[#285A3F] font-medium leading-tight">Always</span>
                  <span className="text-sm sm:text-base font-bold text-[#16241B] leading-tight tracking-tight">Ready For</span>
                  <span className="text-xs sm:text-sm text-[#285A3F] font-bold leading-tight">Treats</span>
                </div>

                <div className="absolute -bottom-4 sm:-bottom-5 left-[6%] sm:left-[10%] bg-[#FDF0AA] border border-[#F3E188] text-[#16241B] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed z-20">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] sm:text-[11px] text-[#6B5A10] font-medium leading-none mb-1">Appointment</span>
                    <span className="text-xs sm:text-sm font-bold text-[#16241B] flex items-center gap-1">
                      Booked <span className="text-[#059669] font-bold">✓</span>
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/80 border border-[#E9D575] flex items-center justify-center text-[#16241B] shrink-0 shadow-xs">
                    <Calendar className="w-4 h-4 text-[#854D0E]" />
                  </div>
                </div>

                <div className="absolute -bottom-4 sm:-bottom-5 right-4 sm:right-8 lg:right-12 bg-[#FCE3E4] border border-[#F9C3C6] text-[#16241B] px-4 py-2.5 rounded-2xl shadow-xl flex flex-col animate-float-slow z-20">
                  <span className="text-[10px] sm:text-[11px] text-[#9F1239] font-bold mb-0.5">10/10</span>
                  <span className="text-xs sm:text-sm font-bold text-[#9F1239] leading-tight">Good Boy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Trust Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4 lg:-mt-6 relative z-20">
          <div className="bg-white/95 backdrop-blur-sm border border-[#E8DFC8] rounded-full shadow-[0_20px_45px_-12px_rgba(22,36,27,0.12),0_4px_16px_rgba(22,36,27,0.04)] px-6 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#EFE8DA] transition-all duration-300 hover:shadow-[0_24px_50px_-10px_rgba(22,36,27,0.16)]">
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span>Good dogs welcome</span>
            </div>
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span>Cats are in charge</span>
            </div>
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span>Tiny paws, big personalities</span>
            </div>
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span>No judgment. Only treats.</span>
            </div>
          </div>
        </section>

        {/* 4. Services Section */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-3.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase bg-[#FCE8DB] text-[#223328] shadow-xs">
                WE'VE GOT EVERYTHING ❤️
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-[46px] font-black text-[#14261C] tracking-tight leading-[1.08]">
                Basically, <span className="text-[#EF7C3C]">Everything</span> Your<br className="hidden sm:inline" /> Pet Could Ask For.
              </h2>
            </div>
            <Link to="/services">
              <Button variant="primary" size="md" className="shrink-0 self-start sm:self-auto">
                Explore All Services
              </Button>
            </Link>
          </div>

          {/* Dynamic Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-5 pt-2">
            {loadingServices ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[28px] p-3.5 border border-[#ECE5D8] space-y-3">
                  <Skeleton className="w-full aspect-[3/4.2] rounded-[22px]" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            ) : services.length > 0 ? (
              services.slice(0, 5).map((service, index) => {
                const { icon, badgeBg, img } = getServiceVisuals(service.name, service.iconUrl);

                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-[28px] p-3 sm:p-3.5 border border-[#ECE5D8] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] relative flex flex-col group transition-all duration-300"
                  >
                    <div className={`absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border-2 border-white flex items-center justify-center shadow-md z-20 ${badgeBg}`}>
                      {icon}
                    </div>

                    <div className="relative w-full aspect-[3/4.2] rounded-[22px] overflow-hidden bg-[#F4EFE6] mb-2.5">
                      <img
                        src={img}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="px-1 pt-0.5 pb-0.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-black text-[#EF7C3C] tracking-wide block leading-none mb-1">
                          0{index + 1}
                        </span>
                        <h3 className="text-base font-black text-[#14261C] tracking-tight leading-tight group-hover:text-[#EF7C3C] transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-[11px] text-[#5D6F63] font-medium leading-snug line-clamp-2 mt-1">
                          {service.description || 'Comprehensive, loving care designed for your pet.'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-[#5D6F63] text-sm font-semibold">
                No services available at the moment.
              </div>
            )}
          </div>
        </section>

        {/* 5. Category Filter Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="bg-white border border-[#EDE6D8] rounded-full p-1.5 shadow-xs inline-flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? 'bg-[#16241B] text-white shadow-xs'
                    : 'text-[#556658] hover:text-[#16241B] hover:bg-[#FAF6EE]'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* 6. Vets Section */}
        <section id="vets" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 relative">
              <Badge variant="orange" className="inline-flex">
                BEST CARE, RIGHT NEAR YOU
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16241B] tracking-tight">
                Meet Their New <span className="text-[#EF7C3C]">Favorite</span> Human.
              </h2>
              <p className="text-base text-[#445548] leading-relaxed">
                Verified vets. Happy pets. Less worry for you.
              </p>

              {/* Spacer + P.S. Badge */}
              <div className="pt-2 space-y-3.5 relative">
                <div className="h-12" aria-hidden="true" />

                <div className="relative inline-flex items-center ml-10 sm:ml-20 lg:ml-28">
                  <div className="inline-flex items-center bg-white border border-[#E8E2D4] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-[#16241B] flex items-center gap-1.5">
                      P.S. They'll get extra treats
                    </span>
                  </div>

                  <div className="hidden sm:block absolute left-[52%] bottom-[80%] w-52 sm:w-60 lg:w-68 h-28 pointer-events-none z-10">
                    <svg
                      className="w-full h-full text-[#14261C] overflow-visible"
                      viewBox="0 0 240 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M 8,92 C 12,28 50,8 115,10 C 160,12 190,24 225,18" />
                      <path d="M 212,10 L 228,18 L 215,27" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Cards Stack / Slider */}
            <div className="lg:col-span-7 relative">
              <div
                ref={vetScrollRef}
                className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
              >
                {loadingVets ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="w-[300px] sm:w-[320px] shrink-0 bg-white rounded-2xl p-4 border border-[#ECE5D8] space-y-3">
                      <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  ))
                ) : filteredVets.length > 0 ? (
                  filteredVets.map((vet) => (
                    <Card
                      key={vet.id}
                      onClick={() => navigate(isAuthenticated ? `/profile?tab=appointments&vetId=${vet.id}` : '/login')}
                      className="w-[300px] sm:w-[320px] shrink-0 space-y-4 group bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                        <img
                          src={getVetImageUrl(vet.name, vet.photoUrl, vet.id)}
                          alt={vet.name}
                          className="w-full h-full object-cover object-[center_20%] rounded-2xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-extrabold text-[#16241B] shadow-xs flex items-center gap-1 z-10">
                          <span className="text-yellow-500">★</span> {vet.rating ? vet.rating.toFixed(1) : '4.9'}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#16241B] group-hover:text-[#EF7C3C] transition-colors">
                          {vet.name}
                        </h3>
                        <p className="text-xs font-bold text-[#EF7C3C] mt-0.5">
                          {vet.specialization}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs text-[#556658]">
                        <p className="font-semibold">{vet.experienceYears || 10}+ years experience</p>
                        <p className="font-semibold text-[#16241B] line-clamp-1">{vet.secondarySpecialization || vet.specialization}</p>
                        <p className="font-semibold text-[#16241B] pt-0.5 flex items-center gap-1">
                          <span className="text-[#EF7C3C]">📍</span> {vet.city || 'New York, USA'}
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="w-full py-8 text-center text-[#5D6F63] text-sm font-semibold">
                    No veterinarians listed for {activeCategory} at this time.
                  </div>
                )}
              </div>

              {/* Scroll Right Arrow Button */}
              <button
                onClick={handleVetScroll}
                aria-label="Next vet"
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E5DFCE] shadow-md flex items-center justify-center text-[#16241B] hover:bg-[#FAF6EE] transition-all cursor-pointer z-10 hidden sm:flex"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 7. Shared CTA Banner */}
        <CtaBanner />

        {/* 8. Feature Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[#EDE6D8]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center text-[#287A41] shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#16241B]">
                  24/7 Vet Support
                </h4>
                <p className="text-xs text-[#556658]">We're always here</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#16241B]">
                  Verified Vets Only
                </h4>
                <p className="text-xs text-[#556658]">100% background checked</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#8C6D00] shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#16241B]">
                  In-Store Pickup Available
                </h4>
                <p className="text-xs text-[#556658]">Ready at your nearest clinic</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FCE7F3] flex items-center justify-center text-[#9D174D] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#16241B]">
                  Happiness Guarantee
                </h4>
                <p className="text-xs text-[#556658]">Or your money back</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

