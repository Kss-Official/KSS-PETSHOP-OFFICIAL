import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, ShoppingBag } from 'lucide-react';
import { springs } from '../../lib/motion';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  title = 'Please Sign In First',
  message = 'You need to be logged in to add items to your cart, save essentials, and complete your order.',
}) => {
  const navigate = useNavigate();

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#16241B]/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={springs.soft}
            className="relative z-10 w-full max-w-md bg-white rounded-[28px] border border-[#EDE7D9] shadow-2xl p-6 sm:p-8 text-center overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF6EE] text-[#556658] hover:text-[#16241B] hover:bg-[#EDE7D9] flex items-center justify-center transition-colors cursor-pointer border border-[#EDE7D9]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Header */}
            <div className="w-16 h-16 rounded-2xl bg-[#E6F9EC] border border-[#CBDAC6] text-[#009E66] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <ShoppingBag className="w-8 h-8 text-[#009E66]" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-black text-[#16241B] tracking-tight mb-2">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#556658] leading-relaxed mb-6">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 py-3 px-4 rounded-full text-xs font-bold text-[#556658] bg-[#FAF6EE] hover:bg-[#EDE7D9] transition-colors cursor-pointer border border-[#EDE7D9]"
              >
                Continue Browsing
              </button>

              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full sm:w-1/2 py-3 px-4 rounded-full text-xs font-bold text-white bg-[#009E66] hover:bg-[#008756] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md shadow-[#009E66]/20"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Sign In / Log In</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
