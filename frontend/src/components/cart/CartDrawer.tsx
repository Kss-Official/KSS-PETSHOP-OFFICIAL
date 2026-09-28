import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useCart, type CartItem } from '../../hooks/useCart';
import { formatCurrency, getProductImageUrl } from '../../lib/utils';
import { Odometer } from '../ui/Odometer';
import { useNavigate } from 'react-router-dom';
import { springs } from '../../lib/motion';

const QuantityStepper: React.FC<{
  quantity: number;
  stockQuantity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}> = ({ quantity, stockQuantity = 99, onIncrement, onDecrement, disabled }) => {
  const [direction, setDirection] = React.useState<'up' | 'down'>('up');

  const handleInc = () => {
    setDirection('up');
    onIncrement();
  };

  const handleDec = () => {
    setDirection('down');
    onDecrement();
  };

  return (
    <div className="flex items-center bg-[#FAF6EE] rounded-full p-1 border border-[#16241B]/10">
      <button
        type="button"
        onClick={handleDec}
        disabled={disabled}
        aria-label="Decrease quantity"
        className="w-6 h-6 rounded-full bg-white text-[#16241B] flex items-center justify-center hover:bg-[#EF7C3C] hover:text-white transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
      >
        <Minus className="w-3 h-3" />
      </button>

      <div className="relative w-7 h-6 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantity}
            initial={{ y: direction === 'up' ? 12 : -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction === 'up' ? -12 : 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="font-black text-xs text-[#16241B] absolute"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={handleInc}
        disabled={disabled || quantity >= stockQuantity}
        aria-label="Increase quantity"
        className="w-6 h-6 rounded-full bg-[#009E66] text-white flex items-center justify-center hover:bg-[#008757] transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

const CartDrawerItem: React.FC<{
  item: CartItem;
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}> = ({ item, onUpdateQty, onRemove, isUpdating }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.85, marginBottom: 0, transition: { duration: 0.28 } }}
      drag="x"
      dragConstraints={{ left: -80, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -60) {
          onRemove();
        }
      }}
      className="relative flex items-center gap-3.5 bg-white rounded-2xl p-3.5 border border-[#16241B]/8 shadow-[0_2px_12px_rgba(22,36,27,0.04)] mb-3 overflow-hidden group"
    >
      {/* Product Image */}
      <div className="w-16 h-16 rounded-xl bg-[#FAF6EE] p-1.5 flex items-center justify-center shrink-0 overflow-hidden border border-[#16241B]/6">
        <img
          src={getProductImageUrl(item.name, item.imageUrl, item.id)}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xs sm:text-sm text-[#16241B] truncate leading-tight mb-1" title={item.name}>
          {item.name}
        </h4>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black text-[#009E66]">
            {formatCurrency(item.price)}
          </span>
          {item.category && (
            <span className="text-[10px] font-semibold text-[#16241B]/50 uppercase tracking-wider">
              {item.category}
            </span>
          )}
        </div>

        {/* Stepper + Remove */}
        <div className="flex items-center justify-between">
          <QuantityStepper
            quantity={item.quantity}
            stockQuantity={item.stockQuantity}
            onIncrement={() => onUpdateQty(item.quantity + 1)}
            onDecrement={() => onUpdateQty(item.quantity - 1)}
            disabled={isUpdating}
          />

          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove item"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalCount,
    subtotal,
    isCartOpen,
    freeShippingThreshold,
    closeCart,
    updateQuantity,
    removeItem,
    isUpdating,
  } = useCart();
  const navigate = useNavigate();

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountLeftForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[9990] flex justify-end">
          {/* Backdrop Blur & Dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#16241B]/40 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Surface */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={springs.soft}
            className="relative z-10 w-full max-w-md h-full glass-drawer flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-[#16241B]/8 flex items-center justify-between bg-white/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#009E66]/15 text-[#009E66] flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#16241B]">Your Cart</h3>
                  <p className="text-[11px] text-[#16241B]/60 font-medium">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'} in basket
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="w-8 h-8 rounded-full bg-[#16241B]/5 hover:bg-[#16241B]/10 text-[#16241B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="px-5 py-3 bg-[#FAF6EE] border-b border-[#16241B]/6">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <div className="flex items-center gap-1.5 text-[#16241B]">
                  <Truck className="w-3.5 h-3.5 text-[#009E66]" />
                  {amountLeftForFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-[#009E66]">{formatCurrency(amountLeftForFreeShipping)}</strong> for Free Delivery
                    </span>
                  ) : (
                    <span className="text-[#009E66] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> You unlocked Free Shipping!
                    </span>
                  )}
                </div>
                <span className="text-[#16241B]/60 text-[11px]">{progressPercent}%</span>
              </div>

              {/* Progress Bar with Shine Sweep */}
              <div className="relative w-full h-2 rounded-full bg-[#16241B]/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-gradient-to-r from-[#009E66] to-[#4ADE80] rounded-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmerSweep_2s_infinite]" />
                </motion.div>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#009E66]/10 text-[#009E66] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-9 h-9" />
                  </div>
                  <h4 className="font-extrabold text-[#16241B] text-base mb-1">Your cart is empty</h4>
                  <p className="text-xs text-[#16241B]/60 max-w-xs mb-5">
                    Explore our veterinary pharmacy and curated pet goodies to pamper your pet!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      navigate('/pharmacy');
                    }}
                    className="py-2.5 px-6 rounded-full bg-[#009E66] hover:bg-[#008757] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Browse Pharmacy
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartDrawerItem
                      key={item.productId}
                      item={item}
                      onUpdateQty={(qty) => updateQuantity(item.productId, qty)}
                      onRemove={() => removeItem(item.productId)}
                      isUpdating={isUpdating[item.productId]}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Summary & CTA */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#16241B]/8 bg-white/90 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#16241B]/70">Subtotal</span>
                  <div className="text-lg font-black text-[#16241B]">
                    <Odometer value={subtotal} prefix="₹" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#16241B]/60">
                  <span>Estimated Taxes & In-Store Pickup</span>
                  <span className="font-bold text-[#009E66]">Calculated at Checkout</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('/profile?tab=cart');
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#009E66] hover:bg-[#008757] text-white font-black text-sm shadow-lg shadow-[#009E66]/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
