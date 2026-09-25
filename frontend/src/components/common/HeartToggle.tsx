import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import apiClient from '../../lib/axios';

export type WishlistItemType = 'PRODUCT' | 'SERVICE' | 'VET';

interface HeartToggleProps {
  itemType: WishlistItemType;
  itemId: number;
  isInitiallySaved?: boolean;
  className?: string;
  iconClassName?: string;
  onToggle?: (saved: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export const HeartToggle: React.FC<HeartToggleProps> = ({
  itemType,
  itemId,
  isInitiallySaved = false,
  className = '',
  iconClassName = 'w-3.5 h-3.5 sm:w-4 sm:h-4',
  onToggle,
  showToast,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(isInitiallySaved);
  const [loading, setLoading] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      if (showToast) {
        showToast('Please log in to save items to your wishlist.', 'error');
      }
      navigate('/login');
      return;
    }

    if (loading) return;

    // Optimistic UI update
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (onToggle) onToggle(nextSaved);
    setLoading(true);

    try {
      const res = await apiClient.post<{ saved: boolean; message: string }>('/customer/wishlist/toggle', {
        itemType,
        itemId,
      });

      const actualSaved = res.data.saved;
      setIsSaved(actualSaved);

      // Dispatch global event for sync across tabs/components
      window.dispatchEvent(
        new CustomEvent('wishlist-ids-updated', {
          detail: { itemType, itemId, saved: actualSaved },
        })
      );

      if (showToast) {
        showToast(
          res.data.message || (actualSaved ? 'Item saved to wishlist' : 'Item removed from wishlist')
        );
      }
    } catch {
      // Revert optimistic update on failure
      setIsSaved(!nextSaved);
      if (onToggle) onToggle(!nextSaved);
      if (showToast) {
        showToast('Failed to update wishlist. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={loading}
      whileTap={{ scale: 0.85 }}
      animate={
        isSaved
          ? { scale: [1, 1.35, 0.95, 1.05, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.22, ease: 'easeOut' }}
      aria-label={isSaved ? 'Remove from saved items' : 'Save to wishlist'}
      className={`w-7.5 h-7.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-xs border border-[#EDE7D9] shadow-2xs hover:bg-white hover:shadow-xs transition-all cursor-pointer ${
        isSaved ? 'text-[#EC4899]' : 'text-[#88998C] hover:text-[#EC4899]'
      } ${className}`}
    >
      <Heart
        className={`${iconClassName} transition-all duration-200 ${
          isSaved
            ? 'fill-[#EC4899] text-[#EC4899] drop-shadow-[0_2px_6px_rgba(236,72,153,0.45)]'
            : 'text-[#88998C] hover:text-[#EC4899]'
        }`}
      />
    </motion.button>
  );
};

export default HeartToggle;
