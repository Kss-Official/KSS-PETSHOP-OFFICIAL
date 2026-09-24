import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Crown, ShoppingBag, Sparkles } from 'lucide-react';
import { useCompare } from '../../hooks/useCompare';
import { useCart } from '../../hooks/useCart';
import { formatCurrency, getProductImageUrl } from '../../lib/utils';
import { springs } from '../../lib/motion';

export const CompareSheet: React.FC = () => {
  const { compareList, isCompareSheetOpen, closeCompareSheet, removeFromCompare } = useCompare();
  const { addToCart } = useCart();

  if (!isCompareSheetOpen || compareList.length === 0) return null;

  // Best Value Calculations
  const minPrice = Math.min(...compareList.map((p) => p.price));
  const maxRating = Math.max(...compareList.map((p) => p.rating || 4.5));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9996] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCompareSheet}
          className="fixed inset-0 bg-[#16241B]/60 backdrop-blur-md cursor-pointer"
        />

        {/* Sheet Content */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={springs.soft}
          className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-white rounded-[28px] shadow-2xl border border-[#16241B]/10 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#16241B]/8 flex items-center justify-between bg-[#FAF6EE]/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#009E66]/15 text-[#009E66] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#16241B]">
                  Product Comparison
                </h3>
                <p className="text-xs text-[#16241B]/60">
                  Comparing {compareList.length} items side-by-side
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCompareSheet}
              aria-label="Close comparison"
              className="w-9 h-9 rounded-full bg-white text-[#16241B] flex items-center justify-center hover:bg-[#16241B]/5 transition-colors cursor-pointer shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table / Grid Container */}
          <div className="flex-1 overflow-x-auto overflow-y-auto p-6 no-scrollbar">
            <div className="grid grid-flow-col auto-cols-[240px] sm:auto-cols-[280px] gap-4 sm:gap-6 min-w-full">
              {compareList.map((product, idx) => {
                const isLowestPrice = product.price === minPrice && compareList.length > 1;
                const isHighestRating = (product.rating || 4.5) === maxRating && compareList.length > 1;
                const rating = product.rating || 4.8;
                const isOutOfStock = product.stockQuantity <= 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, ...springs.soft }}
                    className="flex flex-col bg-[#FAF6EE]/60 rounded-2xl p-4 border border-[#16241B]/8 relative group"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Image */}
                    <div className="w-full aspect-square rounded-xl bg-white p-3 mb-3 border border-[#16241B]/6 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={getProductImageUrl(product.name, product.imageUrl, product.id)}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />

                      {isLowestPrice && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#009E66] text-white text-[10px] font-black flex items-center gap-1 shadow-sm">
                          <Crown className="w-3 h-3 text-[#FFD84D]" /> Best Price
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-sm text-[#16241B] line-clamp-2 mb-2 min-h-[40px]">
                      {product.name}
                    </h4>

                    {/* Price Row with Glow if best */}
                    <div
                      className={`p-3 rounded-xl mb-3 flex items-center justify-between ${
                        isLowestPrice
                          ? 'bg-[#009E66]/12 border border-[#009E66]/30 shadow-[0_0_16px_rgba(0,158,102,0.15)]'
                          : 'bg-white border border-[#16241B]/6'
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#16241B]/60">Price</span>
                      <span className="text-base font-black text-[#16241B]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    {/* Rating Metric with animated fill bar */}
                    <div
                      className={`p-3 rounded-xl mb-3 ${
                        isHighestRating
                          ? 'bg-amber-50/80 border border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.18)]'
                          : 'bg-white border border-[#16241B]/6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#16241B]/70 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#FFD84D] text-[#FFD84D]" />
                          Rating
                        </span>
                        <span className="font-bold text-[#16241B]">{rating.toFixed(1)}/5.0</span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[#16241B]/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(rating / 5) * 100}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-[#FFD84D] rounded-full"
                        />
                      </div>
                    </div>

                    {/* Category & Status */}
                    <div className="p-3 bg-white rounded-xl border border-[#16241B]/6 mb-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#16241B]/50">Category</span>
                        <span className="font-bold text-[#16241B]">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#16241B]/50">Availability</span>
                        <span
                          className={`font-bold ${
                            isOutOfStock ? 'text-red-500' : 'text-[#009E66]'
                          }`}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#16241B]/50">Type</span>
                        <span className="font-semibold text-[#16241B]">
                          {product.prescriptionRequired ? 'Prescription' : 'OTC'}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="mt-auto pt-2">
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={(e) => addToCart(product, e)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#16241B] hover:bg-[#009E66] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompareSheet;
