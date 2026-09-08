import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
import {
  Stethoscope,
  Scissors,
  Utensils,
  Home,
  Footprints,
  Award,
  ShieldCheck,
  Truck,
  ArrowRight,
  Headphones,
  Shield,
  Lock,
  Coins,
  Sparkles,
} from 'lucide-react';

interface ServiceDto {
  id: number;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  durationMinutes: number;
  available: boolean;
  imageUrl?: string;
}

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchServices = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/services')
      .then((res) => {
        setServices(res.data || []);
      })
      .catch(() => {
        setError('Failed to load services. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const serviceIconsMap: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
    'Vet Care': { icon: Stethoscope, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]' },
    'Veterinary Care': { icon: Stethoscope, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]' },
    'Grooming': { icon: Scissors, bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]' },
    'Pet Food': { icon: Utensils, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]' },
    'Pet Nutrition': { icon: Utensils, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]' },
    'Boarding': { icon: Home, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]' },
    'Pet Walking': { icon: Footprints, bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]' },
    'Training': { icon: Award, bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' },
    'Pet Insurance': { icon: ShieldCheck, bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]' },
    'Pet Transport': { icon: Truck, bg: 'bg-[#FCE7F3]', text: 'text-[#BE185D]' },
    'Pharmacy': { icon: Sparkles, bg: 'bg-[#BAE6FD]', text: 'text-[#0369A1]' },
  };

  const howItWorksSteps = [
    {
      step: '01',
      emoji: '📅',
      title: 'Choose a Service',
      description: 'Browse and select the service your pet needs.',
    },
    {
      step: '02',
      emoji: '📄',
      title: 'Book an Appointment',
      description: 'Pick a convenient time and confirm your booking.',
    },
    {
      step: '03',
      emoji: '🏠',
      title: 'We Care for Your Pet',
      description: 'Our certified experts provide the best care and attention.',
    },
    {
      step: '04',
      emoji: '🐱',
      title: 'Happy Pet, Happy You',
      description: 'Your pet stays happy, healthy, and loved.',
    },
  ];

  const featureItems = [
    {
      icon: Headphones,
      emoji: '🎧',
      bg: 'bg-[#E6F9EC]',
      text: 'text-[#287A41]',
      title: '24/7 Support',
      subtitle: "We're here anytime you need us.",
    },
    {
      icon: Shield,
      emoji: '🛡️',
      bg: 'bg-[#E0F2FE]',
      text: 'text-[#0284C7]',
      title: 'Expert Care',
      subtitle: 'Certified professionals you can trust.',
    },
    {
      icon: Lock,
      emoji: '🔒',
      bg: 'bg-[#FFEDD5]',
      text: 'text-[#C2410C]',
      title: 'Safe & Secure',
      subtitle: "Top priority for your pet's safety.",
    },
    {
      icon: Coins,
      emoji: '💰',
      bg: 'bg-[#FFE4E6]',
      text: 'text-[#E11D48]',
      title: 'Affordable Prices',
      subtitle: 'Quality care at transparent prices.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col">
      {/* 1. Navbar */}
      <Navbar activePage="services" />

      <main className="flex-grow space-y-16 lg:space-y-24 pb-20">
        {/* 2. Hero Section */}
        <section className="bg-[#EFF8F0] border-b border-[#E2EEDB] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Heading & Paragraph */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Services That Make{' '}
                  <span className="text-[#EF7C3C]">Tails Wag</span> And Hearts Happy.
                </h1>
                <p className="text-base sm:text-lg text-[#556658] max-w-xl font-medium leading-relaxed">
                  Explore our verified range of pet care services designed to keep your furry friends healthy, happy, and loved.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link to="/find-a-vet">
                    <button className="px-6 py-3 bg-[#009E66] hover:bg-[#008757] text-white font-extrabold rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer">
                      Book a Vet Visit 🐾
                    </button>
                  </Link>
                  <Link to="/pharmacy">
                    <button className="px-6 py-3 bg-white hover:bg-[#FAF6EE] text-[#16241B] border border-[#E5DFCE] font-bold rounded-full shadow-xs transition-all cursor-pointer">
                      Explore Pharmacy 💊
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Image with Organic Blob */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                <div className="absolute inset-0 bg-[#D8F3DC]/70 rounded-[48%_52%_68%_32%/42%_58%_42%_58%] -rotate-3 scale-105 pointer-events-none blur-xs" />
                <span className="absolute -top-3 left-6 text-2xl text-[#3FA65C] select-none pointer-events-none animate-pulse">
                  🐾
                </span>
                <span className="absolute top-8 right-4 text-2xl text-[#EF7C3C] select-none pointer-events-none">
                  ❤️
                </span>

                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#D0EBD5] shadow-lg bg-white z-10">
                  <img
                    src={getCloudinaryImageUrl('hero_dog_cat_green_bg')}
                    alt="Services Care"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Our Pet Care Services Dynamic Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#EF7C3C] text-xs font-black uppercase tracking-wider">
                  WHAT WE OFFER 🐾
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                  Our Pet Care Services
                </h2>
              </div>

              <Link to="/find-a-vet">
                <button className="bg-[#009E66] hover:bg-[#008757] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer">
                  Find a Clinic ›
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[24px] p-4 border border-[#EDE7D9] space-y-3">
                    <Skeleton className="w-full aspect-[4/3] rounded-[18px]" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={fetchServices} />
            ) : services.length === 0 ? (
              <EmptyState
                title="No services found"
                description="We are currently updating our list of available services."
                actionLabel="Check Again"
                onAction={fetchServices}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => {
                  const iconConfig = serviceIconsMap[service.name] || {
                    icon: Stethoscope,
                    bg: 'bg-[#E6F9EC]',
                    text: 'text-[#287A41]',
                  };
                  const IconComponent = iconConfig.icon;

                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-[24px] p-4 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-[#FAF6EE] border border-[#EAE3D2]">
                        <img
                          src={
                            service.imageUrl ||
                            getCloudinaryImageUrl('service_01_vet_care')
                          }
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        <div
                          className={`absolute top-3 left-3 w-9 h-9 rounded-full ${iconConfig.bg} ${iconConfig.text} flex items-center justify-center shadow-xs border border-white/80`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors">
                            {service.name}
                          </h3>
                          <span className="text-xs font-black text-[#287A41]">
                            ${service.price ? service.price.toFixed(2) : '35.00'}
                          </span>
                        </div>
                        <p className="text-xs text-[#556658] font-medium leading-relaxed mt-1.5 mb-4 flex-grow line-clamp-2">
                          {service.description || service.tagline}
                        </p>
                        <button
                          onClick={() => navigate('/find-a-vet')}
                          className="text-xs font-bold text-[#3FA65C] hover:text-[#2e7d44] transition-colors flex items-center gap-1 mt-auto cursor-pointer"
                        >
                          Book Now ›
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 4. How It Works Flow */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#EF7C3C] text-xs font-black uppercase tracking-wider">
              HOW IT WORKS 🐾
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
              Simple Steps, Happy Pets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative items-start">
            {howItWorksSteps.map((stepItem, index) => (
              <div
                key={stepItem.step}
                className="flex flex-col items-center text-center relative group"
              >
                <div className="relative mb-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-dashed border-[#3FA65C] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                    <span className="text-3xl select-none" role="img" aria-label={stepItem.title}>
                      {stepItem.emoji}
                    </span>
                  </div>

                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#16241B] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                    {stepItem.step}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#16241B]">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-[#556658] font-medium max-w-[220px] leading-relaxed mt-1.5">
                  {stepItem.description}
                </p>

                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-10 -right-4 lg:-right-6 w-8 lg:w-12 items-center justify-center pointer-events-none z-10 text-[#16241B]/40">
                    <ArrowRight className="w-5 h-5 text-[#3FA65C]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 5. CTA Banner */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Pamper Your Pet With The{' '}
                  <span className="text-[#EF7C3C]">Best Care</span> They Deserve!
                </h2>
                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  From health to happiness, we're here for every step of your pet's journey.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={() => navigate('/find-a-vet')}
                    className="px-7 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-md transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    Book a Service →
                  </button>

                  <button
                    onClick={() => navigate('/find-a-vet')}
                    className="px-6 py-3.5 bg-white hover:bg-[#FAF6EE] text-[#16241B] border border-[#E5DFCE] font-bold rounded-full shadow-xs transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    Talk to Our Vet 📞
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center items-center relative z-20">
                <div className="w-full max-w-[340px] aspect-square rounded-3xl overflow-hidden border-2 border-white/60 shadow-lg bg-white/90">
                  <img
                    src={getCloudinaryImageUrl('cta_cat_sunglasses_flawless_seamless')}
                    alt="Corgi with Sunglasses"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Feature Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#EDE7D9] shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featureItems.map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center shrink-0 text-xl shadow-xs`}
                  >
                    <span role="img" aria-label={item.title}>
                      {item.emoji}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#16241B]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#556658] font-medium mt-0.5 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};
