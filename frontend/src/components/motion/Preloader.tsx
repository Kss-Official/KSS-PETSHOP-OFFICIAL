import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const Preloader: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const hasShown = sessionStorage.getItem('pawfectly_preloader_seen');
      return !hasShown;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!shouldShow || prefersReduced) {
      if (shouldShow && prefersReduced) {
        try {
          sessionStorage.setItem('pawfectly_preloader_seen', 'true');
        } catch {
          // ignore
        }
        setShouldShow(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem('pawfectly_preloader_seen', 'true');
      } catch {
        // ignore
      }
      setShouldShow(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, [shouldShow, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            opacity: 0.95,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#FAF6EE] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            {/* Pulsing Paw with soft halo */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
                className="absolute w-16 h-16 rounded-full bg-[#EF7C3C]/20 blur-md"
              />
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, -8, 8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
                className="w-12 h-12 rounded-full bg-[#EF7C3C] text-white flex items-center justify-center shadow-lg relative z-10"
              >
                <PawPrint className="w-6 h-6 fill-current" />
              </motion.div>
            </div>

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-2xl sm:text-3xl font-black tracking-tight text-[#16241B] font-sans"
            >
              Pawfectly<span className="text-[#EF7C3C]">.</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
