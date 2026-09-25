import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import { usePointerFine } from '../../hooks/usePointerFine';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotate: number;
}

export interface CustomCursorProps {
  showTrail?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ showTrail = true }) => {
  const isPointerFine = usePointerFine();
  const prefersReduced = usePrefersReducedMotion();

  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    if (!isPointerFine || prefersReduced || !showTrail) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttled subtle paw trail (every 140ms)
      const now = Date.now();
      if (now - lastTrailTime.current > 140) {
        lastTrailTime.current = now;
        const randomAngle = Math.floor(Math.random() * 30) - 15;
        const newItem: TrailItem = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          rotate: randomAngle,
        };

        setTrail((prev) => [...prev.slice(-4), newItem]);

        setTimeout(() => {
          setTrail((prev) => prev.filter((item) => item.id !== newItem.id));
        }, 600);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPointerFine, prefersReduced, showTrail]);

  if (!isPointerFine || prefersReduced || !showTrail || trail.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {trail.map((paw) => (
        <motion.div
          key={paw.id}
          initial={{ opacity: 0.35, scale: 0.6 }}
          animate={{ opacity: 0, scale: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: paw.x,
            top: paw.y,
            transform: `translate(-50%, -50%) rotate(${paw.rotate}deg)`,
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        >
          <PawPrint className="w-3.5 h-3.5 text-[#3FA65C]/35" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
