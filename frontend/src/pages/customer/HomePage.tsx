import React, { useState, useRef } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  ChevronRight,
  ArrowRight,
  Stethoscope,
  Utensils,
  Scissors,
  Pill,
  Gamepad2,
  Calendar,
  ShieldCheck,
  Truck,
  Sparkles,
  Headphones,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Cloudinary image assets
  const heroCloudinaryUrl = getCloudinaryImageUrl('hero_dog_cat_green_bg');
  const service01Url = getCloudinaryImageUrl('service_01_vet_care');
  const service02Url = getCloudinaryImageUrl('service_03_grooming_puppy_tub');
  const service03Url = getCloudinaryImageUrl('service_02_pet_food_rabbit_bowl');
  const service04Url = getCloudinaryImageUrl('service_04_pharmacy_cat_med');
  const service05Url = getCloudinaryImageUrl('service_05_toys_kittens_play');
  const vetSarahUrl = getCloudinaryImageUrl('vet_dr_sarah_mitchell');
  const vetJamesUrl = getCloudinaryImageUrl('vet_dr_james_carter');
  const avatar1Url = getCloudinaryImageUrl('avatar_user_1');
  const avatar2Url = getCloudinaryImageUrl('avatar_user_2');
  const avatar3Url = getCloudinaryImageUrl('avatar_user_3');
  const avatar4Url = getCloudinaryImageUrl('avatar_user_4');
  const ctaCatUrl = getCloudinaryImageUrl('cta_cat_sunglasses_flawless_seamless');

  const vetScrollRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Dogs', 'Cats', 'Birds', 'Rabbits', 'Exotic Pets'];

  const handleVetScroll = () => {
    if (vetScrollRef.current) {
      vetScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] flex flex-col font-sans selection:bg-[#EF7C3C]/20 selection:text-[#EF7C3C]">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1 space-y-16 md:space-y-24 py-8 md:py-12">
        {/* 2. Hero Section */}
        <section id="home" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Hero Left Content (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-20">
              <Badge variant="orange" className="inline-flex">
                ALL THE LOVE. ALL THE CARE. ❤️
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
                <Button variant="primary" size="lg">
                  Find a Vet 🐾
                </Button>
                <Button variant="secondary" size="lg">
                  Shop Essentials
                </Button>
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
                  Loved by 25,000+<br></br>
                  pets & parents 🐾
                </span>
              </div>
            </div>

            {/* Hero Right Visual Stack (Shifted Right & Enlarged) */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end items-center lg:translate-x-14 xl:translate-x-20">
              <div className="relative w-full max-w-[1000px] lg:max-w-[1350px] flex items-center justify-center lg:justify-end overflow-visible py-6 sm:py-8">

                {/* Main Hero Transparent Cutout Image from Cloudinary */}
                <div className="w-full relative flex items-center justify-center lg:justify-end overflow-visible z-10">
                  <img
                    src={heroCloudinaryUrl}
                    alt="Dog and Cat"
                    className="w-full max-h-[680px] sm:max-h-[780px] lg:max-h-[880px] scale-110 lg:scale-120 object-contain drop-shadow-2xl origin-right"
                  />
                </div>

                {/* Floating Callout Cards */}
                {/* 1. Speech Bubble (Top Center above Dog's Head) */}
                <div className="absolute -top-6 left-[22%] sm:left-[26%] -translate-x-1/2 bg-[#EE9D1A] border border-[#D98A00] text-[#16241B] px-4 py-2 rounded-2xl rounded-bl-none shadow-xl text-xs sm:text-sm font-bold flex flex-col animate-float-slow z-20">
                  <span className="font-black text-black leading-tight">Your pet called.</span>
                  <span className="font-semibold text-black/90 text-[11px] sm:text-xs">They need a vet.</span>
                </div>

                {/* 2. Professional Treat Tester (Top Right Border next to Cat) */}
                <div className="absolute top-2 right-2 sm:right-6 lg:right-10 bg-white border border-[#EBE5D6] text-[#16241B] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed z-20 whitespace-nowrap">
                  <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-base shrink-0">
                    🍪
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-none mb-0.5">Professional</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#16241B] leading-tight">Treat Tester</span>
                  </div>
                </div>

                {/* 3. Always Ready For Treats (Outer Left Border next to Dog) */}
                <div className="absolute top-[36%] sm:top-[38%] -left-6 sm:-left-12 lg:-left-16 -translate-y-1/2 bg-[#C5EAD4] border border-[#A7DBC0] text-[#16241B] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl flex flex-col gap-0.5 animate-float-slow z-20">
                  <span className="text-[11px] sm:text-xs text-[#285A3F] font-medium leading-tight">Always</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#16241B] leading-tight tracking-tight">Ready For</span>
                  <span className="text-xs sm:text-sm text-[#285A3F] font-bold leading-tight">Treats</span>
                </div>

                {/* 4. Appointment Booked ✓ (Bottom Border in front of Dog) */}
                <div className="absolute -bottom-4 sm:-bottom-5 left-[6%] sm:left-[10%] bg-[#FDF0AA] border border-[#F3E188] text-[#16241B] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed z-20">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] sm:text-[11px] text-[#6B5A10] font-medium leading-none mb-1">Appointment</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#16241B] flex items-center gap-1">
                      Booked <span className="text-[#059669] font-black">✓</span>
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/80 border border-[#E9D575] flex items-center justify-center text-[#16241B] shrink-0 shadow-xs">
                    <Calendar className="w-4 h-4 text-[#854D0E]" />
                  </div>
                </div>

                {/* 5. 10/10 Good Boy (Bottom Right Border) */}
                <div className="absolute -bottom-4 sm:-bottom-5 right-4 sm:right-8 lg:right-12 bg-[#FCE3E4] border border-[#F9C3C6] text-[#16241B] px-4 py-2.5 rounded-2xl shadow-xl flex flex-col animate-float-slow z-20">
                  <span className="text-[10px] sm:text-[11px] text-[#9F1239] font-bold mb-0.5">10/10</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#9F1239] leading-tight">Good Boy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Trust Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4 lg:-mt-6 relative z-20">
          <div className="bg-white/95 backdrop-blur-sm border border-[#E8DFC8] rounded-full shadow-[0_20px_45px_-12px_rgba(22,36,27,0.12),0_4px_16px_rgba(22,36,27,0.04)] px-6 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#EFE8DA] transition-all duration-300 hover:shadow-[0_24px_50px_-10px_rgba(22,36,27,0.16)]">
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span className="text-base"></span> <span>Good dogs welcome</span>
            </div>
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span className="text-base"></span> <span>Cats are in charge</span>
            </div>
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span className="text-base"></span> <span>Tiny paws, big personalities</span>
            </div>
            <div className="w-full md:w-1/4 text-center py-2 md:py-0 px-3 font-bold text-xs sm:text-sm text-[#16241B] flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02]">
              <span className="text-base"></span> <span>No judgment. Only treats.</span>
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
            <Button variant="primary" size="md" className="shrink-0 self-start sm:self-auto">
              Explore All Services 🐾
            </Button>
          </div>

          {/* 5 Equal-Width Cards Grid matching reference design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-5 pt-2">
            {/* Service 01 - Vet Care */}
            <div className="bg-white rounded-[28px] p-3 sm:p-3.5 border border-[#ECE5D8] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] relative flex flex-col group cursor-pointer transition-all duration-300">
              {/* Overlapping Top-Left Badge */}
              <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#D6F842] border-2 border-white flex items-center justify-center text-[#163824] shadow-md z-20">
                <Stethoscope className="w-5 h-5" />
              </div>

              {/* Long & Big Card Image Container */}
              <div className="relative w-full aspect-[3/4.2] rounded-[22px] overflow-hidden bg-[#F4EFE6] mb-2.5">
                <img
                  src={service01Url}
                  alt="Vet Care Service"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Short & Compact Card Content */}
              <div className="px-1 pt-0.5 pb-0.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-[#EF7C3C] tracking-wide block leading-none mb-1">
                    01
                  </span>
                  <h3 className="text-base font-black text-[#14261C] tracking-tight leading-tight group-hover:text-[#EF7C3C] transition-colors">
                    Vet Care
                  </h3>
                  <p className="text-[11px] text-[#5D6F63] font-medium leading-snug line-clamp-2 mt-1">
                    Because Google is not a veterinarian.
                  </p>
                </div>
                <div className="flex justify-end pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] text-[#14261C] group-hover:bg-[#14261C] group-hover:text-white group-hover:border-[#14261C] transition-all duration-300 flex items-center justify-center shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service 02 - Pet Food */}
            <div className="bg-white rounded-[28px] p-3 sm:p-3.5 border border-[#ECE5D8] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] relative flex flex-col group cursor-pointer transition-all duration-300">
              {/* Overlapping Top-Left Badge */}
              <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FEE440] border-2 border-white flex items-center justify-center text-[#634700] shadow-md z-20">
                <Utensils className="w-5 h-5" />
              </div>

              {/* Long & Big Card Image Container */}
              <div className="relative w-full aspect-[3/4.2] rounded-[22px] overflow-hidden bg-[#F4EFE6] mb-2.5">
                <img
                  src={service03Url}
                  alt="Pet Food Service"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Short & Compact Card Content */}
              <div className="px-1 pt-0.5 pb-0.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-[#EF7C3C] tracking-wide block leading-none mb-1">
                    02
                  </span>
                  <h3 className="text-base font-black text-[#14261C] tracking-tight leading-tight group-hover:text-[#EF7C3C] transition-colors">
                    Pet Food
                  </h3>
                  <p className="text-[11px] text-[#5D6F63] font-medium leading-snug line-clamp-2 mt-1">
                    Dinner worthy of their royal highness
                  </p>
                </div>
                <div className="flex justify-end pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] text-[#14261C] group-hover:bg-[#14261C] group-hover:text-white group-hover:border-[#14261C] transition-all duration-300 flex items-center justify-center shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service 03 - Grooming */}
            <div className="bg-white rounded-[28px] p-3 sm:p-3.5 border border-[#ECE5D8] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] relative flex flex-col group cursor-pointer transition-all duration-300">
              {/* Overlapping Top-Left Badge */}
              <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFD6E8] border-2 border-white flex items-center justify-center text-[#9E1B58] shadow-md z-20">
                <Scissors className="w-5 h-5" />
              </div>

              {/* Long & Big Card Image Container */}
              <div className="relative w-full aspect-[3/4.2] rounded-[22px] overflow-hidden bg-[#F4EFE6] mb-2.5">
                <img
                  src={service02Url}
                  alt="Grooming Service"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Short & Compact Card Content */}
              <div className="px-1 pt-0.5 pb-0.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-[#EF7C3C] tracking-wide block leading-none mb-1">
                    03
                  </span>
                  <h3 className="text-base font-black text-[#14261C] tracking-tight leading-tight group-hover:text-[#EF7C3C] transition-colors">
                    Grooming
                  </h3>
                  <p className="text-[11px] text-[#5D6F63] font-medium leading-snug line-clamp-2 mt-1">
                    From fluffy mess to fancy pants
                  </p>
                </div>
                <div className="flex justify-end pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] text-[#14261C] group-hover:bg-[#14261C] group-hover:text-white group-hover:border-[#14261C] transition-all duration-300 flex items-center justify-center shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service 04 - Pharmacy */}
            <div className="bg-white rounded-[28px] p-3 sm:p-3.5 border border-[#ECE5D8] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] relative flex flex-col group cursor-pointer transition-all duration-300">
              {/* Overlapping Top-Left Badge */}
              <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#BAE6FD] border-2 border-white flex items-center justify-center text-[#0369A1] shadow-md z-20">
                <Pill className="w-5 h-5" />
              </div>

              {/* Long & Big Card Image Container */}
              <div className="relative w-full aspect-[3/4.2] rounded-[22px] overflow-hidden bg-[#F4EFE6] mb-2.5">
                <img
                  src={service04Url}
                  alt="Pharmacy Service"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Short & Compact Card Content */}
              <div className="px-1 pt-0.5 pb-0.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-[#EF7C3C] tracking-wide block leading-none mb-1">
                    04
                  </span>
                  <h3 className="text-base font-black text-[#14261C] tracking-tight leading-tight group-hover:text-[#EF7C3C] transition-colors">
                    Pharmacy
                  </h3>
                  <p className="text-[11px] text-[#5D6F63] font-medium leading-snug line-clamp-2 mt-1">
                    Less scratching. More napping.
                  </p>
                </div>
                <div className="flex justify-end pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] text-[#14261C] group-hover:bg-[#14261C] group-hover:text-white group-hover:border-[#14261C] transition-all duration-300 flex items-center justify-center shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service 05 - Toys */}
            <div className="bg-white rounded-[28px] p-3 sm:p-3.5 border border-[#ECE5D8] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] relative flex flex-col group cursor-pointer transition-all duration-300">
              {/* Overlapping Top-Left Badge */}
              <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E9D5FF] border-2 border-white flex items-center justify-center text-[#6B21A8] shadow-md z-20">
                <Gamepad2 className="w-5 h-5" />
              </div>

              {/* Long & Big Card Image Container */}
              <div className="relative w-full aspect-[3/4.2] rounded-[22px] overflow-hidden bg-[#F4EFE6] mb-2.5">
                <img
                  src={service05Url}
                  alt="Toys Service"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Short & Compact Card Content */}
              <div className="px-1 pt-0.5 pb-0.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-[#EF7C3C] tracking-wide block leading-none mb-1">
                    05
                  </span>
                  <h3 className="text-base font-black text-[#14261C] tracking-tight leading-tight group-hover:text-[#EF7C3C] transition-colors">
                    Toys
                  </h3>
                  <p className="text-[11px] text-[#5D6F63] font-medium leading-snug line-clamp-2 mt-1">
                    For pets who have 37 toys and still want yours.
                  </p>
                </div>
                <div className="flex justify-end pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] text-[#14261C] group-hover:bg-[#14261C] group-hover:text-white group-hover:border-[#14261C] transition-all duration-300 flex items-center justify-center shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
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
                BEST CARE, RIGHT NEAR YOU ❤️
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16241B] tracking-tight">
                Meet Their New <span className="text-[#EF7C3C]">Favorite</span>{' '}
                Human.
              </h2>
              <p className="text-base text-[#445548] leading-relaxed">
                Verified vets. Happy pets. Less worry for you.
              </p>

              {/* Find My Vet Button + P.S. Badge */}
              <div className="pt-2 space-y-3.5 relative">
                <div className="flex items-center gap-4">
                  <button className="px-6 py-3.5 bg-[#48BB78] hover:bg-[#38A169] text-white font-extrabold rounded-full shadow-md transition-all flex items-center gap-2 text-base cursor-pointer">
                    Find My Vet 🐾
                  </button>
                </div>

                <div className="relative inline-flex items-center ml-10 sm:ml-20 lg:ml-28">
                  <div className="inline-flex items-center bg-white border border-[#E8E2D4] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-[#16241B] flex items-center gap-1.5">
                      P.S. They'll get extra treats <span className="text-red-500">❤️</span>
                    </span>
                  </div>

                  {/* Slanding Hand-drawn Curved Arrow starting from the middle of the text pill towards the Vet Card */}
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
                      {/* Smooth Arching Curve starting from the middle */}
                      <path d="M 8,92 C 12,28 50,8 115,10 C 160,12 190,24 225,18" />
                      {/* Sleek, Crisp Arrowhead */}
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
                {/* Vet Card 1 - Dr. Sarah Mitchell */}
                <Card className="w-[300px] sm:w-[320px] shrink-0 space-y-4 group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={vetSarahUrl}
                      alt="Dr. Sarah Mitchell"
                      className="w-full h-full object-cover object-[center_20%] rounded-2xl"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-extrabold text-[#16241B] shadow-xs flex items-center gap-1 z-10">
                      <span className="text-yellow-500">★</span> 4.9
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#16241B]">
                      Dr. Sarah Mitchell
                    </h3>
                    <p className="text-xs font-semibold text-[#EF7C3C]">
                      Veterinary Surgeon
                    </p>
                  </div>
                  <div className="space-y-1 text-xs text-[#556658]">
                    <p>12+ years experience</p>
                    <p>Dogs, cats & dramatic patients</p>
                    <p className="font-semibold text-[#16241B] pt-1 flex items-center gap-1">
                      <span className="text-[#EF7C3C]">📍</span> New York, USA
                    </p>
                  </div>
                  <button className="w-full py-3 px-4 bg-[#FBA834] hover:bg-[#e0942b] text-white font-extrabold rounded-full shadow-xs transition-colors cursor-pointer text-sm">
                    View Profile
                  </button>
                </Card>

                {/* Vet Card 2 - Dr. James Carter */}
                <Card className="w-[300px] sm:w-[320px] shrink-0 space-y-4 group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={vetJamesUrl}
                      alt="Dr. James Carter"
                      className="w-full h-full object-cover object-[center_20%] rounded-2xl"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-extrabold text-[#16241B] shadow-xs flex items-center gap-1 z-10">
                      <span className="text-yellow-500">★</span> 4.9
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#16241B]">
                      Dr. James Carter
                    </h3>
                    <p className="text-xs font-semibold text-[#EF7C3C]">
                      Veterinary Surgeon
                    </p>
                  </div>
                  <div className="space-y-1 text-xs text-[#556658]">
                    <p>12+ years experience</p>
                    <p>Dogs, cats & dramatic patients</p>
                    <p className="font-semibold text-[#16241B] pt-1 flex items-center gap-1">
                      <span className="text-[#EF7C3C]">📍</span> Chicago, USA
                    </p>
                  </div>
                  <button className="w-full py-3 px-4 bg-[#FBA834] hover:bg-[#e0942b] text-white font-extrabold rounded-full shadow-xs transition-colors cursor-pointer text-sm">
                    View Profile
                  </button>
                </Card>
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

        {/* 7. CTA Banner with 3D Pop-out Cat */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 overflow-visible">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Left 3D Cat with Sunglasses (Realistic Pop-out with soft contact shadow) */}
              <div className="lg:col-span-5 flex justify-center items-end relative overflow-visible z-20">
                <div className="relative -mt-24 sm:-mt-32 lg:-mt-40 -mb-6 sm:-mb-10 lg:-mb-14 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] flex justify-center items-end pointer-events-none">
                  {/* Ground ambient contact shadow */}
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
                  Happy Pet. Happy Home.<br className="hidden sm:inline" /> It's That Simple.
                </h2>
                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Join thousands of pet parents who trust us for everything their
                  pets deserve.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button className="px-8 py-3.5 bg-[#F9A02B] hover:bg-[#e28e19] text-white font-black rounded-full shadow-[0_8px_20px_rgba(249,160,43,0.35)] transition-all flex items-center gap-2 text-base cursor-pointer">
                    Join the Pack 🐾
                  </button>

                  {/* Avatar stack + badge */}
                  <div className="bg-[#FFE58A]/95 backdrop-blur-xs px-4 py-2.5 rounded-full border border-white/50 shadow-xs flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img
                        className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                        src={avatar1Url}
                        alt="User Reviewer 1"
                      />
                      <img
                        className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                        src={avatar2Url}
                        alt="User Reviewer 2"
                      />
                      <img
                        className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                        src={avatar3Url}
                        alt="User Reviewer 3"
                      />
                      <img
                        className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                        src={avatar4Url}
                        alt="User Reviewer 4"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#16241B]">
                      25,000+ tails wagging! ❤️
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#16241B]">
                  Free Delivery over $49
                </h4>
                <p className="text-xs text-[#556658]">Right to your doorstep</p>
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

