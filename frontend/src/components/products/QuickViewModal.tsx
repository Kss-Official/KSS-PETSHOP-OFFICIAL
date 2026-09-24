import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Check, ShieldCheck, Sparkles, Plus, Minus, Trash2 } from 'lucide-react';
import type { ProductItemData } from './ProductCard';
import { WishlistHeart } from './WishlistHeart';
import { formatCurrency, getProductImageUrl } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import { springs } from '../../lib/motion';

interface QuickViewModalProps {
  product: ProductItemData | null;
  onClose: () => void;
  isSaved?: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  isSaved = false,
}) => {
  const { addToCart, updateQuantity, removeItem, items } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Gallery Images Array
  const galleryImages = product
    ? [
        getProductImageUrl(product.name, product.imageUrl, product.id),
        product.secondaryImageUrl || getProductImageUrl(product.name, product.imageUrl, product.id),
      ]
    : [];

  // Reset states when product opens
  useEffect(() => {
    setSelectedImageIndex(0);
    setIsAdded(false);
  }, [product]);

  // Keyboard navigation & scroll lock
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const rating = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || 24;
  const isOutOfStock = product.stockQuantity <= 0;
  const inCartItem = items.find((i) => i.productId === product.id);

  const handleAdd = async (e: React.MouseEvent) => {
    if (isOutOfStock) return;
    setIsAdded(true);
    await addToCart(product, e);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-6 md:p-8">
        {/* Progressive Backdrop Blur & Dim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#16241B]/60 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={springs.soft}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.4 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120) {
              onClose();
            }
          }}
          className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-[28px] shadow-[0_24px_60px_-15px_rgba(22,36,27,0.25)] border border-[#16241B]/10 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#16241B] flex items-center justify-center hover:bg-[#FAF6EE] shadow-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery with Shared layoutId */}
          <div className="w-full md:w-1/2 bg-[#FAF6EE] p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#16241B]/8 relative">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#16241B]/70 shadow-xs">
                {product.category}
              </span>
              <WishlistHeart
                itemType="PRODUCT"
                itemId={product.id}
                isInitiallySaved={isSaved}
                className="shadow-xs"
              />
            </div>

            {/* Main Expanded Image */}
            <div className="relative w-full aspect-square flex items-center justify-center p-4">
              <motion.img
                key={selectedImageIndex}
                layoutId={selectedImageIndex === 0 ? `product-image-${product.id}` : undefined}
                src={galleryImages[selectedImageIndex]}
                alt={product.name}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain filter drop-shadow-md select-none"
              />
            </div>

            {/* Thumbnail Carousel / Underline Switcher */}
            <div className="flex items-center gap-3 mt-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl p-1 bg-white border cursor-pointer transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#009E66] shadow-sm'
                      : 'border-[#16241B]/10 hover:border-[#16241B]/30'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  {selectedImageIndex === idx && (
                    <motion.div
                      layoutId="active-thumb-indicator"
                      className="absolute -bottom-1 inset-x-2 h-0.5 bg-[#009E66] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Staggered Product Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.15 },
                },
              }}
              className="space-y-4"
            >
              {/* Rating */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2"
              >
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.round(rating)
                          ? 'fill-[#FFD84D] text-[#FFD84D]'
                          : 'text-gray-200 fill-gray-100'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-xs text-[#16241B]">{rating.toFixed(1)}</span>
                <span className="text-xs text-[#16241B]/50">({reviewsCount} customer reviews)</span>
              </motion.div>

              {/* Title & Price */}
              <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <h2 className="text-xl md:text-2xl font-black text-[#16241B] leading-tight mb-2">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#009E66]">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#16241B]/40 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Badges / Requirements */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-wrap gap-2"
              >
                {product.prescriptionRequired ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EF7C3C]/12 text-[#D9692A] border border-[#EF7C3C]/20 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Prescription Verified Required
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#009E66]/12 text-[#009E66] border border-[#009E66]/20 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Over The Counter (OTC)
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF6EE] text-[#16241B]/70 border border-[#16241B]/8">
                  {isOutOfStock ? 'Out of Stock' : 'Ready for In-Store Pickup'}
                </span>
              </motion.div>

              {/* Description */}
              <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <h4 className="text-xs font-bold text-[#16241B]/50 uppercase tracking-wider mb-1">
                  Description & Benefits
                </h4>
                <p className="text-xs sm:text-sm text-[#16241B]/75 leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            </motion.div>

            {/* Sticky Action Footer */}
            <div className="pt-6 mt-6 border-t border-[#16241B]/8 flex items-center gap-3">
              {inCartItem && inCartItem.quantity > 0 ? (
                <div className="flex-1 flex items-center justify-between p-2 rounded-2xl bg-[#009E66] text-white shadow-lg shadow-[#009E66]/20">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => {
                      if (inCartItem.quantity <= 1) {
                        removeItem(product.id);
                      } else {
                        updateQuantity(product.id, inCartItem.quantity - 1);
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer"
                  >
                    {inCartItem.quantity <= 1 ? (
                      <Trash2 className="w-5 h-5" />
                    ) : (
                      <Minus className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-black text-base select-none">{inCartItem.quantity} in Cart</span>
                  </div>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={inCartItem.quantity >= product.stockQuantity}
                    onClick={() => {
                      if (inCartItem.quantity < product.stockQuantity) {
                        updateQuantity(product.id, inCartItem.quantity + 1);
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-40 flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
                    isAdded
                      ? 'bg-[#009E66] text-white'
                      : 'bg-[#16241B] hover:bg-[#009E66] text-white shadow-[#16241B]/15'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4.5 h-4.5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4.5 h-4.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
