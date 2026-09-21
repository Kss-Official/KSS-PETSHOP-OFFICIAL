import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotation: number;
  color: string;
  size: number;
  isPaw: boolean;
}

interface ConfettiProps {
  particles: ConfettiParticle[];
}

export const PawParticleIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 10.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm5.5 2c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zM6.5 12.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5S4 8.62 4 10s1.12 2.5 2.5 2.5zm5.5 1.5c-3.07 0-7 2.1-7 5.5 0 1.93 1.57 3.5 3.5 3.5 1.5 0 2.82-.94 3.5-2.3.68 1.36 2 2.3 3.5 2.3 1.93 0 3.5-1.57 3.5-3.5 0-3.4-3.93-5.5-7-5.5z" />
  </svg>
);

export const Confetti: React.FC<ConfettiProps> = ({ particles }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              scale: 0.2,
              x: p.x,
              y: p.y,
              rotate: 0,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.3, 1.2, 0.8],
              x: p.targetX,
              y: p.targetY,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute"
          >
            {p.isPaw ? (
              <PawParticleIcon size={p.size} color={p.color} />
            ) : (
              <div
                style={{
                  width: p.size,
                  height: p.size * 0.6,
                  backgroundColor: p.color,
                  borderRadius: 2,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;
