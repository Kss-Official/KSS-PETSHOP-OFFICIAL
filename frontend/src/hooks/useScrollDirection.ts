import { useState, useEffect } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: ScrollDirection;
}

/**
 * Hook to track scroll direction (up or down) with a minimum delta threshold
 * to prevent flickering on small micro-scrolls.
 */
export function useScrollDirection({
  threshold = 8,
  initialDirection = null,
}: UseScrollDirectionOptions = {}): ScrollDirection {
  const [scrollDir, setScrollDir] = useState<ScrollDirection>(initialDirection);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      // Always show navbar if near the top
      if (scrollY <= 40) {
        setScrollDir('up');
      } else {
        setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollDir;
}
