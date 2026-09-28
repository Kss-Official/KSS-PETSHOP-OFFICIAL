import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, PhoneCall, Headphones, ArrowUpRight } from 'lucide-react';
import { SUPPORT_CONFIG, type QuickReplyChip } from './support.config';

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  floatingButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

// Inline SVG for the official WhatsApp glyph
const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-1.782-.406-1.39-.575-2.28-1.993-2.35-2.086-.069-.094-.555-.738-.555-1.407 0-.669.351-.998.476-1.134.125-.136.273-.17.365-.17.091 0 .182.001.261.005.083.004.195-.032.304.232.115.279.39 1.002.425 1.076.035.074.058.16.012.256-.045.096-.069.155-.138.236-.069.08-.145.18-.208.241-.069.068-.141.142-.06.282.08.139.356.586.763.95.525.467.969.611 1.108.68.139.069.22.058.303-.035.083-.093.356-.414.45-.556.095-.142.19-.119.32-.07.13.048.835.394.978.465.143.071.238.106.273.165.035.059.035.342-.109.747z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.884.523 3.652 1.433 5.167L2.05 21.95l4.908-1.34A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.163 8.163 0 01-4.328-1.233l-.31-.192-2.906.795.776-2.836-.208-.332A8.175 8.175 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2 4.522 0 8.2 3.678 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z"
    />
  </svg>
);

export const SupportPanel: React.FC<SupportPanelProps> = ({
  isOpen,
  onClose,
  floatingButtonRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
        floatingButtonRef?.current?.focus();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, floatingButtonRef]);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const openWhatsAppWithMessage = (message: string) => {
    const url = `https://wa.me/${SUPPORT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
    floatingButtonRef?.current?.focus();
  };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Pawfectly Support Chat"
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.9, y: 16 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.9, y: 16 }
      }
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'bottom right' }}
      className="w-[calc(100vw-2rem)] max-w-[340px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(22,36,27,0.18),0_4px_16px_rgba(22,36,27,0.06)] border border-[#EDE7D9] overflow-hidden flex flex-col z-50 text-[#16241B] font-sans"
    >
      {/* 1. Header: Website Theme Forest Green */}
      <div className="bg-[#16241B] p-4 text-white relative border-b border-[#243529]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE]/15 border border-[#FAF6EE]/20 flex items-center justify-center text-[#EF7C3C] shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>

            {/* Title & Status */}
            <div>
              <h3 className="font-black text-sm tracking-tight leading-tight text-[#FAF6EE]">
                Pawfectly Support
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>
                <span className="text-[11px] text-[#A5B8AA] font-semibold">
                  {SUPPORT_CONFIG.SUPPORT_HOURS}
                </span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close support chat"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Body Content: Warm Cream Theme */}
      <div className="p-4 sm:p-5 space-y-4 bg-[#FAF6EE]/60 max-h-[60vh] overflow-y-auto">
        {/* Friendly greeting bubble */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#EDE7D9] shadow-xs max-w-[95%]">
          <p className="text-xs sm:text-[13px] text-[#445548] leading-relaxed font-medium">
            Hi there! How can we help you and your furry friend today?
          </p>
        </div>

        {/* Quick Reply Chips */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#6C7D70]">
            QUICK TOPICS
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORT_CONFIG.QUICK_REPLIES.map((chip: QuickReplyChip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => openWhatsAppWithMessage(chip.message)}
                className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] ${
                  chip.isEmergency
                    ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2]'
                    : 'bg-white border-[#EDE7D9] text-[#16241B] hover:border-[#EF7C3C] hover:text-[#EF7C3C]'
                }`}
              >
                <span>{chip.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
              </button>
            ))}
          </div>

          {/* Emergency call direct line link */}
          <div className="pt-2">
            <a
              href={`tel:${SUPPORT_CONFIG.EMERGENCY_NUMBER}`}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-xs font-bold text-[#BE123C] hover:bg-[#FEE2E2] transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span>
                Urgent emergency?{' '}
                <span className="underline font-black">Call Helpline</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Footer: Main WhatsApp Action & Email */}
      <div className="p-4 bg-white border-t border-[#EDE7D9] space-y-2.5">
        <button
          type="button"
          onClick={() => openWhatsAppWithMessage(SUPPORT_CONFIG.DEFAULT_MESSAGE)}
          className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        >
          <WhatsAppGlyph className="w-5 h-5 text-white" />
          <span>Continue on WhatsApp</span>
        </button>

        <div className="text-center">
          <a
            href={`mailto:${SUPPORT_CONFIG.SUPPORT_EMAIL}?subject=Support%20Request`}
            className="text-[11px] text-[#6C7D70] hover:text-[#16241B] font-semibold underline transition-colors"
          >
            Or send us an email
          </a>
        </div>
      </div>
    </motion.div>
  );
};
