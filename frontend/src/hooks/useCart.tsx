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
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartWobbleKey] = useState(0);
  const [flyingClones] = useState<FlyingClone[]>([]);
  const [confettiParticles] = useState<ConfettiParticle[]>([]);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  // Sync to localStorage or clear if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setItems((prev) => (prev.length > 0 ? [] : prev));
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return;
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isAuthenticated]);

  // Fetch from backend when authenticated
  const fetchBackendCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems((prev) => (prev.length > 0 ? [] : prev));
      return;
    }
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

  const addToCart = async (product: ProductItemData, _e?: React.MouseEvent) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optimistic local state update
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

    // Backend synchronization
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
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    const currentItem = items.find((i) => i.productId === productId);
    const cartItemId = currentItem?.id;

    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );

    if (cartItemId) {
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
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const currentItem = items.find((i) => i.productId === productId);
    const cartItemId = currentItem?.id;

    setItems((prev) => prev.filter((i) => i.productId !== productId));

    if (cartItemId) {
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

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

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
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        openCart,
        closeCart,
        toggleCart,
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

export default CartContext;
