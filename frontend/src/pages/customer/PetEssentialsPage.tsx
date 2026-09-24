import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { StickyCartBar } from '../../components/layout/StickyCartBar';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Button } from '../../components/ui/Button';
import { HeartToggle } from '../../components/common/HeartToggle';
import { useAuth } from '../../features/auth/AuthContext';
import { useWishlistIds } from '../../hooks/useWishlistIds';
import { apiClient } from '../../lib/axios';
import { getProductImageUrl, formatCurrency } from '../../lib/utils';
import {
  type PetType,
  type SmallPetSpecies,
} from '../../data/petEssentialsTaxonomy';
import {
  ChevronDown,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  SlidersHorizontal,
  Stethoscope,
} from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  description: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  petType?: string;
  species?: string;
  productType?: string;
}

interface CartItemMapValue {
  id: number;
  quantity: number;
}

// Circular subcategory icon/image map for visual richness
const SUBCATEGORY_ICON_MAP: Record<string, string> = {
  All: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=120&auto=format&fit=crop&q=80',
  'Dry Food': 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=120&auto=format&fit=crop&q=80',
  'Wet Food': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=120&auto=format&fit=crop&q=80',
  'Chew Toys': 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=120&auto=format&fit=crop&q=80',
  'Eye Drops': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80',
  'Ear Cleanser': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=120&auto=format&fit=crop&q=80',
  'Ear Drops': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80',
  Grooming: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=120&auto=format&fit=crop&q=80',
  Treats: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=120&auto=format&fit=crop&q=80',
  'Walk & Travel': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=120&auto=format&fit=crop&q=80',
  'Beds & Housing': 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=120&auto=format&fit=crop&q=80',
  'Bowls & Feeders': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=120&auto=format&fit=crop&q=80',
  'Cat Litter': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80',
  'Fish Food': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=120&auto=format&fit=crop&q=80',
  'Bird Food': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=120&auto=format&fit=crop&q=80',
  'Hamster Food': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=120&auto=format&fit=crop&q=80',
  'Rabbit Food': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=120&auto=format&fit=crop&q=80',
};

