import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { StickyCartBar } from '../../components/layout/StickyCartBar';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl, formatCurrency } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
import { useWishlistIds } from '../../hooks/useWishlistIds';
import { useCart } from '../../hooks/useCart';
import { ProductCard, type ProductItemData } from '../../components/products/ProductCard';
import { QuickViewModal } from '../../components/products/QuickViewModal';
import { SearchBar } from '../../components/products/SearchBar';
import { RecommendationCarousel } from '../../components/products/RecommendationCarousel';
import { Odometer } from '../../components/ui/Odometer';
import { springs, staggerContainer, fadeUp } from '../../lib/motion';
import {
  Star,
  Pill,
  Utensils,
  Scissors,
  Shield,
  ShieldCheck,
  HeartPulse,
  SlidersHorizontal,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

export const PharmacyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State synced to URL Query Params
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('q') || '';
  const maxPriceParam = Number(searchParams.get('maxPrice')) || 5000;
  const rxParam = searchParams.get('rx') === 'true';

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [maxPrice, setMaxPrice] = useState<number>(maxPriceParam);
  const [prescriptionOnly, setPrescriptionOnly] = useState<boolean>(rxParam);
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItemData | null>(null);

  // Hooks
  const { isSaved } = useWishlistIds();
  const { addToCart, items: cartItems, isUpdating } = useCart();

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeCategoryFilter !== 'All') params.category = activeCategoryFilter;
    if (searchQuery) params.q = searchQuery;
    if (maxPrice < 5000) params.maxPrice = maxPrice.toString();
    if (prescriptionOnly) params.rx = 'true';
    setSearchParams(params, { replace: true });
  }, [activeCategoryFilter, searchQuery, maxPrice, prescriptionOnly, setSearchParams]);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get<ProductItemData[]>('/products')
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch(() => {
        setError('Failed to load pharmacy products. Please check your connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const pharmacyCategoryTabs = [
    { name: 'All', icon: Sparkles, bg: 'bg-[#FAF6EE]', text: 'text-[#16241B]' },
    { name: 'Medications', icon: Pill, bg: 'bg-[#E6F9EC]', text: 'text-[#287A41]' },
    { name: 'Food & Nutrition', icon: Utensils, bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]' },
    { name: 'Grooming & Hygiene', icon: Scissors, bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]' },
    { name: 'Supplements & Care', icon: HeartPulse, bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]' },
    { name: 'Flea & Tick', icon: ShieldCheck, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]' },
  ];

  const specialCareItems = [
    {
      icon: Pill,
      title: 'Prescription Medicines',
      subtitle: "As per vet's recommendation",
    },
    {
      icon: ShieldCheck,
      title: 'Flea & Tick Prevention',
      subtitle: 'Keep them safe, always',
    },
    {
      icon: HeartPulse,
      title: 'Health Supplements',
      subtitle: 'For stronger immunity',
    },
    {
      icon: Zap,
      title: 'Senior Pet Care',
      subtitle: 'Special care for golden years',
    },
  ];

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category check
      if (activeCategoryFilter !== 'All') {
        const cat = activeCategoryFilter.toLowerCase();
        const matchesCategory =
          p.category.toLowerCase().includes(cat) ||
          (cat.includes('food') && p.category.toLowerCase().includes('food')) ||
          (cat.includes('grooming') && p.category.toLowerCase().includes('grooming')) ||
          (cat.includes('supplements') && p.category.toLowerCase().includes('supplement')) ||
          (cat.includes('flea') && (p.category.toLowerCase().includes('flea') || p.name.toLowerCase().includes('flea')));

        if (!matchesCategory) return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Price limit
      if (p.price > maxPrice) return false;

      // Prescription filter
      if (prescriptionOnly && !p.prescriptionRequired) return false;

      return true;
    });
  }, [products, activeCategoryFilter, searchQuery, maxPrice, prescriptionOnly]);

  const activeFiltersCount =
    (activeCategoryFilter !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (maxPrice < 5000 ? 1 : 0) +
    (prescriptionOnly ? 1 : 0);

  const resetFilters = () => {
    setActiveCategoryFilter('All');
    setSearchQuery('');
    setMaxPrice(5000);
    setPrescriptionOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col selection:bg-[#009E66]/20">
      {/* 1. Navbar */}
      <Navbar activePage="pharmacy" />

      <main className="flex-grow space-y-14 lg:space-y-20 pb-20">
        {/* 2. Hero Section */}
        <section id="pharmacy-hero" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left Column (5 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={springs.soft}
              className="lg:col-span-5 space-y-6 text-left z-20"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9EC] text-[#287A41] text-xs font-black uppercase tracking-wider shadow-2xs border border-[#C3ECD0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#287A41]" />
                <span>Verified Veterinary Care</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.12]">
                Healthy Pets,{' '}
                <span className="text-[#009E66]">Happier Lives.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#556658] max-w-xl font-medium leading-relaxed">
                Quality medicines, nutrient-dense nutrition, and wellness essentials curated for your furry companions.
              </p>

              {/* Action & Search */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#popular-products"
                  className="px-8 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-lg shadow-[#009E66]/25 transition-all active:scale-95 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  Explore Pharmacy
                </a>
              </div>
            </motion.div>

            {/* Right Column: Hero Image with Soft Parallax */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 relative flex justify-center items-center lg:-translate-x-6 xl:-translate-x-10"
            >
              <div className="relative w-full max-w-[700px] lg:max-w-[900px] xl:max-w-[1050px] overflow-visible py-4 sm:py-6">
                <img
                  src={getCloudinaryImageUrl('pharmacy_hero')}
                  alt="Pet Pharmacy Essentials"
                  className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Products Catalog Section */}
        <section id="popular-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Section Header with Live Search & Filter Toggle */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-2 border-b border-[#16241B]/8">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#EF7C3C] uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-[#EF7C3C]" />
                <span>PHARMACY & WELLNESS SHOP</span>
              </span>
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                  Loved by <span className="text-[#009E66]">Pets,</span> Trusted by Vets<span className="text-[#EF7C3C]">.</span>
                </h2>
                <span className="text-xs font-bold text-[#16241B]/50">
                  (<Odometer value={filteredProducts.length} /> products)
                </span>
              </div>
            </div>

            {/* Controls: Search + Filter Toggle */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <SearchBar
                products={products}
                onSelectProduct={(product) => setQuickViewProduct(product)}
                onSearchSubmit={(q) => setSearchQuery(q)}
                className="w-full md:w-auto"
              />

              <button
                type="button"
                onClick={() => setShowFiltersPanel((prev) => !prev)}
                className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  showFiltersPanel || activeFiltersCount > 0
                    ? 'bg-[#009E66] text-white border-[#009E66] shadow-md'
                    : 'bg-white/90 border-[#16241B]/10 text-[#16241B] hover:border-[#009E66]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-[#009E66] text-xs font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sliding Category Tabs with Shared layoutId Pill */}
          <div className="relative flex items-center gap-2 w-full py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            {pharmacyCategoryTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeCategoryFilter === tab.name;

              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveCategoryFilter(tab.name)}
                  className={`relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 z-10 ${
                    isSelected ? 'text-white' : 'text-[#16241B]/70 hover:text-[#16241B]'
                  }`}
                >
                  {/* Sliding layoutId Pill Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="pharmacyCategoryPill"
                      className="absolute inset-0 bg-[#009E66] rounded-full shadow-md z-[-1]"
                      transition={springs.snappy}
                    />
                  )}

                  {!isSelected && (
                    <div className="absolute inset-0 bg-white/80 border border-[#16241B]/8 rounded-full z-[-1] hover:border-[#009E66]/30 shadow-2xs" />
                  )}

                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Expandable Secondary Filter Drawer */}
          <AnimatePresence>
            {showFiltersPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={springs.soft}
                className="overflow-hidden"
              >
                <div className="glass-surface rounded-2xl p-5 border border-[#16241B]/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Price Slider with Follower Tooltip */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-[#16241B]/70">Max Price:</span>
                      <span className="text-[#009E66] font-black">{formatCurrency(maxPrice)}</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 bg-[#16241B]/10 rounded-lg appearance-none cursor-pointer accent-[#009E66]"
                      />
                    </div>
                  </div>

                  {/* Prescription Toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPrescriptionOnly((p) => !p)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        prescriptionOnly
                          ? 'bg-[#EF7C3C] text-white border-[#EF7C3C] shadow-sm'
                          : 'bg-white text-[#16241B]/80 border-[#16241B]/10 hover:border-[#EF7C3C]'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Prescription Only (Rx)</span>
                    </button>
                  </div>

                  {/* Reset All Filters */}
                  <div className="flex justify-start md:justify-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-wrap items-center gap-2 pt-1"
              >
                <span className="text-xs font-semibold text-[#16241B]/50 mr-1">Active:</span>

                {activeCategoryFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#009E66]/30 text-[#009E66] shadow-2xs">
                    Category: {activeCategoryFilter}
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('All')}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#009E66]/30 text-[#009E66] shadow-2xs">
                    Search: "{searchQuery}"
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice < 5000 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#009E66]/30 text-[#009E66] shadow-2xs">
                    Up to {formatCurrency(maxPrice)}
                    <button
                      type="button"
                      onClick={() => setMaxPrice(5000)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {prescriptionOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#EF7C3C]/30 text-[#EF7C3C] shadow-2xs">
                    Rx Required
                    <button
                      type="button"
                      onClick={() => setPrescriptionOnly(false)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid with Layout Animations & Skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[22px] p-4 border border-[#16241B]/8 space-y-3.5 shadow-sm"
                >
                  <div className="w-full aspect-square skeleton-shimmer rounded-2xl" />
                  <div className="h-4 w-1/3 skeleton-shimmer rounded-md" />
                  <div className="h-5 w-3/4 skeleton-shimmer rounded-md" />
                  <div className="h-4 w-1/2 skeleton-shimmer rounded-md" />
                  <div className="h-9 w-full skeleton-shimmer rounded-xl" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetchProducts} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="No products match your filters"
              description="Try clearing your search keyword or expanding your price range."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          ) : (
            <motion.div
              layout
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => {
                  const cartItem = cartItems.find((i) => i.productId === product.id);

                  return (
                    <motion.div
                      layout
                      key={product.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className="h-full flex flex-col"
                    >
                      <ProductCard
                        product={product}
                        isSaved={isSaved('PRODUCT', product.id)}
                        onQuickView={(p) => setQuickViewProduct(p)}
                        onAddToCart={(p, e) => addToCart(p, e)}
                        isAddingToCart={isUpdating[product.id]}
                        quantityInCart={cartItem?.quantity || 0}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* 4. Smart Recommendations Section */}
        {products.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecommendationCarousel
              products={products.slice(0, 8)}
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={(p, e) => addToCart(p, e)}
            />
          </div>
        )}

        {/* 5. Special Care Section */}
        <section id="special-care" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8F0] rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#E2EEDB] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading & Info */}
              <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#287A41] text-xs font-black uppercase tracking-wider shadow-2xs border border-[#C3ECD0]">
                  <Shield className="w-3.5 h-3.5 text-[#287A41]" />
                  <span>Stay Prepared</span>
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight leading-tight">
                  Special Care for<br className="hidden sm:inline" /> Their{' '}
                  <span className="text-[#009E66]">Special Needs</span>.
                </h2>

                <p className="text-sm sm:text-base text-[#556658] font-medium leading-relaxed max-w-md">
                  Explore our verified range of medicines and wellness products for every stage of your pet's life.
                </p>
              </div>

              {/* Right Column: 2x2 Cards Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specialCareItems.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      transition={springs.snappy}
                      className="bg-white rounded-2xl p-5 border border-[#EDE7D9] shadow-xs flex items-center gap-4 hover:shadow-md transition-all cursor-default"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#E6F9EC] text-[#287A41] flex items-center justify-center shrink-0 shadow-2xs">
                        <ItemIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-[#16241B] leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#556658] font-medium mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA Banner */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] px-6 sm:px-10 lg:px-12 py-6 sm:py-8 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 text-[#16241B] text-xs font-black uppercase tracking-wider shadow-2xs">
                  <span>Healthy Pets. Happy Homes.</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Because They Deserve the{' '}
                  <span
                    className="text-[#EF7C3C]"
                    style={{ WebkitTextStroke: '0.75px #16241B' }}
                  >
                    Best Care
                  </span>
                  .
                </h2>

                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Shop now for premium pet medicines, supplements and essentials!
                </p>

                <div className="pt-2">
                  <a
                    href="#popular-products"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-md transition-all text-sm sm:text-base cursor-pointer active:scale-95"
                  >
                    Shop Now
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center items-center relative z-20 overflow-visible">
                <div className="relative w-full max-w-[250px] sm:max-w-[270px] h-[250px] sm:h-[270px] flex justify-center items-center overflow-visible">
                  <img
                    src={getCloudinaryImageUrl('pharmacy_cta')}
                    alt="Pet Pharmacy Essentials"
                    className="relative z-10 w-[118%] max-w-[280px] h-auto object-contain -mt-14 -mb-2 pointer-events-none drop-shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quick View Shared-Element Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          isSaved={isSaved('PRODUCT', quickViewProduct.id)}
        />
      )}

      <Footer />
      <StickyCartBar />
    </div>
  );
};

export default PharmacyPage;
