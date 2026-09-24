import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard, type ProductItemData } from './ProductCard';
import { useCart } from '../../hooks/useCart';
import { useWishlistIds } from '../../hooks/useWishlistIds';

interface RecommendationCarouselProps {
  products: ProductItemData[];
  onQuickView?: (product: ProductItemData) => void;
  onAddToCart?: (product: ProductItemData, e: React.MouseEvent) => void;
  title?: string;
  subtitle?: string;
}

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  products,
  onQuickView,
  onAddToCart,
  title = 'Recommended for Your Pet',
  subtitle,
}) => {
  const { items } = useCart();
  const { isSaved } = useWishlistIds();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dynamic recommendation contextual title based on last added item
  const lastAddedItem = items[items.length - 1];
  const dynamicSubtitle =
    subtitle || (lastAddedItem ? `Because you added "${lastAddedItem.name}"` : 'Hand-picked by our veterinary specialists');

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full py-8 my-6">
      {/* Header with Navigation */}
      <div className="flex items-end justify-between mb-5 px-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#009E66] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Smart Recommendations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#16241B]">{title}</h2>
          <motion.p
            key={dynamicSubtitle}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs sm:text-sm text-[#16241B]/60 mt-0.5"
          >
            {dynamicSubtitle}
          </motion.p>
        </div>

        {/* Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full bg-white border border-[#16241B]/10 flex items-center justify-center hover:bg-[#FAF6EE] shadow-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-[#16241B]" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full bg-white border border-[#16241B]/10 flex items-center justify-center hover:bg-[#FAF6EE] shadow-xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-[#16241B]" />
          </button>
        </div>
      </div>

      {/* Drag & Snap Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-3 px-1"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[260px] sm:w-[280px] shrink-0 snap-start"
          >
            <ProductCard
              product={product}
              isSaved={isSaved('PRODUCT', product.id)}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationCarousel;
