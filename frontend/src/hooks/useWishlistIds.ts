import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import apiClient from '../lib/axios';
import type { WishlistItemType } from '../components/common/HeartToggle';

export interface WishlistIdItem {
  itemType: WishlistItemType;
  itemId: number;
}

export function useWishlistIds() {
  const [wishlistIds, setWishlistIds] = useState<WishlistIdItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchWishlistIds = useCallback(async () => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get<WishlistIdItem[]>('/customer/wishlist/ids');
      setWishlistIds(res.data || []);
    } catch {
      setWishlistIds([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlistIds();
  }, [fetchWishlistIds]);

  useEffect(() => {
    const handleUpdated = (e: Event) => {
      const customEvt = e as CustomEvent<{ itemType: WishlistItemType; itemId: number; saved: boolean }>;
      if (customEvt.detail) {
        const { itemType, itemId, saved } = customEvt.detail;
        setWishlistIds((prev) => {
          if (saved) {
            if (prev.some((i) => i.itemType === itemType && i.itemId === itemId)) return prev;
            return [...prev, { itemType, itemId }];
          } else {
            return prev.filter((i) => !(i.itemType === itemType && i.itemId === itemId));
          }
        });
      } else {
        fetchWishlistIds();
      }
    };

    window.addEventListener('wishlist-ids-updated', handleUpdated);
    window.addEventListener('wishlist-updated', fetchWishlistIds);
    return () => {
      window.removeEventListener('wishlist-ids-updated', handleUpdated);
      window.removeEventListener('wishlist-updated', fetchWishlistIds);
    };
  }, [fetchWishlistIds]);

  const isSaved = useCallback(
    (itemType: WishlistItemType, itemId: number): boolean => {
      return wishlistIds.some((i) => i.itemType === itemType && i.itemId === itemId);
    },
    [wishlistIds]
  );

  return { wishlistIds, isSaved, loading, refetch: fetchWishlistIds };
}
