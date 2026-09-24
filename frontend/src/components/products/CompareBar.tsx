import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../../hooks/useCompare';
import { getProductImageUrl } from '../../lib/utils';
import { springs } from '../../lib/motion';

export const CompareBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, openCompareSheet } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={springs.soft}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] glass-surface rounded-2xl p-3 shadow-2xl border border-white/60 flex items-center justify-between gap-3"
      >
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="w-8 h-8 rounded-full bg-[#009E66]/15 text-[#009E66] flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence mode="popLayout">
              {compareList.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={springs.snappy}
                  className="relative w-11 h-11 rounded-xl bg-white p-1 border border-[#16241B]/10 shadow-xs shrink-0 group flex items-center justify-center"
                >
                  <img
                    src={getProductImageUrl(product.name, product.imageUrl, product.id)}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                    aria-label="Remove from comparison"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Compare Action & Clear */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
            title="Clear comparison"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={openCompareSheet}
            disabled={compareList.length < 2}
            className="py-2.5 px-4 rounded-xl bg-[#009E66] hover:bg-[#008757] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Compare ({compareList.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareBar;
