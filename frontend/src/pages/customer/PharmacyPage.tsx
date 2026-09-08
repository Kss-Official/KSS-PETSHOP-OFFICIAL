import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../features/auth/AuthContext';
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
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stockQuantity: number;
  rating: number;
  reviewsCount: number;
  imageUrl?: string;
  prescriptionRequired?: boolean;
}

export const PharmacyPage: React.FC = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/products')
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch(() => {
        setError('Failed to load products. Please check your connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchCartCount = () => {
    if (isAuthenticated) {
      apiClient
        .get('/customer/cart')
        .then((res) => {
          const items = res.data || [];
          const totalCount = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
          setCartCount(totalCount);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [isAuthenticated]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = async (product: ProductItem) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await apiClient.post('/customer/cart', {
        productId: product.id,
        quantity: 1,
      });
      setCartCount((prev) => prev + 1);
      showToast(`Added "${product.name}" to cart! 🐾`);
    } catch {
      showToast('Could not add to cart. Please try again.');
    }
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const next = !prev[productId];
      showToast(next ? 'Added to favorites!' : 'Removed from favorites');
      return { ...prev, [productId]: next };
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
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
      categoryFilter: 'Medications',
    },
    {
      id: 'food',
      title: 'Food & Nutrition',
      subtitle: 'Dry & Wet Food',
      icon: Utensils,
      bg: 'bg-[#F3E8FF]',
      text: 'text-[#7E22CE]',
      border: 'border-[#E9D5FF]',
      categoryFilter: 'Food',
    },
    {
      id: 'grooming',
      title: 'Grooming & Hygiene',
      subtitle: 'Shampoos & Cleaners',
      icon: Scissors,
      bg: 'bg-[#FEF9C3]',
      text: 'text-[#B45309]',
      border: 'border-[#FDE047]',
      categoryFilter: 'Grooming',
    },
    {
      id: 'supplements',
      title: 'Supplements & Care',
      subtitle: 'Vitamins & Joint Care',
      icon: HeartPulse,
      bg: 'bg-[#FFE4E6]',
      text: 'text-[#E11D48]',
      border: 'border-[#FECDD3]',
      categoryFilter: 'Supplements',
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

  const filteredProducts = products.filter((p) => {
    if (activeCategoryFilter === 'All') return true;
    return (
      p.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()) ||
      p.name.toLowerCase().includes(activeCategoryFilter.toLowerCase())
    );
  });

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

      {/* Floating Cart Quick Access */}
      {cartCount > 0 && (
        <Link
          to="/profile?tab=orders"
          className="fixed bottom-6 left-6 z-40 bg-[#009E66] hover:bg-[#008757] text-white px-5 py-3 rounded-full shadow-xl text-sm font-black flex items-center gap-2.5 transition-all hover:scale-105"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart ({cartCount})</span>
        </Link>
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
                    className="px-8 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-md transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#special-care"
                    className="px-7 py-3.5 bg-white hover:bg-[#FAF6EE] text-[#16241B] border border-[#E5DFCE] font-bold rounded-full shadow-xs transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    Special Care
                  </a>
                </div>

                {/* Trust Row */}
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
                    <span className="text-xs font-bold text-[#16241B]">Fast Delivery</span>
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
                    <span className="text-xs font-bold text-[#16241B]">Secure Checkout</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                <div className="absolute inset-0 bg-[#D8F3DC]/70 rounded-[48%_52%_68%_32%/42%_58%_42%_58%] -rotate-3 scale-105 pointer-events-none blur-xs" />
                <div className="absolute -top-4 right-4 z-20 bg-white border border-[#E2EEDB] px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5A623] shrink-0" />
                  <span className="text-xs font-black text-[#16241B]">
                    Good Health = More Playtime!
                  </span>
                </div>

                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#D0EBD5] shadow-lg bg-white z-10">
                  <img
                    src={getCloudinaryImageUrl('hero_dog_cat_green_bg')}
                    alt="Pet Pharmacy Essentials"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Shop by Category */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#EF7C3C] text-xs font-black uppercase tracking-wider">
                SHOP BY CATEGORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight leading-tight">
                Everything They Need,<br />All in One Place.
              </h2>
              <p className="text-xs sm:text-sm text-[#556658] font-medium leading-relaxed">
                From daily essentials to specialized care, find the best products for your pet's wellness.
              </p>
              <button
                onClick={() => setActiveCategoryFilter('All')}
                className="bg-[#009E66] hover:bg-[#008757] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                Browse All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryCards.map((cat) => {
                const CatIcon = cat.icon;
                const isSelected = activeCategoryFilter === cat.categoryFilter;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.categoryFilter)}
                    className={`${cat.bg} rounded-[22px] p-3.5 border ${
                      isSelected ? 'ring-2 ring-[#3FA65C] border-[#3FA65C]' : cat.border
                    } shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative`}
                  >
                    <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-white/70 mb-3 flex items-center justify-center">
                      <CatIcon className={`w-12 h-12 ${cat.text}`} />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-sm font-black text-[#16241B]">{cat.title}</h3>
                      <p className="text-[11px] font-semibold text-[#556658]">{cat.subtitle}</p>
                    </div>

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

        {/* 4. Special Care Split Section */}
        <section id="special-care" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8F0] rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#E2EEDB] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#287A41] text-xs font-black uppercase tracking-wider shadow-2xs border border-[#C3ECD0]">
                  <Shield className="w-3.5 h-3.5 text-[#287A41]" />
                  <span>Stay Prepared</span>
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-[#16241B] tracking-tight leading-tight">
                  Special Care for<br />Their <span className="text-[#EF7C3C]">Special Needs</span>
                </h2>

                <p className="text-xs sm:text-sm text-[#556658] font-medium leading-relaxed">
                  Explore our verified range of medicines and wellness products for every stage of your pet's life.
                </p>

                <a href="#popular-products">
                  <button className="bg-[#009E66] hover:bg-[#008757] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer">
                    Explore Products <ArrowRight className="w-4 h-4" />
                  </button>
                </a>
              </div>

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

              <div className="lg:col-span-4 flex justify-center items-center relative">
                <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-2 border-white shadow-md bg-white">
                  <img
                    src={getCloudinaryImageUrl('cta_cat_sunglasses_flawless_seamless')}
                    alt="Veterinary Care"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-[#EDE7D9] px-3 py-1.5 rounded-xl shadow-xs text-[10px] font-black text-[#16241B]">
                    Healthy Today, Happier Tomorrow ✨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Popular Products Grid */}
        <section id="popular-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#EF7C3C] uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-[#EF7C3C]" />
                  <span>ALL PHARMACY PRODUCTS</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                  Loved by Pets, Recommended by Vets ({filteredProducts.length})
                </h2>
              </div>

              {activeCategoryFilter !== 'All' && (
                <button
                  onClick={() => setActiveCategoryFilter('All')}
                  className="text-xs font-bold text-[#3FA65C] hover:underline"
                >
                  Show All Categories
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] space-y-3">
                    <Skeleton className="w-full aspect-square rounded-[16px]" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={fetchProducts} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title="No products available"
                description="We could not find any products in this category."
                actionLabel="View All Products"
                onAction={() => setActiveCategoryFilter('All')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {filteredProducts.map((product) => {
                  const isFavorited = !!wishlist[product.id];
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-[22px] p-3.5 border border-[#EDE7D9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-[#FAF6EE] mb-3">
                        <img
                          src={
                            product.imageUrl ||
                            getCloudinaryImageUrl('service_04_pharmacy_cat_med')
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

                      <div className="space-y-1.5 flex-grow">
                        <span className="text-[10px] font-black text-[#88998C] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors line-clamp-2 leading-snug">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-[#556658] pt-0.5">
                          <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                          <span className="font-extrabold text-[#16241B]">
                            {product.rating ? product.rating.toFixed(1) : '4.8'}
                          </span>
                          <span className="text-[11px]">({product.reviewsCount || 50})</span>
                        </div>
                      </div>

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
                          className="px-3.5 py-2 bg-[#009E66] hover:bg-[#008757] text-white text-xs font-bold rounded-full shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 6. CTA Banner */}
        <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 text-[#16241B] text-xs font-black uppercase tracking-wider shadow-2xs">
                  <span>Healthy Pets. Happy Homes.</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
                  Because They Deserve the{' '}
                  <span className="text-[#3FA65C]">Best Care.</span>
                </h2>

                <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
                  Shop now for premium pet medicines, supplements and essentials!
                </p>

                <div className="pt-2">
                  <a
                    href="#popular-products"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-md transition-all text-sm sm:text-base cursor-pointer"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </a>
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
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};
