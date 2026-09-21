import { useState, useEffect } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Hook to detect and observe prefers-reduced-motion media query
 */
export function useReducedMotion(): boolean {
  const framerReducedMotion = useFramerReducedMotion();
  const [prefersReduced, setPrefersReduced] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return framerReducedMotion ?? prefersReduced;
}
