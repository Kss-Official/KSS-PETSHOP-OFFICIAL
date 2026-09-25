import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface ParallaxLayerProps {
  speed?: number;
  className?: string;
  type?: 'paw' | 'blob-green' | 'blob-yellow' | 'circle-orange' | 'paw-angled';
  size?: number;
  rotate?: number;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  speed = 0.2,
  className = '',
  type = 'paw',
  size = 48,
  rotate = 15,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const distance = 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const rotation = useTransform(scrollYProgress, [0, 1], [rotate - 10, rotate + 10]);

  if (prefersReduced) {
    return null; // Disabled completely for reduced motion as required
  }

  const renderShape = () => {
    switch (type) {
      case 'paw':
        return (
          <PawPrint
            style={{ width: size, height: size }}
            className="text-[#059669]/10"
          />
        );
      case 'paw-angled':
        return (
          <PawPrint
            style={{ width: size, height: size }}
            className="text-[#F47B3A]/10"
          />
        );
      case 'blob-green':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#059669]/8 blur-xl"
          />
        );
      case 'blob-yellow':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#FFC629]/15 blur-2xl"
          />
        );
      case 'circle-orange':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full border-2 border-[#F47B3A]/15 bg-[#F47B3A]/5"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute pointer-events-none select-none z-0 ${className}`}
    >
      <motion.div
        style={{
          y,
          rotate: rotation,
        }}
        className="flex items-center justify-center"
      >
        {renderShape()}
      </motion.div>
    </div>
  );
};
