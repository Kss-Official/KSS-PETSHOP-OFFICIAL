import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
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
  ChevronRight,
  Droplets,
  Moon,
  Sparkles,
  Mail,
  CheckCircle2,
} from 'lucide-react';

interface ArticleDto {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  authorName?: string;
  readTimeMinutes: number;
  featured: boolean;
  publishedAt?: string;
  imageUrl?: string;
}

export const HealthTipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Tips');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState<string | null>(null);

  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const categoryColorMap: Record<string, { bg: string; text: string }> = {
    Nutrition: { bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]' },
    Vaccination: { bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]' },
    Grooming: { bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]' },
    'Preventive Care': { bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]' },
    Behaviour: { bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]' },
    'Senior Pet Care': { bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]' },
    'Emergency Care': { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]' },
    'Puppy Care': { bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' },
  };

  const fetchArticles = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/articles')
      .then((res) => {
        setArticles(res.data || []);
      })
      .catch(() => {
        setError('Failed to load health tips. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      activeTab === 'All Tips' ||
      art.category.toLowerCase().includes(activeTab.toLowerCase());

    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredList = filteredArticles.filter((a) => a.featured).slice(0, 3);
  const latestList = filteredArticles.slice(0, 8);

  const petTypes = [
    { name: 'Dogs', bg: 'bg-[#FEF9C3]', border: 'border-[#FDE047]' },
    { name: 'Cats', bg: 'bg-[#E6F9EC]', border: 'border-[#C3ECD0]' },
    { name: 'Rabbits', bg: 'bg-[#FFEDD5]', border: 'border-[#FED7AA]' },
    { name: 'Birds', bg: 'bg-[#E0F2FE]', border: 'border-[#BAE6FD]' },
    { name: 'Small Pets', bg: 'bg-[#FFE4E6]', border: 'border-[#FECDD3]' },
    { name: 'Reptiles', bg: 'bg-[#DCFCE7]', border: 'border-[#BBF7D0]' },
    { name: 'Fish', bg: 'bg-[#CCFBF1]', border: 'border-[#99F6E4]' },
  ];

  const quickDailyTips = [
    {
      icon: Droplets,
      bg: 'bg-[#E0F2FE]',
      color: 'text-[#0284C7]',
      text: 'Keep fresh water always available for all pets.',
    },
    {
      icon: Utensils,
      bg: 'bg-[#FEF9C3]',
      color: 'text-[#B45309]',
      text: 'Feed a balanced diet suitable for their specific age.',
    },
    {
      icon: PawPrint,
      bg: 'bg-[#E6F9EC]',
      color: 'text-[#287A41]',
      text: 'Ensure regular daily exercise and interactive playtime.',
    },
    {
      icon: Heart,
      bg: 'bg-[#FFE4E6]',
      color: 'text-[#E11D48]',
      text: 'Schedule routine annual veterinary wellness check-ups.',
    },
    {
      icon: Moon,
      bg: 'bg-[#F3E8FF]',
      color: 'text-[#7E22CE]',
      text: 'Give them a clean, dry, and comfortable sleep space.',
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSubscribing(true);
    setSubscribeMsg(null);

    try {
      await apiClient.post('/newsletter/subscribe', {
        email: emailInput.trim(),
      });
      setSubscribed(true);
      setSubscribeMsg('Thank you for subscribing! Expert tips are on their way.');
      setEmailInput('');
    } catch {
      setSubscribeMsg('Could not subscribe. Please check your email and try again.');
    } finally {
      setSubscribing(false);
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
              {/* Left Column */}
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
                  everyday care, and everything your pet needs to stay healthy and vibrant.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl pt-2">
                  <form
                    onSubmit={(e) => e.preventDefault()}
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
                      className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#009E66] hover:bg-[#008757] text-white font-bold rounded-full text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer"
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

              {/* Right Column */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                <div className="absolute inset-0 bg-[#D8F3DC]/70 rounded-[48%_52%_68%_32%/42%_58%_42%_58%] -rotate-3 scale-105 pointer-events-none blur-xs" />
                <div className="absolute -top-4 left-4 z-20 bg-white border border-[#E2EEDB] px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5A623] shrink-0" />
                  <span className="text-xs font-black text-[#16241B]">
                    Healthy Pets, Happier Tomorrows!
                  </span>
                </div>

                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#D0EBD5] shadow-lg bg-white z-10">
                  <img
                    src={getCloudinaryImageUrl('hero_dog_cat_green_bg')}
                    alt="Health & Wellness"
                    className="w-full h-full object-cover rounded-3xl"
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

        {/* 4. Featured Health Tips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                  Featured <span className="text-[#EF7C3C]">Health Tips</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#556658] font-medium">
                  Expert-backed advice to keep your furry friends healthy, happy, and active.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[24px] p-4 border border-[#EDE7D9] space-y-3">
                    <Skeleton className="w-full aspect-[16/10] rounded-[18px]" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={fetchArticles} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(featuredList.length > 0 ? featuredList : filteredArticles.slice(0, 3)).map((tip) => {
                  const colors = categoryColorMap[tip.category] || {
                    bg: 'bg-[#E6F9EC]',
                    text: 'text-[#287A41]',
                  };

                  return (
                    <div
                      key={tip.id}
                      className="bg-white rounded-[24px] p-4 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden bg-[#FAF6EE] border border-[#EAE3D2]">
                        <img
                          src={
                            tip.imageUrl ||
                            getCloudinaryImageUrl('hero_dog_cat_green_bg')
                          }
                          alt={tip.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${colors.bg} ${colors.text} shadow-xs border border-white/60`}
                        >
                          {tip.category}
                        </span>
                      </div>

                      <div className="pt-4 flex flex-col flex-grow">
                        <h3 className="text-base sm:text-lg font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2">
                          {tip.title}
                        </h3>
                        <p className="text-xs text-[#556658] font-medium leading-relaxed mt-2 mb-4 flex-grow line-clamp-2">
                          {tip.excerpt}
                        </p>

                        <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#88998C] font-semibold mt-auto">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#3FA65C]" />
                              {tip.publishedAt ? new Date(tip.publishedAt).toLocaleDateString() : 'Recent'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#EF7C3C]" />
                              {tip.readTimeMinutes || 5} min read
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#FAF6EE] group-hover:bg-[#3FA65C] group-hover:text-white text-[#16241B] flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 5. Browse Health Tips by Pet Type */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16241B] tracking-tight">
                Browse <span className="text-[#EF7C3C]">Health Tips</span> by Pet Type
              </h2>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
              {petTypes.map((pet) => (
                <div
                  key={pet.name}
                  onClick={() => setSearchQuery(pet.name)}
                  className={`min-w-[140px] sm:min-w-[160px] flex-1 bg-white rounded-[22px] p-3 border ${pet.border} shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer`}
                >
                  <div className={`w-14 h-14 rounded-full ${pet.bg} flex items-center justify-center text-2xl mb-2.5 shadow-2xs`}>
                    🐾
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors">
                    {pet.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Quick Daily Tips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8F0] rounded-[32px] p-6 sm:p-10 border border-[#E2EEDB] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
                  Simple habits you can follow every day to keep your pet happy and thriving.
                </p>
              </div>

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

        {/* 7. Latest Health Tips Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16241B] tracking-tight">
                All <span className="text-[#EF7C3C]">Health Articles</span> ({filteredArticles.length})
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] space-y-2">
                    <Skeleton className="w-full aspect-[16/10] rounded-[16px]" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <EmptyState
                title="No articles found"
                description="Try clearing your search query or selecting a different category."
                actionLabel="Reset Search"
                onAction={() => {
                  setSearchQuery('');
                  setActiveTab('All Tips');
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestList.map((tip) => {
                  const colors = categoryColorMap[tip.category] || {
                    bg: 'bg-[#E6F9EC]',
                    text: 'text-[#287A41]',
                  };

                  return (
                    <div
                      key={tip.id}
                      className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden bg-[#FAF6EE] mb-3">
                        <img
                          src={
                            tip.imageUrl ||
                            getCloudinaryImageUrl('hero_dog_cat_green_bg')
                          }
                          alt={tip.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.bg} ${colors.text} shadow-xs border border-white/60`}
                        >
                          {tip.category}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2 flex-grow">
                        {tip.title}
                      </h3>

                      <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#88998C] font-semibold mt-3">
                        <div className="flex items-center gap-3">
                          <span>{tip.readTimeMinutes || 5} min read</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#FAF6EE] group-hover:bg-[#3FA65C] group-hover:text-white text-[#16241B] flex items-center justify-center transition-colors">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 8. Newsletter CTA Banner */}
        <section id="newsletter-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  A Healthier Tomorrow Starts with What{' '}
                  <span className="text-[#EF7C3C]">You Know Today.</span>
                </h2>
                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Get the latest pet health tips, expert advice, and care reminders straight to your inbox.
                </p>

                {subscribed ? (
                  <div className="bg-white/95 border border-white p-4 rounded-2xl text-center lg:text-left text-sm font-bold text-[#287A41] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{subscribeMsg || 'Thank you for subscribing! Health tips are on their way.'}</span>
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
                        className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-[#16241B] placeholder-[#88998C] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16241B] shadow-xs font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={subscribing}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-md transition-all text-sm shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {subscribing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                )}
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
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};
