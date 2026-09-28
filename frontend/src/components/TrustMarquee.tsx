import React from 'react';
import { Link } from 'react-router-dom';
import { BRANDS_DATA, type BrandItem } from '../data/trustMarqueeData';

const SECTION_LABEL = 'BRANDS WE CARRY';

interface TrustMarqueeProps {
  items?: BrandItem[];
  row1Speed?: number; // In seconds, default 45
  row2Speed?: number; // In seconds, default 55
  pauseOnHover?: boolean;
  className?: string;
}

const BrandPill: React.FC<{ brand: BrandItem; isDuplicate?: boolean }> = ({
  brand,
  isDuplicate = false,
}) => {
  const content = (
    <div
      className={`group relative flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/95 border border-[#E5DEC9] shadow-[0_2px_8px_rgba(20,38,28,0.03)] hover:shadow-md hover:border-[#F47B3A] hover:bg-white transition-all duration-200 shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#059669] focus:outline-none`}
    >
      {brand.logo ? (
        <div className="h-6 sm:h-7 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          {brand.logo}
        </div>
      ) : brand.logoSrc ? (
        <img
          src={brand.logoSrc}
          alt={brand.name}
          height={28}
          className="h-6 sm:h-7 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
      ) : (
        <span
          className={`text-xs sm:text-sm text-[#14261C]/70 group-hover:text-[#14261C] transition-colors duration-200 whitespace-nowrap ${
            brand.style || 'font-bold'
          }`}
        >
          {brand.name}
        </span>
      )}
    </div>
  );

  if (brand.href && !isDuplicate) {
    return (
      <Link
        to={brand.href}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
        aria-label={`Shop ${brand.name}`}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export const TrustMarquee: React.FC<TrustMarqueeProps> = ({
  items = BRANDS_DATA,
  row1Speed = 45,
  row2Speed = 55,
  pauseOnHover = true,
  className = '',
}) => {
  // Split 18 items into 2 rows of 9
  const midpoint = Math.ceil(items.length / 2);
  const row1Items = items.slice(0, midpoint);
  const row2Items = items.slice(midpoint);

  // Repeat items in each track so track width exceeds large screens
  const track1Items = [...row1Items, ...row1Items];
  const track2Items = [...row2Items, ...row2Items];

  return (
    <section
      aria-label="Brands we carry"
      className={`w-full py-8 sm:py-10 overflow-hidden bg-[#FAF6EF] border-y border-[#EDE6D8]/80 select-none ${className}`}
    >
      <style>{`
        @keyframes marquee-scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee-scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-track-row1 {
          will-change: transform;
          animation: marquee-scroll-left ${row1Speed}s linear infinite;
        }
        .animate-marquee-track-row2 {
          will-change: transform;
          animation: marquee-scroll-right ${row2Speed}s linear infinite;
        }
        ${
          pauseOnHover
            ? `
        .marquee-container:hover .animate-marquee-track-row1,
        .marquee-container:focus-within .animate-marquee-track-row1,
        .marquee-container:hover .animate-marquee-track-row2,
        .marquee-container:focus-within .animate-marquee-track-row2 {
          animation-play-state: paused;
        }
        `
            : ''
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-track-row1,
          .animate-marquee-track-row2 {
            animation: none !important;
            flex-wrap: wrap;
            justify-content: center;
            width: 100% !important;
            transform: none !important;
            gap: 0.75rem !important;
            padding-right: 0 !important;
          }
          .marquee-duplicate-copy {
            display: none !important;
          }
        }
      `}</style>

      {/* Slim Header: Centered uppercase label with divider lines */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6 sm:mb-7">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[#DED4C0] to-[#DED4C0] flex-1 max-w-[120px] sm:max-w-[180px]" />
          <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#6C7D70] uppercase text-center">
            {SECTION_LABEL}
          </span>
          <div className="h-px bg-gradient-to-l from-transparent via-[#DED4C0] to-[#DED4C0] flex-1 max-w-[120px] sm:max-w-[180px]" />
        </div>
      </div>

      {/* Two-Row Marquee Container with Dual Fade Masks */}
      <div
        className="marquee-container relative w-full overflow-hidden space-y-5 sm:space-y-6"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {/* Row 1: Right-to-Left (Seamless Twin Tracks) */}
        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee-track-row1 flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4 py-0.5">
            {track1Items.map((brand, index) => (
              <div key={`r1-a-${brand.id}-${index}`}>
                <BrandPill brand={brand} />
              </div>
            ))}
          </div>
          <div
            className="animate-marquee-track-row1 flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4 py-0.5 marquee-duplicate-copy"
            aria-hidden="true"
          >
            {track1Items.map((brand, index) => (
              <div key={`r1-b-${brand.id}-${index}`}>
                <BrandPill brand={brand} isDuplicate={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Left-to-Right (Seamless Twin Tracks) */}
        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee-track-row2 flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4 py-0.5">
            {track2Items.map((brand, index) => (
              <div key={`r2-a-${brand.id}-${index}`}>
                <BrandPill brand={brand} />
              </div>
            ))}
          </div>
          <div
            className="animate-marquee-track-row2 flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4 py-0.5 marquee-duplicate-copy"
            aria-hidden="true"
          >
            {track2Items.map((brand, index) => (
              <div key={`r2-b-${brand.id}-${index}`}>
                <BrandPill brand={brand} isDuplicate={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
