import { useTransform, type MotionValue } from 'framer-motion';

/**
 * Computes a parallax translateY translation based on a motion value (typically scrollYProgress)
 * and a distance (offset in pixels or percentage factor).
 */
export function useParallax(value: MotionValue<number>, distance: number): MotionValue<number> {
  return useTransform(value, [0, 1], [-distance, distance]);
}
