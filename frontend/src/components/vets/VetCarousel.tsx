import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PawPrint, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VetCard } from './VetCard';
import type { VetData, PetType } from '../../data/vetsData';

interface VetCarouselProps {
  vets: VetData[];
  activePetType?: string;
  onSelectPetType?: (petType: string) => void;
  onBook?: (vetId: string | number) => void;
}

const CATEGORY_TABS = [
  { label: 'All', value: 'All' },
  { label: 'Dogs', value: 'dogs' },
  { label: 'Cats', value: 'cats' },
  { label: 'Birds', value: 'birds' },
  { label: 'Rabbits', value: 'rabbits' },
  { label: 'Exotic Pets', value: 'exotic' },
];

export const VetCarousel: React.FC<VetCarouselProps> = ({
  vets,
  activePetType: controlledPetType,
  onSelectPetType,
  onBook,
}) => {
  const navigate = useNavigate();
  const [internalPetType, setInternalPetType] = useState('All');
  const activeTab = controlledPetType !== undefined ? controlledPetType : internalPetType;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);

  // Filter vets based on selected tab
  const filteredVets = React.useMemo(() => {
    if (activeTab === 'All' || activeTab.toLowerCase() === 'all') {
      return vets;
    }
    const target = activeTab.toLowerCase() as PetType;
    return vets.filter((v) => v.petTypes && v.petTypes.includes(target));
  }, [vets, activeTab]);

  // Handle responsive visible card counts
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const gap = 24; // 1.5rem (gap-6)
  const cardWidth = containerWidth > 0
    ? (containerWidth - (visibleCount - 1) * gap) / visibleCount
    : 320;

  const maxIndex = Math.max(0, filteredVets.length - visibleCount);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(Math.min(maxIndex, index));
  };

  const handleTabChange = (val: string) => {
    if (onSelectPetType) {
      onSelectPetType(val);
    } else {
      setInternalPetType(val);
    }
  };

  const handleBooking = (vetId: string | number) => {
    if (onBook) {
      onBook(vetId);
    } else {
      navigate(`/vets/${vetId}`);
    }
  };

  const handleCardClick = (vetId: string | number) => {
    if (dragDistanceRef.current > 5) return;
    navigate(`/vets/${vetId}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const dotsCount = Math.max(1, filteredVets.length - visibleCount + 1);

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs (Left-aligned directly above carousel) */}
      <div className="flex items-center justify-start overflow-x-auto no-scrollbar py-1">
        <div className="bg-white border border-[#EDE6D8] rounded-full p-1.5 shadow-xs inline-flex items-center gap-1.5">
          {CATEGORY_TABS.map((tab) => {
            const isActive =
              activeTab.toLowerCase() === tab.value.toLowerCase() ||
              (activeTab === 'All' && tab.value === 'All');
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#14261C] text-white shadow-xs'
                    : 'text-[#556658] hover:text-[#14261C] hover:bg-[#FAF6EE]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative outline-none focus-visible:ring-2 focus-visible:ring-[#059669] rounded-3xl"
        aria-label="Veterinarians carousel"
      >
        {filteredVets.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#EDE7D9] text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF6EF] border border-[#E8DFC8] flex items-center justify-center text-[#F47B3A]">
              <PawPrint className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-[#14261C]">
              No vets found for {activeTab}
            </h4>
            <p className="text-sm text-[#556658]">
              We don&apos;t have specialists listed under this category right now, but our general practitioners are always ready to help!
            </p>
            <button
              onClick={() => handleTabChange('All')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#059669] text-white text-xs font-bold shadow-xs hover:bg-[#047857] transition-colors"
            >
              <Stethoscope className="w-4 h-4" />
              <span>View All Vets</span>
            </button>
          </div>
        ) : (
          /* Swiper Track with Framer Motion Drag */
          <div className="overflow-hidden py-3 -my-3 px-1 -mx-1 touch-pan-y">
            <motion.div
              drag="x"
              dragConstraints={{
                left: -(maxIndex * (cardWidth + gap)),
                right: 0,
              }}
              dragElastic={0.2}
              dragMomentum={false}
              onDragStart={() => {
                isDraggingRef.current = true;
                dragDistanceRef.current = 0;
              }}
              onDrag={(_, info) => {
                dragDistanceRef.current = Math.hypot(info.offset.x, info.offset.y);
              }}
              onDragEnd={(_, info) => {
                isDraggingRef.current = false;
                const offset = info.offset.x;
                const velocity = info.velocity.x;
                const step = cardWidth + gap;

                // Responsive slide gesture trigger
                if (offset < -40 || velocity < -200) {
                  setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
                } else if (offset > 40 || velocity > 200) {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                } else {
                  const indexDelta = Math.round(-offset / step);
                  setCurrentIndex((prev) => Math.max(0, Math.min(maxIndex, prev + indexDelta)));
                }

                setTimeout(() => {
                  dragDistanceRef.current = 0;
                }, 100);
              }}
              animate={{
                x: -(currentIndex * (cardWidth + gap)),
              }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 32,
              }}
              className="flex gap-6 cursor-grab active:cursor-grabbing select-none touch-pan-y"
              style={{
                width: filteredVets.length * cardWidth + (filteredVets.length - 1) * gap,
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredVets.map((vet) => (
                  <motion.div
                    key={vet.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: cardWidth, flexShrink: 0 }}
                  >
                    <VetCard
                      vet={vet}
                      onBook={handleBooking}
                      onCardClick={handleCardClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Previous & Next Navigation Buttons (Disabled at ends) */}
        {filteredVets.length > visibleCount && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={currentIndex === 0}
              aria-label="Previous vets"
              className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#E5DFCE] shadow-lg flex items-center justify-center text-[#14261C] transition-all cursor-pointer z-30 ${
                currentIndex === 0
                  ? 'opacity-30 cursor-not-allowed pointer-events-none'
                  : 'hover:bg-[#FAF6EE] hover:scale-105 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={currentIndex >= maxIndex}
              aria-label="Next vets"
              className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#E5DFCE] shadow-lg flex items-center justify-center text-[#14261C] transition-all cursor-pointer z-30 ${
                currentIndex >= maxIndex
                  ? 'opacity-30 cursor-not-allowed pointer-events-none'
                  : 'hover:bg-[#FAF6EE] hover:scale-105 active:scale-95'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots (Active is wider green pill) */}
      {dotsCount > 1 && (
        <div
          className="flex items-center justify-center gap-2 pt-2"
          role="tablist"
          aria-label="Carousel pagination"
        >
          {Array.from({ length: dotsCount }).map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={isActive}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2.5 ${
                  isActive
                    ? 'w-7 bg-[#059669]'
                    : 'w-2.5 bg-[#D5CCBC] hover:bg-[#B8AD9C]'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
