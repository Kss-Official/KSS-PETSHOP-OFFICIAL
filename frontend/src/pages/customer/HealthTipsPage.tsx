import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl, getArticleImageUrl } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
import {
  Search,
  Heart,
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
  excerpt?: string;
  content?: string;
  category: string;
  petType?: string;
  imageUrl?: string;
  publishedAt?: string;
  readTimeMinutes?: number;
  isFeatured?: boolean;
}

const resolveArticleImageUrl = (photoUrl?: string, title?: string): string => {
  return getArticleImageUrl(title, photoUrl);
};

const computeReadTime = (content?: string, excerpt?: string): number => {
  const text = (content || excerpt || '').trim();
  if (!text) return 3;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const resolveCategory = (title?: string, cat?: string): string => {
  const t = (title || '').toLowerCase();
  const c = (cat || '').trim();
  if (t.includes('nutrition') || t.includes('food') || t.includes('diet')) return 'Nutrition';
  if (t.includes('vaccin') || t.includes('shot')) return 'Vaccination';
  if (t.includes('groom') || t.includes('bath') || t.includes('wash')) return 'Grooming';
  if (t.includes('sign') || t.includes('sick') || t.includes('emergenc')) return 'Emergency Care';
  if (t.includes('cat') || t.includes('indoor') || t.includes('play') || t.includes('behaviour') || t.includes('behavior')) return 'Behaviour';
  if (t.includes('senior') || t.includes('aging') || t.includes('old dog') || t.includes('old cat')) return 'Senior Pet Care';
  if (c && c !== 'Preventive Care' && c !== 'General') return c;
  return c || 'Preventive Care';
};

export const HealthTipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Tips');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState<string | null>(null);

  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [selectedPetType, setSelectedPetType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterTabs = [
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
    Promise.allSettled([
      apiClient.get<ArticleDto[]>('/articles'),
      apiClient.get<ArticleDto[]>('/health-tips'),
    ])
      .then(([artRes, tipRes]) => {
        const artList =
          artRes.status === 'fulfilled' && Array.isArray(artRes.value.data)
            ? artRes.value.data
            : [];
        const tipList =
          tipRes.status === 'fulfilled' && Array.isArray(tipRes.value.data)
            ? tipRes.value.data
            : [];

        const combined = [...artList];
        const existingTitles = new Set(
          artList.map((a) => a.title.toLowerCase().trim())
        );
        for (const tip of tipList) {
          if (!existingTitles.has(tip.title.toLowerCase().trim())) {
            combined.push(tip);
            existingTitles.add(tip.title.toLowerCase().trim());
          }
        }
        setArticles(combined);
      })
      .catch(() => {
        setError('Failed to load articles and health tips. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((art) => {
    const resolvedCat = resolveCategory(art.title, art.category);
    const title = (art.title || '').toLowerCase();
    const content = (art.content || '').toLowerCase();
    const excerpt = (art.excerpt || '').toLowerCase();
    const targetTab = activeTab.toLowerCase();
    const query = (searchQuery || '').toLowerCase();

    const matchesCategory =
      activeTab === 'All Tips' ||
      resolvedCat.toLowerCase() === targetTab;

    const matchesSearch =
      searchQuery === '' ||
      title.includes(query) ||
      content.includes(query) ||
      excerpt.includes(query) ||
      resolvedCat.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });


  const petTypeFilteredArticles = articles.filter((art) => {
    if (!selectedPetType) return true;

    const petType = (art.petType || '').toLowerCase();
    const title = (art.title || '').toLowerCase();
    const excerpt = (art.excerpt || '').toLowerCase();
    const content = (art.content || '').toLowerCase();
    const resolvedCat = resolveCategory(art.title, art.category).toLowerCase();
    const target = selectedPetType.toLowerCase();
    const targetSingular = target.endsWith('s') ? target.slice(0, -1) : target;

    return (
      petType.includes(target) ||
      petType.includes(targetSingular) ||
      petType === 'all' ||
      title.includes(target) ||
      title.includes(targetSingular) ||
      excerpt.includes(target) ||
      excerpt.includes(targetSingular) ||
      content.includes(target) ||
      content.includes(targetSingular) ||
      resolvedCat.includes(target) ||
      resolvedCat.includes(targetSingular)
    );
  });

  const petTypes = [
    {
      name: 'Dogs',
      bg: 'bg-[#FEF9C3]',
      border: 'border-[#FDE047]',
      hoverBorder: 'hover:border-[#EAB308]',
      activeBorder: 'border-[#CA8A04]',
      text: 'text-[#B45309]',
      hoverText: 'group-hover:text-[#B45309]',
      hoverBg: 'hover:bg-[#FEF9C3]/50',
      imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788895238/be7aa286-04e9-4307-b2f4-6dc218dfb17f_1.png',
    },
    {
      name: 'Cats',
      bg: 'bg-[#E6F9EC]',
      border: 'border-[#C3ECD0]',
      hoverBorder: 'hover:border-[#3FA65C]',
      activeBorder: 'border-[#287A41]',
      text: 'text-[#287A41]',
      hoverText: 'group-hover:text-[#287A41]',
      hoverBg: 'hover:bg-[#E6F9EC]/50',
      imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788895237/17d0f799-c458-4c6c-a0a6-80d8cf71e496_1.png',
    },
    {
      name: 'Rabbits',
      bg: 'bg-[#FFEDD5]',
      border: 'border-[#FED7AA]',
      hoverBorder: 'hover:border-[#FB923C]',
      activeBorder: 'border-[#C2410C]',
      text: 'text-[#C2410C]',
      hoverText: 'group-hover:text-[#C2410C]',
      hoverBg: 'hover:bg-[#FFEDD5]/50',
      imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/886e967f-9a24-48c5-aeff-ff8e6f6a00e6_1.png',
    },
    {
      name: 'Birds',
      bg: 'bg-[#E0F2FE]',
      border: 'border-[#BAE6FD]',
      hoverBorder: 'hover:border-[#38BDF8]',
      activeBorder: 'border-[#0284C7]',
      text: 'text-[#0284C7]',
      hoverText: 'group-hover:text-[#0284C7]',
      hoverBg: 'hover:bg-[#E0F2FE]/50',
      imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/ce452fe3-fdc7-4140-8b94-6c0f373622db_1.png',
    },
    {
      name: 'Small Pets',
      bg: 'bg-[#FFE4E6]',
      border: 'border-[#FECDD3]',
      hoverBorder: 'hover:border-[#FB7185]',
      activeBorder: 'border-[#E11D48]',
      text: 'text-[#E11D48]',
      hoverText: 'group-hover:text-[#E11D48]',
      hoverBg: 'hover:bg-[#FFE4E6]/50',
      imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/c0d11401-6185-488d-9267-a5235e16375a_1.png',
    },
    {
      name: 'Reptiles',
      bg: 'bg-[#DCFCE7]',
      border: 'border-[#BBF7D0]',
      hoverBorder: 'hover:border-[#4ADE80]',
      activeBorder: 'border-[#15803D]',
      text: 'text-[#15803D]',
      hoverText: 'group-hover:text-[#15803D]',
      hoverBg: 'hover:bg-[#DCFCE7]/50',
      imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/3553855e-62e9-4565-9f5a-a5d484ecd080_1.png',
    },
    {
      name: 'Fish',
      bg: 'bg-[#CCFBF1]',
      border: 'border-[#99F6E4]',
      hoverBorder: 'hover:border-[#2DD4BF]',
      activeBorder: 'border-[#0D9488]',
      text: 'text-[#0D9488]',
      hoverText: 'group-hover:text-[#0D9488]',
      hoverBg: 'hover:bg-[#CCFBF1]/50',
      imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/119ae58d-9928-4822-afb6-97826bd4341c_1.png',
    },
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
      window.dispatchEvent(new Event('admin-notifications-updated'));
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
        <section id="health-tips-hero" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[460px] sm:min-h-[540px]">
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9EC] text-[#287A41] border border-[#C3ECD0] text-xs font-black uppercase tracking-wider shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#287A41]" />
                <span>PET HEALTH TIPS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#16241B] tracking-tight leading-[1.12]">
                Small Care Makes A{' '}
                <span className="text-[#009E66]">Big Difference</span>
                <span className="text-[#16241B]">.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#556658] max-w-xl font-medium leading-relaxed">
                Simple tips. Healthier pets. Happier lives. Expert advice,
                everyday care, and everything your pet needs to stay healthy and vibrant.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl pt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('featured-health-tips');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
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
                      onClick={() => {
                        setSearchQuery(tag);
                        const el = document.getElementById('featured-health-tips');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-3 py-1 rounded-full bg-white border border-[#E5DFCE] hover:border-[#3FA65C]/40 text-[#16241B] hover:text-[#009E66] shadow-2xs hover:shadow-md hover:bg-[#E6F4E8] font-bold text-xs transition-all cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Transparent Hero Graphic - Bigger & Static */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
              <img
                src={getCloudinaryImageUrl('health_tips_hero')}
                alt="Health Tips - Small Pets Big Love"
                className="w-full max-w-[980px] lg:max-w-[1080px] h-auto object-contain pointer-events-none select-none"
              />
            </div>
          </div>
        </section>

        {/* 3. Featured Health Tips Header & Filter Tabs */}
        <section id="featured-health-tips" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                Featured <span className="text-[#EF7C3C]">Health Tips</span>.
              </h2>
              <p className="text-xs sm:text-sm text-[#556658] font-medium">
                Expert-backed advice to keep your furry friends healthy, happy, and active.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('All Tips');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#009E66] bg-white border border-[#009E66]/20 rounded-full shadow-2xs hover:shadow-md hover:text-[#008757] hover:border-[#009E66]/40 flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <span>View all</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 w-full py-1 overflow-x-auto no-scrollbar scroll-smooth">
            {filterTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#E6F9EC] border-[#3FA65C] text-[#287A41] shadow-xs ring-2 ring-[#3FA65C]/20'
                      : 'bg-white border-[#EDE7D9] text-[#556658] hover:border-[#3FA65C] hover:text-[#16241B] shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-[#3FA65C] text-white' : `${tab.bg} ${tab.text}`
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Featured Health Tips Articles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
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
            ) : error ? (
              <ErrorState message={error} onRetry={fetchArticles} />
            ) : filteredArticles.length === 0 ? (
              <EmptyState
                title="No health tips found"
                description="We couldn't find any health tips matching your selected category or search filter."
                actionLabel="View All Health Tips"
                onAction={() => {
                  setActiveTab('All Tips');
                  setSearchQuery('');
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArticles.map((tip) => {
                  const category = resolveCategory(tip.title, tip.category);
                  const colors = categoryColorMap[category] || {
                    bg: 'bg-[#E6F9EC]',
                    text: 'text-[#287A41]',
                  };
                  const readTime = computeReadTime(tip.content, tip.excerpt);

                  return (
                    <div
                      key={tip.id}
                      onClick={() => navigate(`/health-tips/${tip.id}`)}
                      className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                    >
                      <div className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden bg-[#FAF6EE] mb-3">
                        <img
                          src={resolveArticleImageUrl(tip.imageUrl, tip.title)}
                          alt={tip.title}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.bg} ${colors.text} shadow-xs border border-white/60`}
                        >
                          {category}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2 flex-grow">
                        {tip.title}
                      </h3>

                      <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#88998C] font-semibold mt-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#3FA65C]" />
                            {tip.publishedAt ? new Date(tip.publishedAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#287A41]" />
                            {readTime} min read
                          </span>
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

        {/* 5. Quick Daily Tips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8F0] rounded-[32px] p-6 sm:p-10 border border-[#E2EEDB] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#287A41] text-[11px] font-black uppercase tracking-wider shadow-2xs border border-[#C3ECD0]">
                  <Sparkles className="w-3.5 h-3.5 text-[#287A41]" />
                  <span>QUICK DAILY TIPS</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight leading-tight">
                  Little Habits.<br />
                  <span className="text-[#287A41]">Healthier Tomorrows.</span>
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

        {/* 6. Browse Health Tips by Pet Type */}
        <section id="browse-articles-pet-type" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16241B] tracking-tight">
                Browse <span className="text-[#EF7C3C]">Health Tips</span> by Pet Type<span className="text-[#EF7C3C]">.</span>
              </h2>

              <button
                onClick={() => {
                  setSelectedPetType(null);
                }}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#009E66] bg-white border border-[#009E66]/20 rounded-full shadow-2xs hover:shadow-md hover:text-[#008757] hover:border-[#009E66]/40 flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <span>View all tips</span>
              </button>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
              {petTypes.map((pet) => {
                const isSelected = selectedPetType?.toLowerCase() === pet.name.toLowerCase();
                return (
                  <div
                    key={pet.name}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPetType(null);
                      } else {
                        setSelectedPetType(pet.name);
                      }
                    }}
                    className={`min-w-[130px] sm:min-w-[150px] flex-1 rounded-[20px] p-2.5 sm:p-3 border transition-all flex flex-col items-center text-center group cursor-pointer ${
                      isSelected
                        ? `${pet.bg} ${pet.activeBorder} shadow-md ring-2 ring-current/20`
                        : `bg-white ${pet.border} ${pet.hoverBorder} ${pet.hoverBg} shadow-2xs hover:shadow-md`
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-[#FAF6EE] mb-2 border border-black/5">
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`text-xs sm:text-sm font-bold transition-colors ${
                      isSelected ? pet.text : `text-[#16241B] ${pet.hoverText}`
                    }`}>
                      {pet.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Health Tips Grid or Empty State under Pet Types */}
            <div className="pt-2">
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
              ) : petTypeFilteredArticles.length === 0 ? (
                <EmptyState
                  title="No health tips found"
                  description={
                    selectedPetType
                      ? `We couldn't find any health tips for ${selectedPetType} right now. Check back soon for expert advice!`
                      : 'We couldn\'t find any health tips matching your search filter.'
                  }
                  actionLabel="View All Health Tips"
                  onAction={() => {
                    setSelectedPetType(null);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {petTypeFilteredArticles.map((tip) => {
                    const category = resolveCategory(tip.title, tip.category);
                    const colors = categoryColorMap[category] || {
                      bg: 'bg-[#E6F9EC]',
                      text: 'text-[#287A41]',
                    };
                    const readTime = computeReadTime(tip.content, tip.excerpt);

                    return (
                      <div
                        key={tip.id}
                        onClick={() => navigate(`/health-tips/${tip.id}`)}
                        className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                      >
                        <div className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden bg-[#FAF6EE] mb-3 border border-[#F0EAE1]">
                          <img
                            src={resolveArticleImageUrl(tip.imageUrl, tip.title)}
                            alt={tip.title}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.bg} ${colors.text} shadow-xs border border-white/60`}
                          >
                            {category}
                          </span>
                        </div>

                        <h3 className="text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2 flex-grow">
                          {tip.title}
                        </h3>

                        <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#88998C] font-semibold mt-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#3FA65C]" />
                              {tip.publishedAt ? new Date(tip.publishedAt).toLocaleDateString() : 'Recent'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#287A41]" />
                              {readTime} min read
                            </span>
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
          </div>
        </section>

        {/* 8. Newsletter CTA Banner */}
        <section id="newsletter-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  A Healthier Tomorrow Starts with What{' '}
                  <span
                    className="text-[#EF7C3C]"
                    style={{ WebkitTextStroke: '0.75px #16241B' }}
                  >
                    You Know Today
                  </span>
                  <span className="text-[#16241B]">.</span>
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

              <div className="lg:col-span-5 flex justify-center items-center relative z-20 overflow-visible">
                <div className="relative w-full max-w-[250px] sm:max-w-[270px] h-[250px] sm:h-[270px] flex justify-center items-center overflow-visible">
                  <img
                    src={getCloudinaryImageUrl('health_tips_cta')}
                    alt="Pet Health Care"
                    className="relative z-10 w-[118%] max-w-[320px] h-auto object-contain -mt-14 -mb-2 pointer-events-none drop-shadow-md"
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
