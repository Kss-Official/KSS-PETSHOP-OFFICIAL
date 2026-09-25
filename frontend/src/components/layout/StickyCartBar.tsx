import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { apiClient } from '../../lib/axios';

interface CartItemData {
  id: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export const StickyCartBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const fetchCartData = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      const res = await apiClient.get<CartItemData[]>('/customer/cart');
      setCartItems(res.data || []);
    } catch {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartData();
    };
    const handleBounce = () => {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 500);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('cart-bounce', handleBounce);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('cart-bounce', handleBounce);
    };
  }, [fetchCartData]);

  // IntersectionObserver to prevent footer overlap
  useEffect(() => {
    const footerEl = document.getElementById('site-footer') || document.querySelector('footer');
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  // Hide if on profile page
  const isProfilePage = location.pathname.includes('/profile');

  const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  if (!isAuthenticated || totalCount === 0 || isProfilePage) {
    return null;
  }

  return (
    <motion.button
      id="sticky-cart-btn"
      type="button"
      onClick={() => navigate('/profile?tab=cart')}
      animate={
        isBouncing
          ? { scale: [1, 1.28, 0.92, 1.1, 1], rotate: [0, -6, 6, -3, 0] }
          : { scale: 1, rotate: 0 }
      }
      transition={{ duration: 0.45, ease: 'easeOut' }}
      aria-label={`View Cart (${totalCount} ${totalCount === 1 ? 'item' : 'items'})`}
      title={`View Cart (${totalCount} ${totalCount === 1 ? 'item' : 'items'})`}
      className={`fixed bottom-5 right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#16241B] border border-[#2B4032] shadow-xl hover:shadow-2xl hover:bg-[#1C2E23] flex items-center justify-center cursor-pointer transition-colors duration-200 group ${
        isFooterVisible ? 'opacity-0 pointer-events-none translate-y-6 scale-90' : 'opacity-100 pointer-events-auto translate-y-0'
      }`}
    >
      {/* Green Cart Icon */}
      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#009E66] transition-transform duration-200 group-hover:scale-110" />

      {/* Top-Right Badge */}
      <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-[#009E66] text-white font-extrabold text-[11px] sm:text-xs flex items-center justify-center shadow-md ring-2 ring-[#16241B]">
        {totalCount}
      </span>
    </motion.button>
  );
};

export default StickyCartBar;

