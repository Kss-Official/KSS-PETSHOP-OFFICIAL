import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
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
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const serviceCards = [
    {
      id: 'vet-care',
      title: 'Veterinary Care',
      description: 'Expert medical care for your pets by trusted veterinarians.',
      icon: Stethoscope,
      iconBg: 'bg-[#E6F9EC]',
      iconText: 'text-[#287A41]',
      placeholderLabel: 'Beagle Dog',
    },
    {
      id: 'grooming',
      title: 'Grooming',
      description: 'Professional grooming to keep your pet clean and cute.',
      icon: Scissors,
      iconBg: 'bg-[#FEF9C3]',
      iconText: 'text-[#B45309]',
      placeholderLabel: 'Grooming Dog',
    },
    {
      id: 'nutrition',
      title: 'Pet Nutrition',
      description: 'Balanced diet plans and premium food for a healthier pet.',
      icon: Utensils,
      iconBg: 'bg-[#FFE4E6]',
      iconText: 'text-[#E11D48]',
      placeholderLabel: 'Cat with Food Bowl',
    },
    {
      id: 'boarding',
      title: 'Boarding',
      description: "Safe, comfortable, and fun stays while you're away.",
      icon: Home,
      iconBg: 'bg-[#E0F2FE]',
      iconText: 'text-[#0284C7]',
      placeholderLabel: 'Puppy in Pet Bed',
    },
    {
      id: 'walking',
      title: 'Pet Walking',
      description: 'Daily walks and exercise to keep your pet active.',
      icon: Footprints,
      iconBg: 'bg-[#F3E8FF]',
      iconText: 'text-[#7E22CE]',
      placeholderLabel: 'Dog on Leash',
    },
    {
      id: 'training',
      title: 'Training',
      description: 'Obedience and behavior training by certified experts.',
      icon: Award,
      iconBg: 'bg-[#DCFCE7]',
      iconText: 'text-[#15803D]',
      placeholderLabel: 'Pomeranian Training',
    },
    {
      id: 'insurance',
      title: 'Pet Insurance',
      description: "Comprehensive insurance for your pet's peace of mind.",
      icon: ShieldCheck,
      iconBg: 'bg-[#FFEDD5]',
      iconText: 'text-[#C2410C]',
      placeholderLabel: 'Fluffy Persian Cat',
    },
    {
      id: 'transport',
      title: 'Pet Transport',
      description: 'Safe and reliable transportation for your pets.',
      icon: Truck,
      iconBg: 'bg-[#FCE7F3]',
      iconText: 'text-[#BE185D]',
      placeholderLabel: 'Dog in Pet Carrier',
    },
  ];

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
      description: 'Our experts provide the best care and attention.',
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
      subtitle: 'Quality care at the best prices.',
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
                  <span className="text-[#EF7C3C]">Tails Wag</span> And Hearts
                  Happy.
                </h1>
                <p className="text-base sm:text-lg text-[#556658] max-w-xl font-medium leading-relaxed">
                  Explore our wide range of pet care services designed to keep
                  your furry friends healthy, happy, and loved.
                </p>
              </div>

              {/* Right Column: Hero Image Placeholder on Organic Blob */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                {/* Organic Green Blob Shape */}
                <div className="absolute inset-0 bg-[#D8F3DC]/70 rounded-[48%_52%_68%_32%/42%_58%_42%_58%] -rotate-3 scale-105 pointer-events-none blur-xs" />

                {/* Decorative Doodles */}
                <span className="absolute -top-3 left-6 text-2xl text-[#3FA65C] select-none pointer-events-none animate-pulse">
                  🐾
                </span>
                <span className="absolute top-8 right-4 text-2xl text-[#EF7C3C] select-none pointer-events-none">
                  ❤️
                </span>
                <div className="absolute -bottom-2 left-10 w-12 h-6 border-b-2 border-dashed border-[#3FA65C]/60 rounded-full pointer-events-none" />

                {/* Hero Group Photo Container */}
                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#D0EBD5] shadow-lg bg-white z-10">
                  <ImagePlaceholder
                    label="Group of Pets (Dog, Rabbit, Hamster, Lizard, Cockatiel)"
                    className="rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Our Pet Care Services (8-Card Grid) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#EF7C3C] text-xs font-black uppercase tracking-wider">
                  WHAT WE OFFER 🐾
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                  Our Pet Care Services
                </h2>
              </div>

              <button className="bg-[#3FA65C] hover:bg-[#348e4e] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer">
                View All Services ›
              </button>
            </div>

            {/* 8-Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceCards.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-[24px] p-4 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Photo Container with Top-Left Icon Badge */}
                    <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-[#FAF6EE] border border-[#EAE3D2]">
                      <ImagePlaceholder
                        label={service.placeholderLabel}
                        className="rounded-[18px]"
                      />

                      {/* Overlapping Icon Badge */}
                      <div
                        className={`absolute top-3 left-3 w-9 h-9 rounded-full ${service.iconBg} ${service.iconText} flex items-center justify-center shadow-xs border border-white/80`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="pt-4 flex flex-col flex-grow">
                      <h3 className="text-base font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#556658] font-medium leading-relaxed mt-1.5 mb-4 flex-grow">
                        {service.description}
                      </p>
                      <button className="text-xs font-bold text-[#3FA65C] hover:text-[#2e7d44] transition-colors flex items-center gap-1 mt-auto cursor-pointer">
                        Learn More ›
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. How It Works (4-Step Horizontal Flow) */}
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
                {/* Step Circle with Dashed Green Border & Number Badge */}
                <div className="relative mb-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-dashed border-[#3FA65C] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                    <span className="text-3xl select-none" role="img" aria-label={stepItem.title}>
                      {stepItem.emoji}
                    </span>
                  </div>

                  {/* Top-Right Number Badge */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#16241B] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                    {stepItem.step}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-black text-[#16241B]">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-[#556658] font-medium max-w-[220px] leading-relaxed mt-1.5">
                  {stepItem.description}
                </p>

                {/* Connecting Arrow for Desktop (between items) */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-10 -right-4 lg:-right-6 w-8 lg:w-12 items-center justify-center pointer-events-none z-10 text-[#16241B]/40">
                    <ArrowRight className="w-5 h-5 text-[#3FA65C]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 5. CTA Banner (Reused Gold Component with Corgi Sunglasses) */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Pamper Your Pet With The{' '}
                  <span className="text-[#EF7C3C]">Best Care</span> They
                  Deserve!
                </h2>
                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  From health to happiness, we're here for every step of your
                  pet's journey.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button className="px-7 py-3.5 bg-[#3FA65C] hover:bg-[#348e4e] text-white font-black rounded-full shadow-md transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer">
                    Book a Service →
                  </button>

                  <button className="px-6 py-3.5 bg-white hover:bg-[#FAF6EE] text-[#16241B] border border-[#E5DFCE] font-bold rounded-full shadow-xs transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer">
                    Talk to Our Expert 📞
                  </button>
                </div>
              </div>

              {/* Right Image Placeholder (Corgi with Sunglasses) */}
              <div className="lg:col-span-5 flex justify-center items-center relative z-20">
                <div className="w-full max-w-[340px] aspect-square rounded-3xl overflow-hidden border-2 border-white/60 shadow-lg bg-white/90">
                  <ImagePlaceholder
                    label="Corgi with Sunglasses"
                    className="rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Feature Strip (4 Items) */}
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
