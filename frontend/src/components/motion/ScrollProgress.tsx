import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const prefersReduced = usePrefersReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: prefersReduced ? 1000 : 200,
    damping: prefersReduced ? 50 : 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F47B3A] via-[#FFC629] to-[#059669] origin-left z-[100] pointer-events-none shadow-[0_1px_8px_rgba(244,123,58,0.35)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};