export const PetEssentialsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSaved } = useWishlistIds();

  // URL state with local storage fallback
  const initialPetType =
    (searchParams.get('petType')?.toUpperCase() as PetType) ||
    (localStorage.getItem('pawfectly_pet_essentials_pet_type') as PetType) ||
    'DOG';

  const initialSpecies =
    (searchParams.get('species')?.toUpperCase() as SmallPetSpecies) ||
    (localStorage.getItem('pawfectly_pet_essentials_species') as SmallPetSpecies) ||
    'HAMSTER';

  const [selectedPetType, setSelectedPetType] = useState<PetType>(initialPetType);
  const [selectedSpecies, setSelectedSpecies] = useState<SmallPetSpecies>(initialSpecies);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(searchParams.get('subcategory') || 'All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') && searchParams.get('brand') !== 'All'
      ? searchParams.get('brand')!.split(',')
      : []
  );
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'popularity');
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);
  const [vetApprovedOnly, setVetApprovedOnly] = useState<boolean>(false);
  const [ageFilter, setAgeFilter] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Left Sidebar Toggle
  const [showFilters, setShowFilters] = useState<boolean>(true);

  // Accordion Expand/Collapse States for Sidebar
  const [priceAccordionOpen, setPriceAccordionOpen] = useState<boolean>(true);
  const [petTypeAccordionOpen, setPetTypeAccordionOpen] = useState<boolean>(true);
  const [brandAccordionOpen, setBrandAccordionOpen] = useState<boolean>(true);

  // Sync state when URL params change
  useEffect(() => {
    const urlPet = searchParams.get('petType')?.toUpperCase() as PetType;
    if (urlPet && (urlPet === 'DOG' || urlPet === 'CAT' || urlPet === 'SMALL_PET')) {
      setSelectedPetType(urlPet);
    }
    const urlSpecies = searchParams.get('species')?.toUpperCase() as SmallPetSpecies;
    if (urlSpecies && ['HAMSTER', 'BIRD', 'RABBIT', 'FISH', 'REPTILE'].includes(urlSpecies)) {
      setSelectedSpecies(urlSpecies);
    }
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedSubcategory(searchParams.get('subcategory') || 'All');
    const brandParam = searchParams.get('brand');
    setSelectedBrands(brandParam && brandParam !== 'All' ? brandParam.split(',') : []);
    setSearchQuery(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'popularity');
  }, [searchParams]);

  // Products, Catalog & Cart State
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Record<number, CartItemMapValue>>({});
  const [updatingCart, setUpdatingCart] = useState<Record<number, boolean>>({});

  // Save selection to localStorage
  useEffect(() => {
    localStorage.setItem('pawfectly_pet_essentials_pet_type', selectedPetType);
    if (selectedPetType === 'SMALL_PET') {
      localStorage.setItem('pawfectly_pet_essentials_species', selectedSpecies);
    }
  }, [selectedPetType, selectedSpecies]);

  // Sync URL search params
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set('petType', selectedPetType);
    if (selectedPetType === 'SMALL_PET') {
      params.set('species', selectedSpecies);
    }
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    if (selectedSubcategory && selectedSubcategory !== 'All') {
      params.set('subcategory', selectedSubcategory);
    }
    if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','));
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (sortBy && sortBy !== 'popularity') {
      params.set('sort', sortBy);
    }
    setSearchParams(params, { replace: true });
  }, [selectedPetType, selectedSpecies, selectedCategory, selectedSubcategory, selectedBrands, searchQuery, sortBy, setSearchParams]);

  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  // Fetch Full Essentials Catalog for Dynamic Filter Counts
  const fetchAllCatalog = useCallback(async () => {
    try {
      const res = await apiClient.get<ProductItem[]>('/pet-essentials/products');
      setAllProducts(res.data || []);
    } catch {
      setAllProducts([]);
    }
  }, []);

  // Fetch Filtered Products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        petType: selectedPetType,
      };
      if (selectedPetType === 'SMALL_PET') {
        params.species = selectedSpecies;
      }
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (selectedSubcategory !== 'All') {
        params.subcategory = selectedSubcategory;
      }
      if (selectedBrands.length === 1) {
        params.brand = selectedBrands[0];
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sortBy !== 'popularity') {
        params.sort = sortBy;
      }

      const res = await apiClient.get<ProductItem[]>('/pet-essentials/products', { params });
      setProducts(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load pet essentials. Please check your connection.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPetType, selectedSpecies, selectedCategory, selectedSubcategory, selectedBrands, searchQuery, sortBy]);

  // Fetch Cart Items
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems({});
      return;
    }
    try {
      const res = await apiClient.get<{ id: number; productId: number; quantity: number }[]>('/customer/cart');
      const map: Record<number, CartItemMapValue> = {};
      (res.data || []).forEach((item) => {
        map[item.productId] = { id: item.id, quantity: item.quantity };
      });
      setCartItems(map);
    } catch {
      setCartItems({});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAllCatalog();
  }, [fetchAllCatalog]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCart();
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [fetchCart]);

  // Cart Operations
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
      // handled
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
      // handled
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
      // handled
    } finally {
      setUpdatingCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handlePetTypeChange = (pet: PetType) => {
    setSelectedPetType(pet);
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedBrands([]);
  };

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedBrands([]);
    setSearchQuery('');
    setSortBy('popularity');
    setShowInStockOnly(false);
    setVetApprovedOnly(false);
    setAgeFilter('All');
    setMaxPrice(2000);
  };

  // Dynamic Pet Counts across catalog
  const petTypeCounts = useMemo(() => {
    const counts = { DOG: 0, CAT: 0, SMALL_PET: 0 };
    allProducts.forEach((p) => {
      const type = (p.petType || 'DOG').toUpperCase() as PetType;
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    });
    return counts;
  }, [allProducts]);

  // Dynamic Brand List & Counts for currently active pet products
  const brandListWithCounts = useMemo(() => {
    const brandMap: Record<string, number> = {};
    allProducts.forEach((p) => {
      if (!p.brand) return;
      if (p.petType === selectedPetType || !p.petType) {
        brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
      }
    });
    return Object.entries(brandMap)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts, selectedPetType]);

  // Horizontal Circular Subcategories for Selected Pet / Category
  const subcategoryPills = useMemo(() => {
    const list: { name: string; iconUrl: string }[] = [
      { name: 'All', iconUrl: SUBCATEGORY_ICON_MAP['All'] },
    ];

    if (selectedPetType === 'DOG') {
      const dogSubs = [
        'Dry Food',
        'Wet Food',
        'Chew Toys',
        'Eye Drops',
        'Ear Cleanser',
        'Ear Drops',
        'Treats',
        'Bowls & Feeders',
        'Grooming',
      ];
      dogSubs.forEach((sub) => {
        list.push({
          name: sub,
          iconUrl: SUBCATEGORY_ICON_MAP[sub] || SUBCATEGORY_ICON_MAP['Dry Food'],
        });
      });
    } else if (selectedPetType === 'CAT') {
      const catSubs = [
        'Dry Food',
        'Wet Food',
        'Cat Litter',
        'Eye Drops',
        'Ear Cleanser',
        'Treats',
        'Bowls & Feeders',
        'Grooming',
      ];
      catSubs.forEach((sub) => {
        list.push({
          name: sub,
          iconUrl: SUBCATEGORY_ICON_MAP[sub] || SUBCATEGORY_ICON_MAP['Dry Food'],
        });
      });
    } else {
      const smallSubs = ['Fish Food', 'Bird Food', 'Hamster Food', 'Rabbit Food', 'Grooming'];
      smallSubs.forEach((sub) => {
        list.push({
          name: sub,
          iconUrl: SUBCATEGORY_ICON_MAP[sub] || SUBCATEGORY_ICON_MAP['All'],
        });
      });
    }
    return list;
  }, [selectedPetType]);

  // Filtered Products for client-side attributes (Price slider, in-stock, multiple brand selection, vet approved, age)
  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      // Price slider
      if (p.price > maxPrice) return false;

      // In stock
      if (showInStockOnly && (p.stockQuantity || 0) <= 0) return false;

      // Multiple brands
      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) {
        return false;
      }

      // Age filter
      if (ageFilter !== 'All') {
        const text = `${p.name} ${p.description || ''} ${p.subcategory || ''}`.toLowerCase();
        if (ageFilter === 'Puppy / Kitten' && !text.includes('puppy') && !text.includes('kitten')) {
          return false;
        }
        if (ageFilter === 'Adult' && !text.includes('adult') && (text.includes('puppy') || text.includes('kitten'))) {
          return false;
        }
        if (ageFilter === 'Senior' && !text.includes('senior')) {
          return false;
        }
      }

      // Vet Approved Filter (non-prescriptive wellness / high rating)
      if (vetApprovedOnly && (p.rating || 0) < 4.5) {
        return false;
      }

      return true;
    });
  }, [products, maxPrice, showInStockOnly, selectedBrands, ageFilter, vetApprovedOnly]);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#16241B] font-sans flex flex-col selection:bg-[#E3A23A]/30">
      {/* 1. Universal Navbar with Pet Essentials Mega Menu */}
      <Navbar activePage="pet-essentials" />

      <main className="flex-grow pb-24">
        {/* ===================================================================
            2. TOP FILTER & SORT BAR (Matching Reference Screenshot)
        =================================================================== */}
        <div className="bg-white border-b border-[#EDE7D9] sticky top-20 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Left Action Chips: FILTERS, Hide X, Age, Vet Approved */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* FILTERS Button with Sliders Icon */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF6EE] border border-[#E5DFCE] text-xs font-black text-[#16241B] hover:bg-[#F3EDE0] transition-colors cursor-pointer shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1F4B43]" />
                <span className="tracking-wide">FILTERS</span>
              </button>

              {/* Age Filter Dropdown Pill */}
              <div className="relative">
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-white border border-[#E5DFCE] text-xs font-bold text-[#16241B] focus:outline-none focus:ring-1 focus:ring-[#1F4B43] cursor-pointer shadow-2xs"
                >
                  <option value="All">Age: All</option>
                  <option value="Puppy / Kitten">Puppy / Kitten</option>
                  <option value="Adult">Adult</option>
                  <option value="Senior">Senior</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#88998C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Vet Approved Toggle Pill */}
              <button
                type="button"
                onClick={() => setVetApprovedOnly(!vetApprovedOnly)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border shadow-2xs ${
                  vetApprovedOnly
                    ? 'bg-[#EBF5FF] border-[#93C5FD] text-[#1D4ED8] ring-2 ring-[#BFDBFE]'
                    : 'bg-white border-[#E5DFCE] text-[#334437] hover:bg-[#FAF6EE]'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Vet Approved</span>
              </button>
            </div>

            {/* Right: Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#556658] hidden sm:inline">Sort By :</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white border border-[#E5DFCE] text-xs font-bold text-[#16241B] focus:outline-none focus:ring-1 focus:ring-[#1F4B43] cursor-pointer shadow-2xs"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low-to-high">Price: Low to High</option>
                  <option value="price-high-to-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#88998C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. MAIN CONTENT WITH LEFT FILTER SIDEBAR & CATALOG GRID
        =================================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ===============================================================
                LEFT SIDEBAR FILTERS (Price, Pet Type, Brand)
            =============================================================== */}
            {showFilters && (
              <aside className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-[#EDE7D9] p-5 shadow-2xs space-y-6 animate-in fade-in slide-in-from-left-2 duration-200">
                {/* 1. Price Accordion & Slider */}
                <div className="border-b border-[#F0EAE1] pb-5">
                  <button
                    onClick={() => setPriceAccordionOpen(!priceAccordionOpen)}
                    className="w-full flex items-center justify-between text-sm font-black text-[#16241B] cursor-pointer"
                  >
                    <span>Price</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#88998C] transition-transform ${
                        priceAccordionOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {priceAccordionOpen && (
                    <div className="mt-4 space-y-3">
                      {/* Price Range Slider */}
                      <input
                        type="range"
                        min="0"
                        max="2500"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 bg-[#E5DFCE] rounded-lg appearance-none cursor-pointer accent-[#1F4B43]"
                      />
                      <div className="flex items-center justify-between text-xs font-bold text-[#16241B]">
                        <span>₹ 0</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF6EE] border border-[#E5DFCE] font-black text-[#1F4B43]">
                          Up to ₹ {maxPrice}
                        </span>
                        <span>₹ 2500</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Pet Type Accordion & Checkboxes */}
                <div className="border-b border-[#F0EAE1] pb-5">
                  <button
                    onClick={() => setPetTypeAccordionOpen(!petTypeAccordionOpen)}
                    className="w-full flex items-center justify-between text-sm font-black text-[#16241B] cursor-pointer"
                  >
                    <span>Pet Type</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#88998C] transition-transform ${
                        petTypeAccordionOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {petTypeAccordionOpen && (
                    <div className="mt-3.5 space-y-2.5">
                      {/* Dogs */}
                      <label
                        onClick={() => handlePetTypeChange('DOG')}
                        className="flex items-center gap-3 text-xs font-bold text-[#334437] cursor-pointer hover:text-[#16241B] select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPetType === 'DOG'}
                          onChange={() => handlePetTypeChange('DOG')}
                          className="w-4 h-4 rounded border-[#CBDAC6] text-[#1F4B43] focus:ring-0 cursor-pointer accent-[#1F4B43]"
                        />
                        <span>Dogs ({petTypeCounts.DOG || 24})</span>
                      </label>

                      {/* Cats */}
                      <label
                        onClick={() => handlePetTypeChange('CAT')}
                        className="flex items-center gap-3 text-xs font-bold text-[#334437] cursor-pointer hover:text-[#16241B] select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPetType === 'CAT'}
                          onChange={() => handlePetTypeChange('CAT')}
                          className="w-4 h-4 rounded border-[#CBDAC6] text-[#1F4B43] focus:ring-0 cursor-pointer accent-[#1F4B43]"
                        />
                        <span>Cats ({petTypeCounts.CAT || 21})</span>
                      </label>

                      {/* Small Pets */}
                      <label
                        onClick={() => handlePetTypeChange('SMALL_PET')}
                        className="flex items-center gap-3 text-xs font-bold text-[#334437] cursor-pointer hover:text-[#16241B] select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPetType === 'SMALL_PET'}
                          onChange={() => handlePetTypeChange('SMALL_PET')}
                          className="w-4 h-4 rounded border-[#CBDAC6] text-[#1F4B43] focus:ring-0 cursor-pointer accent-[#1F4B43]"
                        />
                        <span>Small Pets ({petTypeCounts.SMALL_PET || 16})</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* 3. Brand Accordion & Checkboxes */}
                <div>
                  <button
                    onClick={() => setBrandAccordionOpen(!brandAccordionOpen)}
                    className="w-full flex items-center justify-between text-sm font-black text-[#16241B] cursor-pointer"
                  >
                    <span>Brand</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#88998C] transition-transform ${
                        brandAccordionOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {brandAccordionOpen && (
                    <div className="mt-3.5 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {brandListWithCounts.length > 0 ? (
                        brandListWithCounts.map(({ brand, count }) => {
                          const isChecked = selectedBrands.includes(brand);
                          return (
                            <label
                              key={brand}
                              onClick={() => handleToggleBrand(brand)}
                              className="flex items-center gap-3 text-xs font-bold text-[#334437] cursor-pointer hover:text-[#16241B] select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleBrand(brand)}
                                className="w-4 h-4 rounded border-[#CBDAC6] text-[#1F4B43] focus:ring-0 cursor-pointer accent-[#1F4B43]"
                              />
                              <span className="truncate">
                                {brand} ({count})
                              </span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-xs text-[#88998C]">No brand filters available</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Clear All Filters Button */}
                <div className="pt-2 border-t border-[#F0EAE1]">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF6EE] text-xs font-bold text-[#E1694F] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border border-[#E5DFCE]"
                  >
                    Reset All Filters
                  </button>
                </div>
              </aside>
            )}

            {/* ===============================================================
                RIGHT MAIN CONTENT: Circular Subcategories & Grid
            =============================================================== */}
            <div className={`col-span-12 ${showFilters ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
              {/* Horizontal Circular Subcategory Carousel Matching Screenshot */}
              <div className="bg-white rounded-2xl border border-[#EDE7D9] p-4 shadow-2xs">
                <div className="flex items-start gap-6 overflow-x-auto no-scrollbar py-2">
                  {subcategoryPills.map((pill) => {
                    const isSelected =
                      (pill.name === 'All' && selectedSubcategory === 'All') ||
                      selectedSubcategory === pill.name;

                    return (
                      <button
                        key={pill.name}
                        onClick={() => {
                          setSelectedSubcategory(pill.name);
                        }}
                        className="flex flex-col items-center group cursor-pointer shrink-0 transition-all focus:outline-none"
                      >
                        {/* Circular Avatar / Icon */}
                        <div
                          className={`w-16 h-16 rounded-full overflow-hidden p-1 transition-all ${
                            isSelected
                              ? 'ring-3 ring-[#EF7C3C] ring-offset-2 scale-105 shadow-sm'
                              : 'border border-[#E5DFCE] group-hover:scale-105 group-hover:border-[#1F4B43]'
                          }`}
                        >
                          <img
                            src={pill.iconUrl}
                            alt={pill.name}
                            className="w-full h-full object-cover rounded-full bg-[#FAF6EE]"
                          />
                        </div>

                        {/* Subcategory Label */}
                        <span
                          className={`text-xs mt-2 text-center whitespace-nowrap font-bold transition-colors ${
                            isSelected
                              ? 'text-[#EF7C3C] font-black'
                              : 'text-[#556658] group-hover:text-[#16241B]'
                          }`}
                        >
                          {pill.name}
                        </span>

                        {/* Active Orange Underline Bar Indicator */}
                        {isSelected && (
                          <div className="w-10 h-0.5 bg-[#EF7C3C] rounded-full mt-1 animate-in fade-in duration-200" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Filters Summary & Count */}
              <div className="flex items-center justify-between text-xs text-[#556658]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#16241B]">
                    {selectedPetType === 'DOG'
                      ? 'Dogs Essentials'
                      : selectedPetType === 'CAT'
                      ? 'Cats Essentials'
                      : 'Small Pets Essentials'}
                  </span>
                  {selectedSubcategory !== 'All' && (
                    <span className="font-bold text-[#EF7C3C]">· {selectedSubcategory}</span>
                  )}
                  {selectedBrands.length > 0 && (
                    <span className="font-bold text-[#1F4B43]">
                      · {selectedBrands.join(', ')}
                    </span>
                  )}
                </div>

                <span className="font-bold">
                  {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'} found
                </span>
              </div>

              {/* Product Grid & States */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-[#EDE7D9] space-y-3">
                      <Skeleton className="w-full h-44 rounded-xl bg-[#FAF6EE]" />
                      <Skeleton className="w-20 h-4 rounded bg-[#FAF6EE]" />
                      <Skeleton className="w-3/4 h-5 rounded bg-[#FAF6EE]" />
                      <div className="pt-2 flex justify-between items-center">
                        <Skeleton className="w-20 h-6 rounded bg-[#FAF6EE]" />
                        <Skeleton className="w-24 h-8 rounded-xl bg-[#FAF6EE]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <ErrorState message={error} onRetry={fetchProducts} />
              ) : displayedProducts.length === 0 ? (
                <EmptyState
                  title="No pet essentials found"
                  description="No items match your selected filter criteria. Try adjusting the price slider or resetting brand selections."
                  actionLabel="Reset All Filters"
                  onAction={clearFilters}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {displayedProducts.map((product) => {
                    const cartItem = cartItems[product.id];
                    const isUpdating = updatingCart[product.id];
                    const isOutOfStock = (product.stockQuantity || 0) <= 0;
                    const imageUrl = getProductImageUrl(product.name, product.imageUrl, product.id);

                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-2xl border border-[#EDE7D9] shadow-2xs hover:shadow-xl hover:border-[#1F4B43]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                      >
                        {/* Top Badges & Wishlist */}
                        <div className="relative w-full h-48 bg-[#FAF6EE]/40 overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Vet Approved Badge Matching Reference */}
                          <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EBF5FF] text-[#1D4ED8] text-[10px] font-black tracking-wider uppercase border border-[#BFDBFE] shadow-2xs">
                            <Stethoscope className="w-3 h-3 text-[#2563EB]" />
                            <span>Vet Approved</span>
                          </span>

                          {/* Wishlist Heart Toggle */}
                          <div className="absolute top-3 right-3">
                            <HeartToggle
                              itemType="PRODUCT"
                              itemId={product.id}
                              isInitiallySaved={isSaved('PRODUCT', product.id)}
                            />
                          </div>

                          {/* Pickup Ready Tag */}
                          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[10px] font-bold text-[#1F4B43] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#EDE7D9]">
                            <Store className="w-3 h-3 text-[#E3A23A]" />
                            <span>Pickup Ready</span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            {/* Brand & Rating */}
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#556658] mb-1">
                              <span className="text-[#1F4B43] uppercase tracking-wider font-black">
                                {product.brand || product.category}
                              </span>
                              <div className="flex items-center gap-1 text-[#16241B]">
                                <Star className="w-3.5 h-3.5 fill-[#E3A23A] text-[#E3A23A]" />
                                <span className="font-black text-xs">
                                  {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                                </span>
                                <span className="text-[#88998C] text-[10px]">
                                  ({product.reviewsCount || 18})
                                </span>
                              </div>
                            </div>

                            {/* Title */}
                            <h4 className="text-xs sm:text-sm font-bold text-[#16241B] line-clamp-2 leading-snug group-hover:text-[#1F4B43] transition-colors">
                              {product.name}
                            </h4>

                            {/* Subcategory */}
                            {product.subcategory && (
                              <p className="text-[11px] text-[#88998C] mt-1 font-medium">
                                {product.subcategory}
                              </p>
                            )}
                          </div>

                          {/* Bottom Pricing & In-Store Cart Button */}
                          <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                            <div>
                              <span className="text-base sm:text-lg font-black text-[#1F4B43]">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="block text-[10px] font-semibold text-[#88998C]">
                                In-Store Pickup
                              </span>
                            </div>

                            {/* Cart Add / Quantity */}
                            {isOutOfStock ? (
                              <button
                                disabled
                                className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed border border-gray-200"
                              >
                                Out of Stock
                              </button>
                            ) : cartItem ? (
                              <div className="flex items-center bg-[#1F4B43] text-white rounded-xl p-0.5 shadow-sm">
                                <button
                                  onClick={() => handleDecreaseQuantity(product, cartItem)}
                                  disabled={isUpdating}
                                  aria-label="Decrease quantity"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-[#163832] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center font-black text-xs">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncreaseQuantity(product, cartItem)}
                                  disabled={isUpdating || cartItem.quantity >= product.stockQuantity}
                                  aria-label="Increase quantity"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-[#163832] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                                disabled={isUpdating}
                                className="h-9 px-3.5 rounded-xl text-xs font-bold bg-[#1F4B43] hover:bg-[#163832] text-white border-none flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 text-[#E3A23A]" />
                                <span>Add to Cart</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Sticky Cart Bar */}
      <StickyCartBar />

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};
