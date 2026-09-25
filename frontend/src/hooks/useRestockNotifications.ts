import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../features/auth/AuthContext';

export interface RestockSubscription {
  productId: number;
  productName: string;
  userEmail?: string;
  userId?: string | number;
  subscribedAt: string;
}

const RESTOCK_STORAGE_KEY = 'pawfectly_restock_subscriptions';
const NOTIFICATIONS_STORAGE_KEY = 'pawfectly_notifications';

export function useRestockNotifications() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<RestockSubscription[]>(() => {
    try {
      const stored = localStorage.getItem(RESTOCK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RESTOCK_STORAGE_KEY, JSON.stringify(subscriptions));
    } catch (e) {
      console.error('Failed to save restock subscriptions', e);
    }
  }, [subscriptions]);

  const isSubscribed = useCallback(
    (productId: number) => {
      const email = user?.email;
      return subscriptions.some(
        (s) =>
          s.productId === productId &&
          (!email || !s.userEmail || s.userEmail.toLowerCase() === email.toLowerCase())
      );
    },
    [subscriptions, user]
  );

  const subscribe = useCallback(
    (productId: number, productName: string, customEmail?: string) => {
      const email = customEmail || user?.email || 'guest@pawfectly.com';
      const newSub: RestockSubscription = {
        productId,
        productName,
        userEmail: email,
        userId: user?.id,
        subscribedAt: new Date().toISOString(),
      };

      setSubscriptions((prev) => {
        const filtered = prev.filter(
          (s) => !(s.productId === productId && s.userEmail?.toLowerCase() === email.toLowerCase())
        );
        const updated = [...filtered, newSub];
        try {
          localStorage.setItem(RESTOCK_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      return true;
    },
    [user]
  );

  const unsubscribe = useCallback(
    (productId: number) => {
      const email = user?.email;
      setSubscriptions((prev) => {
        const updated = prev.filter(
          (s) =>
            !(
              s.productId === productId &&
              (!email || !s.userEmail || s.userEmail.toLowerCase() === email.toLowerCase())
            )
        );
        try {
          localStorage.setItem(RESTOCK_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    [user]
  );

  // Trigger Restock: generates the inbox message for subscribers and dispatches the event
  const triggerRestock = useCallback(
    (productId: number, productName: string, newStock: number, productCategory?: string) => {
      const storedSubs: RestockSubscription[] = (() => {
        try {
          const raw = localStorage.getItem(RESTOCK_STORAGE_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })();

      const matchedSubs = storedSubs.filter((s) => s.productId === productId);
      if (matchedSubs.length === 0 && !storedSubs.some((s) => s.productId === productId)) {
        // Also create general notification for demo
      }

      // Create inbox notification
      const newNotification = {
        id: `restock-${productId}-${Date.now()}`,
        numericId: Date.now(),
        type: 'product',
        title: `Back In Stock: ${productName}`,
        message: `Great news! "${productName}" is back in stock (${newStock} available). Order now before it sells out!`,
        time: 'Just now',
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedEntityId: productId,
        actionUrl: productCategory ? `/pharmacy` : `/pet-essentials`,
      };

      try {
        const rawNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        const currentNotifs = rawNotifs ? JSON.parse(rawNotifs) : [];
        const updatedNotifs = [newNotification, ...currentNotifs];
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifs));
      } catch (e) {
        console.error('Failed to write restock notification', e);
      }

      // Remove fulfilled subscriptions
      const remainingSubs = storedSubs.filter((s) => s.productId !== productId);
      localStorage.setItem(RESTOCK_STORAGE_KEY, JSON.stringify(remainingSubs));
      setSubscriptions(remainingSubs);

      // Dispatch real-time updates for Navbar & Profile inbox
      window.dispatchEvent(new Event('notifications-updated'));
      window.dispatchEvent(
        new CustomEvent('product-restocked', {
          detail: { productId, productName, newStock },
        })
      );
    },
    []
  );

  return {
    subscriptions,
    isSubscribed,
    subscribe,
    unsubscribe,
    triggerRestock,
  };
}
