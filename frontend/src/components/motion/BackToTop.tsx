import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface BackToTopProps {
  scrollThreshold?: number;
  bottomOffsetClass?: string;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  scrollThreshold = 600,
  bottomOffsetClass = 'bottom-24 sm:bottom-28 right-6',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Back to top"
          title="Back to top"
          className={`fixed z-40 w-12 h-12 rounded-full bg-[#14261C] text-[#FAF6EF] border border-[#FAF6EF]/20 shadow-[0_8px_24px_rgba(20,38,28,0.25)] flex items-center justify-center cursor-pointer group transition-colors hover:bg-[#059669] hover:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:ring-offset-2 ${bottomOffsetClass} ${className}`}
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
