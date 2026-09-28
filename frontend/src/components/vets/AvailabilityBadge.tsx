import React from 'react';
import { motion } from 'framer-motion';
import type { AvailabilityStatus } from '../../data/vetsData';

interface AvailabilityBadgeProps {
  availability: AvailabilityStatus;
  nextSlot?: string;
  isHovered?: boolean;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  availability,
  nextSlot,
  isHovered = false,
}) => {
  const getBadgeConfig = () => {
    switch (availability) {
      case 'available':
        return {
          dotBg: 'bg-[#059669]',
          ringColor: 'bg-[#059669]/30',
          textColor: 'text-[#065F46]',
          badgeBg: 'bg-white/95 border-[#A7F3D0]',
          defaultText: 'Available today',
          pulse: true,
        };
      case 'busy':
        return {
          dotBg: 'bg-[#F47B3A]',
          ringColor: 'bg-[#F47B3A]/30',
          textColor: 'text-[#9A3412]',
          badgeBg: 'bg-white/95 border-[#FED7AA]',
          defaultText: 'Few slots left',
          pulse: false,
        };
      case 'offline':
      default:
        return {
          dotBg: 'bg-gray-400',
          ringColor: 'transparent',
          textColor: 'text-gray-600',
          badgeBg: 'bg-white/95 border-gray-200',
          defaultText: 'Unavailable',
          pulse: false,
        };
    }
  };

  const config = getBadgeConfig();
  const displayText = isHovered && nextSlot ? nextSlot : config.defaultText;

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xs backdrop-blur-xs text-[11px] font-bold ${config.badgeBg} ${config.textColor}`}
      aria-label={`Status: ${config.defaultText}${nextSlot ? `, Next slot: ${nextSlot}` : ''}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.ringColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dotBg}`} />
      </span>

      <motion.span
        key={displayText}
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 2 }}
        transition={{ duration: 0.2 }}
        className="whitespace-nowrap font-bold"
      >
        {displayText}
      </motion.span>
    </motion.div>
  );
};
