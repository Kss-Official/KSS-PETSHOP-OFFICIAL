import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { SupportPanel } from './SupportPanel';
import { SUPPORT_CONFIG } from './support.config';

interface FloatingSupportProps {
  bottomOffsetClass?: string; // e.g. 'bottom-6' or 'bottom-24' for mobile emergency offset
}

export const FloatingSupport: React.FC<FloatingSupportProps> = ({
  bottomOffsetClass = 'bottom-6',
}) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const [isVisible, setIsVisible] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [hasMountedPanel, setHasMountedPanel] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if current route should hide the support widget
  const isHiddenRoute = SUPPORT_CONFIG.HIDDEN_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  // 1. Entrance animation 2s after page load
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(entranceTimer);
  }, []);

  // 2. Hide floating support button when scrolled to the footer
  useEffect(() => {
    const handleScroll = () => {
      const footerEl = document.getElementById('site-footer');
      if (!footerEl) {
        setIsOverFooter(false);
        return;
      }
      const rect = footerEl.getBoundingClientRect();
      const isNearFooter = rect.top < window.innerHeight - 20;
      setIsOverFooter(isNearFooter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  // Handle outside click to close panel
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      setHasMountedPanel(true);
      setHasOpenedOnce(true);
    }
  };

  const handleClosePanel = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  if (isHiddenRoute) {
    return null;
  }

  const shouldShowButton = (isVisible && !isOverFooter) || isOpen;

  return (
    <div
      ref={containerRef}
      className={`fixed right-6 ${bottomOffsetClass} z-40 flex flex-col items-end pointer-events-none select-none`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* 1. Support Chat Panel */}
      <div className="pointer-events-auto mb-3">
        <AnimatePresence>
          {isOpen && hasMountedPanel && (
            <SupportPanel
              isOpen={isOpen}
              onClose={handleClosePanel}
              floatingButtonRef={buttonRef}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 2. Floating Action Button & Tooltips */}
      <AnimatePresence>
        {shouldShowButton && (
          <div className="relative flex items-center gap-3">
            {/* Hover Tooltip Pill (Desktop) */}
            <AnimatePresence>
              {isHovered && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="hidden sm:block bg-[#14261C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap pointer-events-none"
                >
                  Chat with us
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Round 56px Button */}
            <div className="relative">
              {/* Soft Pulse Ring (expands every 4s until opened) */}
              {!hasOpenedOnce && !prefersReducedMotion && !isOpen && (
                <span className="absolute inset-0 rounded-full bg-[#059669] animate-ping opacity-25 pointer-events-none" />
              )}

              <motion.button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                aria-label="Open support chat"
                aria-expanded={isOpen}
                aria-controls="support-chat-panel"
                className="pointer-events-auto relative w-14 h-14 rounded-full bg-[#059669] hover:bg-[#047857] text-white shadow-[0_8px_24px_rgba(5,150,105,0.35)] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#A7F3D0]"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <MessageCircle className="w-6 h-6 text-white" />
                )}

                {/* Green Corner Online Dot */}
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
