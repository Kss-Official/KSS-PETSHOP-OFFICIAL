import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import {
  ShieldCheck,
  Truck,
  Headphones,
  Lock,
  ArrowRight,
  ChevronRight,
  Star,
  Heart,
  Pill,
  Sparkles,
  ShoppingBag,
  Check,
  Utensils,
  Scissors,
  Shield,
  HeartPulse,
} from 'lucide-react';

interface ProductItem {
  id: string;
  category: string;
  name: string;
  rating: number;
  reviewsCount: string;
  price: number;
  placeholderLabel: string;
}

export const PharmacyPage: React.FC = () => {
  const [cartCount, setCartCount] = useState<number>(() => {
    const saved = localStorage.getItem('pawfectly_cart_count');
    return saved ? parseInt(saved, 10) : 2;
  });

  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const defaultProducts: ProductItem[] = [
    {
      id: 'prod-1',
      category: 'FOOD & NUTRITION',
      name: "Hill's Science Diet Adult Dry Dog Food",
      rating: 4.8,
      reviewsCount: '1.2k',
      price: 2499,
      placeholderLabel: "Hill's Science Diet Dog Food Bag",
    },
    {
      id: 'prod-2',
      category: 'FLEA & TICK',
      name: 'Frontline Plus Flea & Tick Treatment',
      rating: 4.7,
      reviewsCount: '856',
      price: 1299,
      placeholderLabel: 'Frontline Plus Treatment Box',
    },
    {
      id: 'prod-3',
      category: 'FOOD & NUTRITION',
      name: 'Royal Canin Kitten Food',
      rating: 4.9,
      reviewsCount: '1.5k',
      price: 1899,
      placeholderLabel: 'Royal Canin Kitten Food Pouch',
    },
    {
      id: 'prod-4',
      category: 'SUPPLEMENTS',
      name: 'VetPlus Joint Care Supplement',
      rating: 4.6,
      reviewsCount: '642',
      price: 1599,
      placeholderLabel: 'VetPlus Joint Care Bottle',
    },
    {
      id: 'prod-5',
      category: 'GROOMING',
      name: 'Virbac Ear Cleaner',
      rating: 4.9,
      reviewsCount: '321',
      price: 799,
      placeholderLabel: 'Virbac Ear Cleaner Dropper',
    },
  ];

  useEffect(() => {
    // Fetch live products with fallback to default seed data
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/v1/products');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback gracefully on network error or initial dev mode
      }
      setProducts(defaultProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = async (product: ProductItem) => {
    try {
      await fetch('/api/v1/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      }).catch(() => {
        // Safe catch for local offline / unauthenticated handling
      });
    } catch {
      // Ignore network errors
    }

    const newCount = cartCount + 1;
    setCartCount(newCount);
    localStorage.setItem('pawfectly_cart_count', newCount.toString());
    showToast(`Added "${product.name}" to cart! 🐾`);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = !prev[productId];
      showToast(next ? 'Added to favorites!' : 'Removed from favorites');
      return { ...prev, [productId]: next };
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const categoryCards = [
    {
      id: 'meds',
      title: 'Medications',
      subtitle: 'Prescription & OTC',
      icon: Pill,
      bg: 'bg-[#E6F9EC]',
      text: 'text-[#287A41]',
      border: 'border-[#C3ECD0]',
      placeholderLabel: 'Pet Medications & Drops',
    },
    {
      id: 'food',
      title: 'Food & Nutrition',
      subtitle: 'Dry & Wet Food',
      icon: Utensils,
      bg: 'bg-[#F3E8FF]',
      text: 'text-[#7E22CE]',
      border: 'border-[#E9D5FF]',
      placeholderLabel: 'Cat Eating Premium Food',
    },
    {
      id: 'grooming',
      title: 'Grooming & Hygiene',
      subtitle: 'Shampoos & Cleaners',
      icon: Scissors,
      bg: 'bg-[#FEF9C3]',
      text: 'text-[#B45309]',
      border: 'border-[#FDE047]',
      placeholderLabel: 'Grooming Dog Bath',
    },
    {
      id: 'supplements',
      title: 'Supplements & Care',
      subtitle: 'Vitamins & Joint Care',
      icon: HeartPulse,
      bg: 'bg-[#FFE4E6]',
      text: 'text-[#E11D48]',
      border: 'border-[#FECDD3]',
      placeholderLabel: 'Fluffy Cat with Supplements',
    },
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
      icon: Heart,
      title: 'Senior Pet Care',
      subtitle: 'Special care for golden years',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col">
      {/* 1. Navbar */}
      <Navbar activePage="pharmacy" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16241B] text-white px-5 py-3 rounded-full shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#3FA65C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow space-y-16 lg:space-y-24 pb-20">
        {/* 2. Hero Section */}
        <section className="bg-[#EFF8F0] border-b border-[#E2EEDB] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F9EC] text-[#287A41] text-xs font-black uppercase tracking-wider shadow-2xs border border-[#C3ECD0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#287A41]" />
                  <span>Trusted Pet Pharmacy</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Healthy Pets,{' '}
                  <span className="text-[#EF7C3C]">Happier Lives.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#556658] max-w-xl font-medium leading-relaxed">
                  Quality medicines, supplements and wellness products for your
                  furry friends. Because their health matters — today and always.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <a
                    href="#popular-products"
                    className="px-8 py-3.5 bg-[#3FA65C] hover:bg-[#348e4e] text-white font-black rounded-full shadow-md transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#special-care"
                    className="px-7 py-3.5 bg-white hover:bg-[#FAF6EE] text-[#16241B] border border-[#E5DFCE] font-bold rounded-full shadow-xs transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    Learn More
                  </a>
                </div>

                {/* Trust Row (4 items) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#E6F9EC] text-[#287A41] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#16241B]">100% Genuine Products</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#16241B]">Fast & Reliable Delivery</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center shrink-0">
                      <Headphones className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#16241B]">Expert Support</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FEF9C3] text-[#B45309] flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#16241B]">Secure & Easy Checkout</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Image with Floating Speech Bubble */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                {/* Organic Green Blob Shape */}
                <div className="absolute inset-0 bg-[#D8F3DC]/70 rounded-[48%_52%_68%_32%/42%_58%_42%_58%] -rotate-3 scale-105 pointer-events-none blur-xs" />

                {/* Floating Speech Bubble */}
                <div className="absolute -top-4 right-4 z-20 bg-white border border-[#E2EEDB] px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5A623] shrink-0" />
                  <span className="text-xs font-black text-[#16241B]">
                    Good Health = More Playtime!
                  </span>
                </div>

                {/* Hero Photo Placeholder */}
                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#D0EBD5] shadow-lg bg-white z-10">
                  <ImagePlaceholder
                    label="Dog and Cat with Pet Pharmacy Essentials"
                    className="rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Shop by Category (4-Card Row) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Header Info */}
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#EF7C3C] text-xs font-black uppercase tracking-wider">
                SHOP BY CATEGORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight leading-tight">
                Everything They Need,<br />All in One Place.
              </h2>
              <p className="text-xs sm:text-sm text-[#556658] font-medium leading-relaxed">
                From daily essentials to special care, find the best products for your pet's health and happiness.
              </p>
              <button className="bg-[#3FA65C] hover:bg-[#348e4e] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer">
                Browse All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: 4 Category Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryCards.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.title)}
                    className={`${cat.bg} rounded-[22px] p-3.5 border ${cat.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative`}
                  >
                    {/* Top Photo with Icon Badge */}
                    <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-white/70 mb-3">
                      <ImagePlaceholder label={cat.placeholderLabel} className="rounded-[16px]" />
                      <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs">
                        <CatIcon className={`w-3.5 h-3.5 ${cat.text}`} />
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-black text-[#16241B]">{cat.title}</h3>
                      <p className="text-[11px] font-semibold text-[#556658]">{cat.subtitle}</p>
                    </div>

                    {/* Bottom Right Small Arrow Button */}
                    <div className="mt-3 flex justify-end">
                      <div className="w-6 h-6 rounded-full bg-white group-hover:bg-[#16241B] group-hover:text-white text-[#16241B] flex items-center justify-center shadow-2xs transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Special Care for Their Special Needs (Split Section) */}
        <section id="special-care" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8F0] rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#E2EEDB] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#287A41] text-xs font-black uppercase tracking-wider shadow-2xs border border-[#C3ECD0]">
                  <Shield className="w-3.5 h-3.5 text-[#287A41]" />
                  <span>Stay Prepared</span>
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight leading-tight">
                  Special Care for<br />Their <span className="text-[#EF7C3C]">Special Needs</span>
                </h2>

                <p className="text-xs sm:text-sm text-[#556658] font-medium leading-relaxed">
                  Explore our wide range of medicines and wellness products for every stage of your pet's life.
                </p>

                <button className="bg-[#3FA65C] hover:bg-[#348e4e] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer">
                  Explore Products <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Middle Column: 4 List Items */}
              <div className="lg:col-span-4 space-y-3.5">
                {specialCareItems.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-3.5 border border-[#EDE7D9] shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E6F9EC] text-[#287A41] flex items-center justify-center shrink-0 shadow-2xs">
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-[#16241B]">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#556658] font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Photo with Handwritten Badge */}
              <div className="lg:col-span-4 flex justify-center items-center relative">
                <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-2 border-white shadow-md bg-white">
                  <ImagePlaceholder
                    label="French Bulldog with Stethoscope"
                    className="rounded-3xl"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-[#EDE7D9] px-3 py-1.5 rounded-xl shadow-xs text-[10px] font-black text-[#16241B]">
                    Healthy Today, Happier Tomorrow ✨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Popular Products (5-Card Grid) */}
        <section id="popular-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#EF7C3C] uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-[#EF7C3C]" />
                  <span>POPULAR PRODUCTS</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                  Loved by Pets, Recommended by Vets.
                </h2>
              </div>

              <a
                href="#all-products"
                className="text-xs sm:text-sm font-bold text-[#3FA65C] hover:text-[#2e7d44] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* 5 Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {loading
                ? defaultProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] animate-pulse h-72"
                    />
                  ))
                : (activeCategoryFilter === 'All'
                    ? products
                    : products.filter(
                        (p) =>
                          p.category.toLowerCase().includes(activeCategoryFilter.toLowerCase().slice(0, 4)) ||
                          (activeCategoryFilter === 'Medications' && p.category.includes('FLEA'))
                      )
                  ).map((product) => {
                    const isFavorited = !!wishlist[product.id];
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        {/* Top Image + Wishlist Button */}
                        <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-[#FAF6EE] mb-3">
                          <ImagePlaceholder
                            label={product.placeholderLabel}
                            className="rounded-[16px]"
                          />
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            aria-label="Add to wishlist"
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isFavorited
                                  ? 'text-[#E11D48] fill-[#E11D48]'
                                  : 'text-[#88998C] hover:text-[#E11D48]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 flex-grow">
                          <span className="text-[10px] font-black text-[#88998C] uppercase tracking-wider">
                            {product.category}
                          </span>
                          <h3 className="text-xs sm:text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2 leading-snug">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 text-xs text-[#556658] pt-0.5">
                            <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                            <span className="font-extrabold text-[#16241B]">
                              {product.rating}
                            </span>
                            <span className="text-[11px]">({product.reviewsCount})</span>
                          </div>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="pt-3 mt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-semibold text-[#88998C] block -mb-0.5">
                              Price
                            </span>
                            <span className="text-sm font-black text-[#16241B]">
                              {formatCurrency(product.price)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="px-3.5 py-2 bg-[#3FA65C] hover:bg-[#348e4e] text-white text-xs font-bold rounded-full shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </section>

        {/* 6. CTA Banner (Green Highlight for 'Best Care') */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Left Column: Heading, Copy & Action */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 text-[#16241B] text-xs font-black uppercase tracking-wider shadow-2xs">
                  <span>Healthy Pets. Happy Homes.</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Because They Deserve the{' '}
                  <span className="text-[#3FA65C]">Best Care.</span>
                </h2>

                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Shop now for premium pet medicines, supplements and more!
                </p>

                <div className="pt-2">
                  <a
                    href="#popular-products"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#16241B] hover:bg-[#23382A] text-white font-black rounded-full shadow-md transition-all text-sm sm:text-base cursor-pointer"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Corgi with Sunglasses */}
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
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};
