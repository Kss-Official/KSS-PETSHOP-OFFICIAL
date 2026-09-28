import { useReducedMotion } from 'framer-motion';

/**
 * Hook to detect whether the user has requested reduced motion at the OS/browser level.
 * Always safe for SSR and dynamic preference changes.
 */
export function usePrefersReducedMotion(): boolean {
  const shouldReduceMotion = useReducedMotion();
  return Boolean(shouldReduceMotion);
}
