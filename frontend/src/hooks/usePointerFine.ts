import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is using a precise pointer device (e.g. mouse, trackpad)
 * and supports hover. Returns false for touch-only devices (smartphones, tablets).
 */
export function usePointerFine(): boolean {
  const [isPointerFine, setIsPointerFine] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };

    setIsPointerFine(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isPointerFine;
}
