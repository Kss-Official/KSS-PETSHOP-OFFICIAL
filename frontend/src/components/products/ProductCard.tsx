import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, ShoppingBag, ShieldCheck, Check, Sparkles, Plus, Minus, Trash2 } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { WishlistHeart } from './WishlistHeart';
import { formatCurrency, getProductImageUrl } from '../../lib/utils';
import { springs } from '../../lib/motion';
import { useCart } from '../../hooks/useCart';

export interface ProductItemData {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  secondaryImageUrl?: string;
  prescriptionRequired?: boolean;
  brand?: string;
  originalPrice?: number;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: ProductItemData;
  isSaved?: boolean;
  onQuickView?: (product: ProductItemData) => void;
  onAddToCart?: (product: ProductItemData, e: React.MouseEvent) => void;
  isAddingToCart?: boolean;
  isAddedSuccess?: boolean;
  quantityInCart?: number;
  onCompareToggle?: (product: ProductItemData) => void;
  isComparing?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved = false,
  onQuickView,
  onAddToCart,
  isAddingToCart = false,
  isAddedSuccess = false,
  quantityInCart: propQuantityInCart,
}) => {
  const { updateQuantity, removeItem, addToCart: contextAddToCart, items } = useCart();
  const quantityInCart = propQuantityInCart !== undefined
    ? propQuantityInCart
    : items.find((i) => i.productId === product.id)?.quantity || 0;

  const { ref, tilt, isTouchDevice, tiltProps, sheenStyle } = useTilt<HTMLDivElement>({
    maxTilt: 6,
    sheen: true,
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rating = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || 24;
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const primaryImage = getProductImageUrl(product.name, product.imageUrl, product.id);
  const secondaryImage = product.secondaryImageUrl || primaryImage;

  return (
    <motion.div
      ref={ref}
      {...tiltProps}
      onMouseEnter={() => {
        setIsHovered(true);
        tiltProps.onMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        tiltProps.onMouseLeave();
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={springs.soft}
      style={{
        transformStyle: 'preserve-3d',
        transform:
          !isTouchDevice && tilt.isHovered
            ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateY(-8px)`
            : !isTouchDevice
            ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
            : undefined,
      }}
      className={`group relative flex flex-col justify-between h-full bg-white/95 rounded-[22px] border border-[#16241B]/8 p-4 md:p-5 transition-all duration-300 ${
        tilt.isHovered
          ? 'shadow-[0_20px_40px_-12px_rgba(22,36,27,0.13),0_6px_16px_-4px_rgba(22,36,27,0.06)] border-[#009E66]/30'
          : 'shadow-[0_4px_20px_-2px_rgba(22,36,27,0.05),0_2px_6px_0_rgba(22,36,27,0.03)]'
      }`}
    >
      {/* Dynamic Sheen Highlight */}
      {sheenStyle && (
        <div
          className="absolute inset-0 rounded-[22px] pointer-events-none transition-opacity duration-200 z-30"
          style={sheenStyle}
        />
      )}

      {/* Top Badges & Wishlist Action */}
      <div className="relative z-20 flex items-center justify-between w-full mb-3 gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {discountPercent ? (
            <motion.span
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#EF7C3C] text-white shadow-sm flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {discountPercent}% OFF
            </motion.span>
          ) : product.prescriptionRequired ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EF7C3C]/12 text-[#D9692A] border border-[#EF7C3C]/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Rx Required
            </span>
          ) : product.isFeatured ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#009E66]/12 text-[#009E66] border border-[#009E66]/20 flex items-center gap-1">
              ★ Top Pick
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF6EE] text-[#16241B]/70 border border-[#16241B]/8">
              {product.category}
            </span>
          )}

          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
              Only {product.stockQuantity} left
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <WishlistHeart
          itemType="PRODUCT"
          itemId={product.id}
          isInitiallySaved={isSaved}
          className="shadow-sm"
        />
      </div>

      {/* Hero Image Container with 1.08x Zoom & Dual Image Cross-fade */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FAF6EE] flex items-center justify-center p-3 mb-4 group/image">
        {/* Shimmer skeleton before image loads */}
        {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer z-10" />}

        {/* Primary Image */}
        <motion.img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          animate={{
            scale: isHovered ? 1.08 : 1,
            opacity: isHovered && product.secondaryImageUrl ? 0 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-contain filter drop-shadow-sm select-none"
        />

        {/* Secondary Image Crossfade */}
        {product.secondaryImageUrl && (
          <motion.img
            src={secondaryImage}
            alt={`${product.name} alternate angle`}
            loading="lazy"
            animate={{
              scale: isHovered ? 1.08 : 1,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-contain p-3 filter drop-shadow-sm select-none"
          />
        )}

        {/* Soft Gradient Overlay & Slide-Up Stagger Action Buttons */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#16241B]/75 via-[#16241B]/20 to-transparent flex items-end justify-center p-3 transition-opacity duration-300 z-20 ${
            isTouchDevice ? 'opacity-0 pointer-events-none' : isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 w-full">
            {/* Quick View Button */}
            {onQuickView && (
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                transition={{ duration: 0.28, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 py-2.5 px-3 rounded-xl glass-surface text-[#16241B] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#009E66]" />
                Quick View
              </motion.button>
            )}

            {/* Quick Add / Stepper Button */}
            {quantityInCart === 0 ? (
              <motion.button
                type="button"
                disabled={isOutOfStock || isAddingToCart}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(product, e);
                  else contextAddToCart(product, e);
                }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                transition={{ duration: 0.28, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ${
                  isAddedSuccess
                    ? 'bg-[#009E66] text-white'
                    : 'bg-[#16241B] hover:bg-[#009E66] text-white'
                }`}
              >
                {isAddedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                transition={{ duration: 0.28, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 h-[38px] px-1.5 rounded-xl bg-[#009E66] text-white flex items-center justify-between shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantityInCart <= 1) {
                      removeItem(product.id);
                    } else {
                      updateQuantity(product.id, quantityInCart - 1);
                    }
                  }}
                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer shrink-0"
                >
                  {quantityInCart <= 1 ? (
                    <Trash2 className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </button>

                <span className="font-black text-xs px-1 select-none min-w-[20px] text-center">
                  {quantityInCart}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantityInCart >= product.stockQuantity}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantityInCart < product.stockQuantity) {
                      updateQuantity(product.id, quantityInCart + 1);
                    }
                  }}
                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-40 flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Rating Stars with 40ms Stagger Reveal on Scroll */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <motion.div
                  key={starIndex}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: 0.05 + starIndex * 0.04,
                    ease: 'easeOut',
                  }}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      starIndex <= Math.round(rating)
                        ? 'fill-[#FFD84D] text-[#FFD84D]'
                        : 'text-gray-200 fill-gray-100'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#16241B]/80">{rating.toFixed(1)}</span>
            <span className="text-[11px] text-[#16241B]/40">({reviewsCount})</span>
          </div>

          {/* Product Title with Fixed 2-Line Box Height */}
          <h3
            className="font-bold text-[#16241B] text-sm md:text-base leading-snug line-clamp-2 min-h-[2.6rem] mb-1.5 group-hover:text-[#009E66] transition-colors duration-200"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description with Fixed 2-Line Box Height */}
          <p className="text-xs text-[#16241B]/60 line-clamp-2 min-h-[2rem] mb-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-[#16241B]/8 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base md:text-lg font-black text-[#16241B]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#16241B]/40 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium text-[#16241B]/50">
              {isOutOfStock ? 'Sold Out' : 'Free In-Store Pickup'}
            </span>
          </div>

          {/* Add / Stepper CTA on Price Row */}
          <div>
            {isOutOfStock ? null : quantityInCart > 0 ? (
              <div
                className="flex items-center bg-[#009E66] text-white rounded-xl p-1 shadow-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantityInCart <= 1) {
                      removeItem(product.id);
                    } else {
                      updateQuantity(product.id, quantityInCart - 1);
                    }
                  }}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer"
                >
                  {quantityInCart <= 1 ? (
                    <Trash2 className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                </button>
                <span className="font-black text-xs px-2 select-none min-w-[20px] text-center">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantityInCart >= product.stockQuantity}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantityInCart < product.stockQuantity) {
                      updateQuantity(product.id, quantityInCart + 1);
                    }
                  }}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-40 flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={isOutOfStock || isAddingToCart}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(product, e);
                  else contextAddToCart(product, e);
                }}
                className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
                  isAddedSuccess
                    ? 'bg-[#009E66] text-white'
                    : 'bg-[#16241B] hover:bg-[#009E66] text-white'
                }`}
                aria-label={`Add ${product.name} to cart`}
              >
                {isAddedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
