import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import {
  Search,
  Heart,
  LayoutGrid,
  Utensils,
  Syringe,
  Scissors,
  ShieldCheck,
  PawPrint,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Droplets,
  Moon,
  Sparkles,
  Mail,
} from 'lucide-react';

export const HealthTipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Tips');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filterTabs = [
    { name: 'All Tips', icon: LayoutGrid, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]', border: 'border-[#C3ECD0]' },
    { name: 'Nutrition', icon: Utensils, bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]', border: 'border-[#FDE047]' },
    { name: 'Vaccination', icon: Syringe, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', border: 'border-[#BAE6FD]' },
    { name: 'Grooming', icon: Scissors, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]', border: 'border-[#FECDD3]' },
    { name: 'Preventive Care', icon: ShieldCheck, bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]', border: 'border-[#E9D5FF]' },
    { name: 'Behaviour', icon: PawPrint, bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
    { name: 'Senior Pet Care', icon: Heart, bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]' },
    { name: 'Emergency Care', icon: AlertTriangle, bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]' },
  ];

  const popularTags = ['Vaccination', 'Nutrition', 'Puppy Care', 'Cat Care', 'Grooming'];

  const featuredTips = [
    {
      id: 'featured-1',
      category: 'Nutrition',
      categoryBg: 'bg-[#FEF9C3]',
      categoryText: 'text-[#B45309]',
      title: 'The Right Nutrition for a Healthier, Happier Pet',
      description:
        'Learn what to feed, what to avoid, and how nutrition impacts your pet’s overall well-being.',
      date: 'Aug 12, 2024',
      readTime: '5 min read',
      placeholderLabel: 'Golden Retriever eating healthy meal',
    },
    {
      id: 'featured-2',
      category: 'Vaccination',
      categoryBg: 'bg-[#E0F2FE]',
      categoryText: 'text-[#0284C7]',
      title: 'Essential Vaccinations for Dogs and Cats',
      description:
        'Keep your pet protected. Know the must-have vaccines and the right schedule.',
      date: 'Aug 10, 2024',
      readTime: '6 min read',
      placeholderLabel: 'Vet examining cat vaccination',
    },
    {
      id: 'featured-3',
      category: 'Grooming',
      categoryBg: 'bg-[#FFE4E6]',
      categoryText: 'text-[#E11D48]',
      title: 'Grooming Tips for a Cleaner and Healthier Pet',
      description:
        'From brushing to bathing, simple grooming habits can prevent many health issues.',
      date: 'Aug 07, 2024',
      readTime: '4 min read',
      placeholderLabel: 'Golden Retriever in bubble bath',
    },
  ];

  const petTypes = [
    { name: 'Dogs', bg: 'bg-[#FEF9C3]', border: 'border-[#FDE047]', placeholderLabel: 'Dog Portrait' },
    { name: 'Cats', bg: 'bg-[#E6F9EC]', border: 'border-[#C3ECD0]', placeholderLabel: 'Cat Portrait' },
    { name: 'Rabbits', bg: 'bg-[#FFEDD5]', border: 'border-[#FED7AA]', placeholderLabel: 'Rabbit Portrait' },
    { name: 'Birds', bg: 'bg-[#E0F2FE]', border: 'border-[#BAE6FD]', placeholderLabel: 'Parrot Bird' },
    { name: 'Small Pets', bg: 'bg-[#FFE4E6]', border: 'border-[#FECDD3]', placeholderLabel: 'Hamster' },
    { name: 'Reptiles', bg: 'bg-[#DCFCE7]', border: 'border-[#BBF7D0]', placeholderLabel: 'Reptile' },
    { name: 'Fish', bg: 'bg-[#CCFBF1]', border: 'border-[#99F6E4]', placeholderLabel: 'Betta Fish' },
  ];

  const quickDailyTips = [
    {
      icon: Droplets,
      bg: 'bg-[#E0F2FE]',
      color: 'text-[#0284C7]',
      text: 'Keep fresh water always available.',
    },
    {
      icon: Utensils,
      bg: 'bg-[#FEF9C3]',
      color: 'text-[#B45309]',
      text: 'Feed a balanced diet suitable for their age.',
    },
    {
      icon: PawPrint,
      bg: 'bg-[#E6F9EC]',
      color: 'text-[#287A41]',
      text: 'Ensure regular exercise and playtime.',
    },
    {
      icon: Heart,
      bg: 'bg-[#FFE4E6]',
      color: 'text-[#E11D48]',
      text: 'Schedule routine vet check-ups.',
    },
    {
      icon: Moon,
      bg: 'bg-[#F3E8FF]',
      color: 'text-[#7E22CE]',
      text: 'Give them a clean and comfortable sleep space.',
    },
  ];

  const latestTips = [
    {
      id: 'latest-1',
      category: 'Preventive Care',
      categoryBg: 'bg-[#F3E8FF]',
      categoryText: 'text-[#7E22CE]',
      title: 'Common Signs Your Pet Might Be Sick',
      date: 'Aug 05, 2024',
      readTime: '5 min read',
      placeholderLabel: 'Dog resting with thermometer',
    },
    {
      id: 'latest-2',
      category: 'Behaviour',
      categoryBg: 'bg-[#FFEDD5]',
      categoryText: 'text-[#C2410C]',
      title: 'How to Keep Your Indoor Cat Active',
      date: 'Aug 02, 2024',
      readTime: '4 min read',
      placeholderLabel: 'Playful cat with ball toy',
    },
    {
      id: 'latest-3',
      category: 'Puppy Care',
      categoryBg: 'bg-[#DCFCE7]',
      categoryText: 'text-[#15803D]',
      title: 'Essential Care Tips for New Pet Parents',
      date: 'Jul 28, 2024',
      readTime: '6 min read',
      placeholderLabel: 'Puppy sitting on green lawn',
    },
    {
      id: 'latest-4',
      category: 'Senior Pet Care',
      categoryBg: 'bg-[#CCFBF1]',
      categoryText: 'text-[#0F766E]',
      title: 'Caring for Senior Pets with Extra Love',
      date: 'Jul 25, 2024',
      readTime: '5 min read',
      placeholderLabel: 'Senior dog sleeping peacefully',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col">
      {/* 1. Navbar */}
      <Navbar activePage="health-tips" />

      <main className="flex-grow space-y-16 lg:space-y-24 pb-20">
        {/* 2. Hero Section */}
        <section className="bg-[#EFF8F0] border-b border-[#E2EEDB] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Heading, Search & Popular Tags */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#EF7C3C] text-xs font-black uppercase tracking-wider shadow-2xs">
                  <Heart className="w-3.5 h-3.5 fill-[#EF7C3C]" />
                  <span>PET HEALTH TIPS</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Small Care Makes A{' '}
                  <span className="text-[#EF7C3C]">Big Difference.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#556658] max-w-xl font-medium leading-relaxed">
                  Simple tips. Healthier pets. Happier lives. Expert advice,
                  everyday care, and everything your pet needs to stay healthy
                  and happy.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl pt-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                    className="flex items-center bg-white rounded-full p-1.5 sm:p-2 border border-[#EDE7D9] shadow-md focus-within:ring-2 focus-within:ring-[#3FA65C] transition-all"
                  >
                    <div className="pl-3 sm:pl-4 text-[#556658]">
                      <Search className="w-5 h-5 text-[#556658]" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search health tips (e.g. diet, vaccination, grooming...)"
                      className="w-full px-3 text-xs sm:text-sm text-[#16241B] placeholder-[#88998C] bg-transparent focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#3FA65C] hover:bg-[#348e4e] text-white font-bold rounded-full text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer"
                    >
                      Search
                    </button>
                  </form>

                  {/* Popular Searches */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-3.5 text-xs text-[#556658]">
                    <span className="font-bold text-[#16241B]">Popular Searches:</span>
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1 rounded-full bg-white border border-[#E5DFCE] hover:border-[#3FA65C] hover:text-[#3FA65C] font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Image with Floating Speech Bubble & Badge */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                {/* Organic Green Blob Shape */}
                <div className="absolute inset-0 bg-[#D8F3DC]/70 rounded-[48%_52%_68%_32%/42%_58%_42%_58%] -rotate-3 scale-105 pointer-events-none blur-xs" />

                {/* Vertical Decorative Badge on the Right */}
                <div className="absolute -right-2 top-8 z-20 hidden sm:flex flex-col items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-[#EDE7D9] py-3 px-2 rounded-full shadow-md">
                  <PawPrint className="w-4 h-4 text-[#3FA65C]" />
                  <span className="text-[10px] font-black uppercase text-[#16241B] [writing-mode:vertical-rl] rotate-180 tracking-widest">
                    Care / Learn / Love / Repeat
                  </span>
                  <Heart className="w-3.5 h-3.5 text-[#EF7C3C] fill-[#EF7C3C]" />
                </div>

                {/* Floating Speech Bubble Callout */}
                <div className="absolute -top-4 left-4 z-20 bg-white border border-[#E2EEDB] px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5A623] shrink-0" />
                  <span className="text-xs font-black text-[#16241B]">
                    Healthy Pets Happier Tomorrows!
                  </span>
                </div>

                {/* Hero Photo Placeholder */}
                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#D0EBD5] shadow-lg bg-white z-10">
                  <ImagePlaceholder
                    label="Dog and Cat Health & Wellness"
                    className="rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Filter Tabs (8 Pills) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth">
            {filterTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold shrink-0 transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#E6F9EC] border-[#3FA65C] text-[#287A41] shadow-xs ring-2 ring-[#3FA65C]/20'
                      : 'bg-white border-[#EDE7D9] text-[#556658] hover:border-[#3FA65C] hover:text-[#16241B]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-[#3FA65C] text-white' : `${tab.bg} ${tab.text}`
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Featured Health Tips (3-Card Row) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                  Featured <span className="text-[#EF7C3C]">Health Tips</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#556658] font-medium">
                  Expert-backed advice to keep your furry friends healthy, happy and active.
                </p>
              </div>

              <a
                href="#all-articles"
                className="text-xs sm:text-sm font-bold text-[#3FA65C] hover:text-[#2e7d44] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                View All Articles <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* 3 Featured Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white rounded-[24px] p-4 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                >
                  {/* Image Container with Floating Category Badge */}
                  <div className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden bg-[#FAF6EE] border border-[#EAE3D2]">
                    <ImagePlaceholder
                      label={tip.placeholderLabel}
                      className="rounded-[18px]"
                    />
                    <span
                      className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${tip.categoryBg} ${tip.categoryText} shadow-xs border border-white/60`}
                    >
                      {tip.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="pt-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-[#556658] font-medium leading-relaxed mt-2 mb-4 flex-grow line-clamp-2">
                      {tip.description}
                    </p>

                    {/* Footer Row with Meta and Arrow */}
                    <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#88998C] font-semibold mt-auto">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#3FA65C]" />
                          {tip.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#EF7C3C]" />
                          {tip.readTime}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#FAF6EE] group-hover:bg-[#3FA65C] group-hover:text-white text-[#16241B] flex items-center justify-center transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Browse Health Tips by Pet Type (7-Card Row) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16241B] tracking-tight">
                Browse <span className="text-[#EF7C3C]">Health Tips</span> by Pet Type
              </h2>
              <a
                href="#pet-types"
                className="text-xs sm:text-sm font-bold text-[#3FA65C] hover:text-[#2e7d44] transition-colors flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
              {petTypes.map((pet) => (
                <div
                  key={pet.name}
                  className={`min-w-[140px] sm:min-w-[160px] flex-1 bg-white rounded-[22px] p-3 border ${pet.border} shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer`}
                >
                  <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-[#FAF6EE] mb-2.5">
                    <ImagePlaceholder label={pet.placeholderLabel} className="rounded-[16px]" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors">
                    {pet.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Quick Daily Tips (Mint Green Panel) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8F0] rounded-[32px] p-6 sm:p-10 border border-[#E2EEDB] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Title & Subtitle */}
              <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#EF7C3C] text-[11px] font-black uppercase tracking-wider shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#EF7C3C]" />
                  <span>QUICK DAILY TIPS</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight leading-tight">
                  Little Habits.<br />
                  <span className="text-[#EF7C3C]">Healthier Tomorrows.</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#556658] font-medium leading-relaxed">
                  Simple tips you can follow every day to keep your pet happy and healthy.
                </p>
              </div>

              {/* Right Column: 5 Daily Habit Cards */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {quickDailyTips.map((habit, idx) => {
                  const HabitIcon = habit.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-3"
                    >
                      <div
                        className={`w-11 h-11 rounded-full ${habit.bg} ${habit.color} flex items-center justify-center shadow-xs shrink-0`}
                      >
                        <HabitIcon className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-[#16241B] font-bold leading-snug">
                        {habit.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Latest Health Tips (4-Card Row) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16241B] tracking-tight">
                Latest <span className="text-[#EF7C3C]">Health Tips</span>
              </h2>
              <a
                href="#see-more"
                className="text-xs sm:text-sm font-bold text-[#3FA65C] hover:text-[#2e7d44] transition-colors flex items-center gap-1 cursor-pointer"
              >
                See More <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                >
                  <div className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden bg-[#FAF6EE] mb-3">
                    <ImagePlaceholder label={tip.placeholderLabel} className="rounded-[16px]" />
                    <span
                      className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tip.categoryBg} ${tip.categoryText} shadow-xs border border-white/60`}
                    >
                      {tip.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2">
                    {tip.title}
                  </h3>

                  <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#88998C] font-semibold mt-3">
                    <div className="flex items-center gap-3">
                      <span>{tip.date}</span>
                      <span>•</span>
                      <span>{tip.readTime}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#FAF6EE] group-hover:bg-[#3FA65C] group-hover:text-white text-[#16241B] flex items-center justify-center transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Newsletter CTA Banner */}
        <section id="newsletter-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Left Column: Heading, Paragraph & Subscribe Form */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  A Healthier Tomorrow Starts with What{' '}
                  <span className="text-[#EF7C3C]">You Know Today.</span>
                </h2>
                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Get the latest pet health tips, expert advice, and care reminders
                  straight to your inbox.
                </p>

                {subscribed ? (
                  <div className="bg-white/90 border border-white p-4 rounded-2xl text-center lg:text-left text-sm font-bold text-[#287A41]">
                    Thank you for subscribing! Health tips are on their way.
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row items-center gap-3 max-w-lg"
                  >
                    <div className="relative w-full">
                      <Mail className="w-5 h-5 text-[#88998C] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-[#16241B] placeholder-[#88998C] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16241B] shadow-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#16241B] hover:bg-[#23382A] text-white font-black rounded-full shadow-md transition-all text-sm shrink-0 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Corgi with Sunglasses & Speech Bubble */}
              <div className="lg:col-span-5 flex justify-center items-center relative z-20">
                {/* Speech Bubble */}
                <div className="absolute -top-6 right-4 z-30 bg-white border border-[#E5DFCE] px-4 py-2 rounded-2xl shadow-md">
                  <span className="text-xs font-black text-[#16241B]">
                    Happy Pets — Learn, Live, Thrive!
                  </span>
                </div>

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
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};
