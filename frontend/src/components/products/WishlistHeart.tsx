import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import apiClient from '../../lib/axios';

export type WishlistItemType = 'PRODUCT' | 'SERVICE' | 'VET';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  isPaw: boolean;
}

interface WishlistHeartProps {
  itemType: WishlistItemType;
  itemId: number;
  isInitiallySaved?: boolean;
  className?: string;
  iconClassName?: string;
  onToggle?: (saved: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

// Paw Print SVG Icon for particle burst
const PawIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#EF7C3C]"
  >
    <path d="M12 10.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm5.5 2c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zM6.5 12.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5S4 8.62 4 10s1.12 2.5 2.5 2.5zm5.5 1.5c-3.07 0-7 2.1-7 5.5 0 1.93 1.57 3.5 3.5 3.5 1.5 0 2.82-.94 3.5-2.3.68 1.36 2 2.3 3.5 2.3 1.93 0 3.5-1.57 3.5-3.5 0-3.4-3.93-5.5-7-5.5z" />
  </svg>
);

export const WishlistHeart: React.FC<WishlistHeartProps> = ({
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
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const triggerBurst = () => {
    const newParticles: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      angle: (i * 45 + Math.random() * 20 - 10) * (Math.PI / 180),
      distance: 24 + Math.random() * 16,
      size: 9 + Math.random() * 5,
      isPaw: i % 2 === 0,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  };

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

    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (nextSaved) {
      triggerBurst();
    }
    if (onToggle) onToggle(nextSaved);
    setLoading(true);

    try {
      const res = await apiClient.post<{ saved: boolean; message: string }>('/customer/wishlist/toggle', {
        itemType,
        itemId,
      });

      const actualSaved = res.data.saved;
      setIsSaved(actualSaved);
      window.dispatchEvent(
        new CustomEvent('wishlist-ids-updated', { detail: { itemType, itemId, saved: actualSaved } })
      );
      if (showToast) {
        showToast(res.data.message || (actualSaved ? 'Item saved to wishlist' : 'Item removed from wishlist'));
      }
    } catch {
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
    <div className="relative inline-flex items-center justify-center">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={loading}
        whileTap={{ scale: 0.85 }}
        animate={
          isSaved
            ? {
                scale: [1, 1.32, 0.92, 1.08, 1],
                transition: { duration: 0.45, ease: 'easeOut' },
              }
            : { scale: 1 }
        }
        aria-label={isSaved ? 'Remove from saved items' : 'Save to wishlist'}
        className={`relative z-10 w-7.5 h-7.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-xs border border-[#EDE7D9] shadow-2xs hover:bg-white hover:shadow-xs transition-all duration-200 cursor-pointer ${
          isSaved ? 'text-[#EC4899]' : 'text-[#88998C] hover:text-[#EC4899]'
        } ${className}`}
      >
        <Heart
          className={`${iconClassName} transition-all duration-300 ${
            isSaved
              ? 'fill-[#EC4899] text-[#EC4899] drop-shadow-[0_2px_6px_rgba(236,72,153,0.45)]'
              : 'text-[#16241B]/60 hover:text-[#EC4899]'
          }`}
        />
      </motion.button>

      {/* Particle Burst Elements */}
      <AnimatePresence>
        {particles.map((p) => {
          const targetX = Math.cos(p.angle) * p.distance;
          const targetY = Math.sin(p.angle) * p.distance;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: [0.4, 1.1, 0.7],
                x: targetX,
                y: targetY,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute pointer-events-none z-20"
            >
              {p.isPaw ? (
                <PawIcon size={p.size} />
              ) : (
                <Heart size={p.size} className="text-[#EC4899] fill-[#EC4899]" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WishlistHeart;
