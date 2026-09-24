import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlyingClone } from '../../hooks/useCart';
import { getProductImageUrl } from '../../lib/utils';

interface FlyToCartPortalProps {
  clones: FlyingClone[];
}

export const FlyToCartPortal: React.FC<FlyToCartPortalProps> = ({ clones }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      <AnimatePresence>
        {clones.map((clone) => {
          const midX = (clone.startX + clone.targetX) / 2;
          const midY = Math.min(clone.startY, clone.targetY) - 100; // Curve arc upwards

          return (
            <motion.div
              key={clone.id}
              initial={{
                x: clone.startX - 40,
                y: clone.startY - 40,
                scale: 1,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: [clone.startX - 40, midX - 30, clone.targetX - 20],
                y: [clone.startY - 40, midY, clone.targetY - 20],
                scale: [1, 0.75, 0.25],
                rotate: [0, -15, 25],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.55, 1],
              }}
              className="absolute w-20 h-20 rounded-2xl bg-white/95 p-1.5 shadow-2xl border border-[#009E66]/40 flex items-center justify-center overflow-hidden"
            >
              <img
                src={getProductImageUrl(clone.imageUrl)}
                alt="Flying product"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FlyToCartPortal;
