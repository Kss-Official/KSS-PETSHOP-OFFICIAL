import React, { useState, useEffect } from 'react';
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
  iconClassName = 'w-5 h-5',
  onToggle,
  showToast,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(isInitiallySaved);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      if (showToast) {
        showToast('Please log in to save items to your wishlist.', 'error');
      } else {
        alert('Please log in to save items to your wishlist.');
      }
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
      window.dispatchEvent(new CustomEvent('wishlist-ids-updated', { detail: { itemType, itemId, saved: actualSaved } }));

      if (showToast) {
        showToast(res.data.message || (actualSaved ? 'Item saved to wishlist' : 'Item removed from wishlist'));
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
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={isSaved ? 'Remove from saved items' : 'Save to wishlist'}
      className={`p-2 rounded-full transition-transform active:scale-90 cursor-pointer ${className}`}
    >
      <Heart
        className={`${iconClassName} transition-colors ${
          isSaved
            ? 'fill-[#EC4899] text-[#EC4899]'
            : 'text-gray-400 hover:text-[#EC4899]'
        }`}
      />
    </button>
  );
};

export default HeartToggle;
