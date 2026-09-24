import type { Transition, Variants } from 'framer-motion';

/**
 * Spring physics tokens tailored for delightful pet-brand interactions
 */
export const springs = {
  soft: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
  } as Transition,
  snappy: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,
  bouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 15,
  } as Transition,
  gentle: {
    type: 'spring',
    stiffness: 180,
    damping: 20,
  } as Transition,
};

/**
 * Easing curves and duration standards
 */
export const easings = {
  easeOutExpo: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easeInOutExpo: [0.87, 0, 0.13, 1] as [number, number, number, number],
  easeOutQuart: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

export const durations = {
  microFast: 0.2,
  micro: 0.28,
  microSlow: 0.35,
  entrance: 0.5,
  macro: 0.65,
};

/**
 * Reusable animation variants with 60fps GPU acceleration (transform + opacity only)
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.microSlow,
      ease: easings.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: durations.microFast,
      ease: 'easeIn',
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: durations.microFast,
    },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    x: 28,
    transition: {
      duration: durations.microFast,
      ease: 'easeIn',
    },
  },
};

export const slideInBottom: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.soft,
  },
  exit: {
    opacity: 0,
    y: 32,
    transition: {
      duration: durations.microFast,
      ease: 'easeIn',
    },
  },
};

export const reducedMotionFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.micro },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.microFast },
  },
};

/**
 * Creates a staggered container configuration
 * @param staggerChildren Stagger interval in seconds (default 0.06s)
 * @param delayChildren Initial delay before starting children animations
 */
export const staggerContainer = (
  staggerChildren: number = 0.06,
  delayChildren: number = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
});

/**
 * Check if the user prefers reduced motion
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
