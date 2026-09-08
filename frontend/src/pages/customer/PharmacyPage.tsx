import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { getCloudinaryImageUrl } from '../../lib/utils';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../features/auth/AuthContext';
import {
  ArrowRight,
  Star,
  Heart,
  Pill,
  ShoppingBag,
  Utensils,
  Scissors,
  Shield,
  ShieldCheck,
  HeartPulse,
  Minus,
  Plus,
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

interface CartItemMapValue {
  id: number;
  quantity: number;
}

export const PharmacyPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Record<number, CartItemMapValue>>({});
  const [updatingCart, setUpdatingCart] = useState<Record<number, boolean>>({});
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
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

  const fetchCart = () => {
    if (isAuthenticated) {
      apiClient
        .get('/customer/cart')
        .then((res) => {
          const items: { id: number; productId: number; quantity: number }[] = res.data || [];
          const map: Record<number, CartItemMapValue> = {};
          items.forEach((item) => {
            map[item.productId] = { id: item.id, quantity: item.quantity };
          });
          setCartItems(map);
        })
        .catch(() => {
          setCartItems({});
        });
    } else {
      setCartItems({});
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [isAuthenticated]);

  const handleAddToCart = async (product: ProductItem) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setUpdatingCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      const res = await apiClient.post('/customer/cart', {
        productId: product.id,
        quantity: 1,
      });
      if (res.data) {
        setCartItems((prev) => ({
          ...prev,
          [product.id]: { id: res.data.id, quantity: res.data.quantity || 1 },
        }));
      }
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      // Error handled safely
    } finally {
      setUpdatingCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleIncreaseQuantity = async (product: ProductItem, cartItem: CartItemMapValue) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (cartItem.quantity >= product.stockQuantity) return;

    setUpdatingCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      const newQty = cartItem.quantity + 1;
      const res = await apiClient.put(`/customer/cart/${cartItem.id}?quantity=${newQty}`);
      if (res.data) {
        setCartItems((prev) => ({
          ...prev,
          [product.id]: { ...cartItem, quantity: newQty },
        }));
      }
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      // Error handled safely
    } finally {
      setUpdatingCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleDecreaseQuantity = async (product: ProductItem, cartItem: CartItemMapValue) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setUpdatingCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      const newQty = cartItem.quantity - 1;
      if (newQty <= 0) {
        await apiClient.delete(`/customer/cart/${cartItem.id}`);
        setCartItems((prev) => {
          const next = { ...prev };
          delete next[product.id];
          return next;
        });
      } else {
        await apiClient.put(`/customer/cart/${cartItem.id}?quantity=${newQty}`);
        setCartItems((prev) => ({
          ...prev,
          [product.id]: { ...cartItem, quantity: newQty },
        }));
      }
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      // Error handled safely
    } finally {
      setUpdatingCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const next = !prev[productId];
      return { ...prev, [productId]: next };
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const resolveProductImageUrl = (product: ProductItem) => {
    if (product.imageUrl && (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://'))) {
      return product.imageUrl;
    }
    const name = product.name.toLowerCase();
    if (name.includes("hill") || name.includes("dog food")) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895703/7e3d7c1c-875e-4c8b-aec1-305c49fc646b_1.png';
    }
    if (name.includes("frontline")) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895698/00b4a02b-168d-4be6-a4b4-29daad1e6881_1.png';
    }
    if (name.includes("royal canin") || name.includes("kitten")) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895662/e17e6de5-60ad-4ad5-be39-9be97c37f09e_1.png';
    }
    if (name.includes("vetplus") || name.includes("joint")) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895661/2448c43e-adb1-4b95-8e66-6667e0f7c993_1.png';
    }
    if (name.includes("virbac") || name.includes("epi-otic") || name.includes("ear cleaner")) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895659/68817e23-cd56-4e36-b8db-9acbdfa5545d_1.png';
    }
    if (name.includes("nexgard") || name.includes("chews")) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896036/Screenshot_2026-09-09_010242.png';
    }
    const fallbacks = [
      'https://res.cloudinary.com/vphylrop/image/upload/v1788895703/7e3d7c1c-875e-4c8b-aec1-305c49fc646b_1.png',
      'https://res.cloudinary.com/vphylrop/image/upload/v1788895698/00b4a02b-168d-4be6-a4b4-29daad1e6881_1.png',
      'https://res.cloudinary.com/vphylrop/image/upload/v1788895662/e17e6de5-60ad-4ad5-be39-9be97c37f09e_1.png',
      'https://res.cloudinary.com/vphylrop/image/upload/v1788895661/2448c43e-adb1-4b95-8e66-6667e0f7c993_1.png',
      'https://res.cloudinary.com/vphylrop/image/upload/v1788895659/68817e23-cd56-4e36-b8db-9acbdfa5545d_1.png',
      'https://res.cloudinary.com/vphylrop/image/upload/v1788896036/Screenshot_2026-09-09_010242.png',
    ];
    return fallbacks[(product.id - 1) % fallbacks.length];
  };

  const pharmacyCategoryTabs = [
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

      <main className="flex-grow space-y-16 lg:space-y-24 pb-20">
        {/* 2. Hero Section */}
        <section id="pharmacy-hero" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-left z-20">
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
              </div>
            </div>

            {/* Right Column: Large cutout image (7 cols) */}
            <div className="lg:col-span-7 relative flex justify-center items-center lg:-translate-x-6 xl:-translate-x-10">
              <div className="relative w-full max-w-[700px] lg:max-w-[900px] xl:max-w-[1050px] overflow-visible py-4 sm:py-6">
                <img
                  src={getCloudinaryImageUrl('pharmacy_hero')}
                  alt="Pet Pharmacy Essentials"
                  className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Popular Products Grid */}
        <section id="popular-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#EF7C3C] uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-[#EF7C3C]" />
                <span>ALL PHARMACY PRODUCTS</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight">
                Loved by <span className="text-[#EF7C3C]">Pets,</span> Recommended by Vets
              </h2>
            </div>

            <button
              onClick={() => setActiveCategoryFilter('All')}
              className="text-xs sm:text-sm font-bold text-[#009E66] hover:text-[#008757] hover:underline flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <span>View all products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Filter Pills (Matching Image 2 Style) */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 w-full py-1 overflow-x-auto no-scrollbar scroll-smooth">
            {pharmacyCategoryTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected =
                activeCategoryFilter !== 'All' &&
                tab.name.toLowerCase().includes(activeCategoryFilter.toLowerCase());

              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    if (tab.name.includes('Food')) {
                      setActiveCategoryFilter('Food');
                    } else if (tab.name.includes('Grooming')) {
                      setActiveCategoryFilter('Grooming');
                    } else if (tab.name.includes('Supplements')) {
                      setActiveCategoryFilter('Supplements');
                    } else if (tab.name.includes('Flea')) {
                      setActiveCategoryFilter('Flea');
                    } else {
                      setActiveCategoryFilter(tab.name);
                    }
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#E6F9EC] border-[#3FA65C] text-[#287A41] shadow-xs ring-2 ring-[#3FA65C]/20'
                      : 'bg-white border-[#EDE7D9] text-[#556658] hover:border-[#3FA65C] hover:text-[#16241B] shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-[#3FA65C] text-white' : `${tab.bg} ${tab.text}`
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
              );
            })}
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
                      <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-white mb-3 p-2 border border-[#F0EAE1]">
                        <img
                          src={resolveProductImageUrl(product)}
                          alt={product.name}
                          className="w-full h-full object-contain rounded-[12px]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label="Add to wishlist"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${isFavorited
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

                        {cartItems[product.id] ? (
                          <div className="inline-flex items-center bg-[#E6F9EC] border border-[#3FA65C] rounded-full p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQuantity(product, cartItems[product.id])}
                              disabled={updatingCart[product.id]}
                              aria-label="Decrease quantity"
                              className="w-7 h-7 rounded-full bg-white text-[#287A41] hover:bg-[#3FA65C] hover:text-white flex items-center justify-center font-bold text-sm shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="min-w-[28px] text-center text-xs font-black text-[#16241B] px-1">
                              {cartItems[product.id].quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncreaseQuantity(product, cartItems[product.id])}
                              disabled={
                                updatingCart[product.id] ||
                                cartItems[product.id].quantity >= product.stockQuantity
                              }
                              aria-label="Increase quantity"
                              className="w-7 h-7 rounded-full bg-[#009E66] text-white hover:bg-[#008757] flex items-center justify-center font-bold text-sm shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={updatingCart[product.id] || product.stockQuantity <= 0}
                            className="px-3.5 py-2 bg-[#009E66] hover:bg-[#008757] text-white text-xs font-bold rounded-full shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </section>

        {/* 5. Special Care Section (Without Image) */}
        <section id="special-care" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFF8F0] rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#E2EEDB] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading & Info */}
              <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#287A41] text-xs font-black uppercase tracking-wider shadow-2xs border border-[#C3ECD0]">
                  <Shield className="w-3.5 h-3.5 text-[#287A41]" />
                  <span>Stay Prepared</span>
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16241B] tracking-tight leading-tight">
                  Special Care for<br className="hidden sm:inline" /> Their <span className="text-[#3FA65C]">Special Needs</span>
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
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 border border-[#EDE7D9] shadow-xs flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5"
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
                    </div>
                  );
                })}
              </div>
            </div>
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
                  <span
                    className="text-[#EF7C3C]"
                    style={{ WebkitTextStroke: '0.75px #16241B' }}
                  >
                    Best Care.
                  </span>
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
