import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/axios';
import { useAuth } from '../features/auth/AuthContext';
import type { ProductItemData } from '../components/products/ProductCard';
import type { ConfettiParticle } from '../components/ui/Confetti';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  quantity: number;
  stockQuantity?: number;
}

export interface FlyingClone {
  id: number;
  imageUrl: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  freeShippingThreshold: number;
  cartWobbleKey: number;
  flyingClones: FlyingClone[];
  confettiParticles: ConfettiParticle[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: ProductItemData, e?: React.MouseEvent) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => void;
  isUpdating: Record<number, boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pawfectly_cart_items';
const FREE_SHIPPING_THRESHOLD = 1500;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartWobbleKey, setCartWobbleKey] = useState(0);
  const [flyingClones, setFlyingClones] = useState<FlyingClone[]>([]);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Fetch from backend when authenticated
  const fetchBackendCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get<any[]>('/customer/cart');
      if (Array.isArray(res.data)) {
        const mapped: CartItem[] = res.data.map((item) => ({
          id: item.id || item.productId,
          productId: item.productId,
          name: item.productName || item.product?.name || item.name || 'Product',
          price: item.price || item.product?.price || 0,
          imageUrl: item.imageUrl || item.product?.imageUrl || '',
          category: item.category || item.product?.category || '',
          quantity: item.quantity || 1,
          stockQuantity: item.stockQuantity || item.product?.stockQuantity || 99,
        }));
        setItems(mapped);
      }
    } catch {
      // Keep local cart
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBackendCart();
    const handleGlobalCartUpdate = () => fetchBackendCart();
    window.addEventListener('cart-updated', handleGlobalCartUpdate);
    return () => window.removeEventListener('cart-updated', handleGlobalCartUpdate);
  }, [fetchBackendCart]);

  const totalCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);

  const triggerCartWobbleAndConfetti = (targetX: number, targetY: number) => {
    setCartWobbleKey((k) => k + 1);

    // Generate ~12 confetti particles around target cart
    const brandColors = ['#009E66', '#EF7C3C', '#FFD84D', '#16241B', '#EC4899'];
    const particles: ConfettiParticle[] = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 + Math.random() * 20 - 10) * (Math.PI / 180);
      const distance = 30 + Math.random() * 35;
      return {
        id: Date.now() + i,
        x: targetX,
        y: targetY,
        targetX: targetX + Math.cos(angle) * distance,
        targetY: targetY + Math.sin(angle) * distance,
        rotation: (Math.random() - 0.5) * 360,
        color: brandColors[i % brandColors.length],
        size: 8 + Math.random() * 6,
        isPaw: i % 2 === 0,
      };
    });

    setConfettiParticles(particles);
    setTimeout(() => setConfettiParticles([]), 850);
  };

  const addToCart = async (product: ProductItemData, e?: React.MouseEvent) => {
    // 1. Calculate trajectory from click element to navbar cart icon
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    const cartTargetEl = document.getElementById('navbar-cart-button') || document.querySelector('[data-cart-button]');
    let targetX = window.innerWidth - 60;
    let targetY = 32;

    if (cartTargetEl) {
      const targetRect = cartTargetEl.getBoundingClientRect();
      targetX = targetRect.left + targetRect.width / 2;
      targetY = targetRect.top + targetRect.height / 2;
    }

    // 2. Spawn flying clone
    const cloneId = Date.now();
    const newClone: FlyingClone = {
      id: cloneId,
      imageUrl: product.imageUrl || '',
      startX,
      startY,
      targetX,
      targetY,
    };

    setFlyingClones((clones) => [...clones, newClone]);

    // 3. Optimistic local state update
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          quantity: 1,
          stockQuantity: product.stockQuantity,
        },
      ];
    });

    // 4. Clean up clone & trigger landing effect after flight duration (~650ms)
    setTimeout(() => {
      setFlyingClones((clones) => clones.filter((c) => c.id !== cloneId));
      triggerCartWobbleAndConfetti(targetX, targetY);
    }, 650);

    // 5. Backend synchronization if authenticated
    if (isAuthenticated) {
      try {
        setIsUpdating((prev) => ({ ...prev, [product.id]: true }));
        await apiClient.post('/customer/cart', {
          productId: product.id,
          quantity: 1,
        });
        window.dispatchEvent(new Event('cart-updated'));
      } catch {
        // Handled gracefully
      } finally {
        setIsUpdating((prev) => ({ ...prev, [product.id]: false }));
      }
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    const currentItem = items.find((i) => i.productId === productId);
    const cartItemId = currentItem?.id;

    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );

    if (isAuthenticated && cartItemId) {
      try {
        setIsUpdating((prev) => ({ ...prev, [productId]: true }));
        await apiClient.put(`/customer/cart/${cartItemId}?quantity=${quantity}`);
        window.dispatchEvent(new Event('cart-updated'));
      } catch {
        // Fallback
      } finally {
        setIsUpdating((prev) => ({ ...prev, [productId]: false }));
      }
    }
  };

  const removeItem = async (productId: number) => {
    const currentItem = items.find((i) => i.productId === productId);
    const cartItemId = currentItem?.id;

    setItems((prev) => prev.filter((i) => i.productId !== productId));

    if (isAuthenticated && cartItemId) {
      try {
        setIsUpdating((prev) => ({ ...prev, [productId]: true }));
        await apiClient.delete(`/customer/cart/${cartItemId}`);
        window.dispatchEvent(new Event('cart-updated'));
      } catch {
        // Fallback
      } finally {
        setIsUpdating((prev) => ({ ...prev, [productId]: false }));
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (isAuthenticated) {
      try {
        await apiClient.delete('/customer/cart');
        window.dispatchEvent(new Event('cart-updated'));
      } catch {
        // Fallback
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        isCartOpen,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        cartWobbleKey,
        flyingClones,
        confettiParticles,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((o) => !o),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isUpdating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
