import type { Variants, Transition } from 'framer-motion';

/**
 * ============================================================================
 * PAWFECTLY GLOBAL MOTION SYSTEM & DESIGN TOKENS
 * ============================================================================
 * 
 * HOW TO CHANGE ANIMATION SPEEDS GLOBALLY:
 * - Adjust DURATIONS below:
 *     - fast: micro-interactions, buttons, icons (default 0.25s)
 *     - base: card reveals, modals, page elements (default 0.5s)
 *     - slow: hero entrances, complex staggered groups (default 0.8s)
 * - Adjust EASE cubic-bezier curve for snappier or softer easing across all variants.
 * ============================================================================
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATIONS = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
} as const;

export const defaultTransition: Transition = {
  duration: DURATIONS.base,
  ease: EASE,
};

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
} as const;

export const softSpringTransition = {
  type: 'spring',
  stiffness: 180,
  damping: 20,
} as const;

export const springs = {
  snappy: springTransition,
  soft: softSpringTransition,
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  },
  gentle: {
    type: 'spring',
    stiffness: 120,
    damping: 14,
  },
} as const;

/**
 * Standard Fade-Up reveal variant
 */
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.base,
      ease: EASE,
      delay,
    },
  }),
};

// Aliases for compatibility
export const fadeUp = fadeUpVariant;

/**
 * Fade In (opacity only, ideal for reduced motion fallback)
 */
export const fadeInVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: DURATIONS.base,
      ease: EASE,
      delay,
    },
  }),
};

export const fadeIn = fadeInVariant;

/**
 * Stagger Container variant for wrapping lists and card grids
 */
export const staggerContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export interface StaggerContainerFn {
  (staggerDelay?: number, delayChildren?: number): Variants;
  hidden: Record<string, unknown>;
  visible: Record<string, unknown>;
}

const createStaggerContainer = ((
  staggerDelay: number = 0.1,
  delayChildren: number = 0.05
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
})) as StaggerContainerFn;

createStaggerContainer.hidden = {};
createStaggerContainer.visible = {
  transition: {
    staggerChildren: 0.1,
    delayChildren: 0.05,
  },
};

export const staggerContainer = createStaggerContainer;

/**
 * Card Hover & Tap transition settings
 */
export const cardHoverVariant: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 2px 8px -1px rgba(22, 36, 27, 0.05), 0 1px 3px 0 rgba(22, 36, 27, 0.04)',
    transition: springTransition,
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 35px -8px rgba(22, 36, 27, 0.12), 0 8px 16px -4px rgba(22, 36, 27, 0.06)',
    transition: springTransition,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};
