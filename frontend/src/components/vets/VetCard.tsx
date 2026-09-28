import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Star } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { VetData } from '../../data/vetsData';

interface VetCardProps {
  vet: VetData;
  onBook: (vetId: string | number) => void;
  onCardClick?: (vetId: string | number) => void;
  className?: string;
}

export const VetCard: React.FC<VetCardProps> = ({
  vet,
  onBook,
  onCardClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const showOverlay = isHovered || isFocusWithin;

  const handleProfileClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onCardClick) {
      onCardClick(vet.id);
    } else {
      onBook(vet.id);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(vet.id);
    }
  };

  return (
    <motion.div
      layout
      whileHover={prefersReducedMotion ? {} : { y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocusWithin(false);
        }
      }}
      onClick={handleCardClick}
      className={`group relative bg-white rounded-3xl p-5 border border-[#EDE7D9] shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer focus-within:ring-2 focus-within:ring-[#059669] focus-within:ring-offset-2 outline-none ${className}`}
      tabIndex={0}
      role="article"
      aria-label={`Dr. ${vet.name}, ${vet.specialty}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target === e.currentTarget) {
            e.preventDefault();
            handleCardClick();
          }
        }
      }}
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4EFE6] mb-4 select-none">
          <img
            src={vet.image}
            alt={vet.name}
            loading="lazy"
            draggable={false}
            width={400}
            height={300}
            className="w-full h-full object-cover object-[center_20%] pointer-events-none select-none"
          />

          {/* Top-Right: Rating Badge (only if real rating & reviews exist) */}
          {vet.rating && vet.rating > 0 && vet.reviewsCount && vet.reviewsCount > 0 ? (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-black text-[#14261C] shadow-xs flex items-center gap-1 z-10 border border-[#EDE7D9]">
              <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
              <span>{vet.rating.toFixed(1)}</span>
            </div>
          ) : null}

          {/* Sliding "View Profile" Button Overlay (Desktop Hover & Focus) */}
          <div className="hidden sm:block">
            <motion.div
              initial={false}
              animate={{
                opacity: showOverlay ? 1 : 0,
                y: showOverlay ? 0 : 16,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 bottom-3 flex justify-center px-3 z-20 pointer-events-none"
            >
              <button
                type="button"
                onClick={handleProfileClick}
                tabIndex={showOverlay ? 0 : -1}
                className="pointer-events-auto w-full py-2.5 px-4 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer bg-[#059669] hover:bg-[#047857] text-white active:scale-95 focus:ring-2 focus:ring-white"
                aria-label={`View profile of ${vet.name}`}
              >
                <User className="w-4 h-4" />
                <span>View Profile</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Vet Details */}
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#14261C] group-hover:text-[#F47B3A] transition-colors leading-snug">
            {vet.name}
          </h3>
          <p className="text-xs font-bold text-[#F47B3A] tracking-wide">
            {vet.specialty}
          </p>
          {vet.subSpecialty && (
            <p className="text-xs text-[#556658] font-medium line-clamp-1">
              {vet.subSpecialty}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info: Experience & Price (no mock reviews/ratings) */}
      <div className="mt-4 pt-3 border-t border-[#F2ECE1] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#556658] font-semibold">
          <span>
            {vet.reviewsCount && vet.reviewsCount > 0 ? (
              <>{vet.reviewsCount} review{vet.reviewsCount > 1 ? 's' : ''} • </>
            ) : null}
            {vet.experienceYears ? `${vet.experienceYears}+ yrs exp` : 'Verified Specialist'}
          </span>
          <span className="font-extrabold text-[#059669] text-sm">
            {formatCurrency(vet.fee)}
            <span className="text-[11px] font-normal text-[#556658]"> / visit</span>
          </span>
        </div>

        {/* Mobile/Touch Compact View Profile Button */}
        <div className="block sm:hidden pt-1">
          <button
            type="button"
            onClick={handleProfileClick}
            className="w-full py-2 px-3 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-colors bg-[#059669] text-white active:bg-[#047857]"
          >
            <User className="w-3.5 h-3.5" />
            <span>View Profile</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
