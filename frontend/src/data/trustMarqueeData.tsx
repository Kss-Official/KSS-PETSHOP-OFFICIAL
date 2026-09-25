import React from 'react';

export interface BrandItem {
  id: string;
  name: string;
  logo?: React.ReactNode;
  logoSrc?: string;
  href?: string;
  style?: string;
}

export const BRANDS_DATA: BrandItem[] = [
  // 1. Royal Canin (Crown + Iconic red typography)
  {
    id: 'royal-canin',
    name: 'Royal Canin',
    href: '/pharmacy?brand=royal-canin',
    logo: (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#D9222A]" aria-hidden="true">
          <path d="M2 19h20v2H2zM4 17h16l-2-7-4 3-2-7-2 7-4-3z" />
        </svg>
        <span className="font-black text-sm tracking-wider text-[#D9222A] font-sans">
          ROYAL CANIN
        </span>
      </div>
    ),
  },

  // 2. Pedigree (Classic yellow/red dog oval mark)
  {
    id: 'pedigree',
    name: 'Pedigree',
    href: '/pet-essentials?brand=pedigree',
    logo: (
      <div className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-[#E51B24] border-2 border-[#FFD200] flex items-center justify-center font-serif italic font-black text-[10px] text-white">
          P
        </span>
        <span className="font-black italic text-sm tracking-tight text-[#E51B24] font-serif">
          Pedigree
        </span>
      </div>
    ),
  },

  // 3. KONG (Red tiered snowman icon)
  {
    id: 'kong',
    name: 'KONG',
    href: '/pet-essentials?brand=kong',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-5 fill-[#E02424]" aria-hidden="true">
          <circle cx="12" cy="5" r="3.5" />
          <circle cx="12" cy="11.5" r="4.5" />
          <circle cx="12" cy="18" r="5.5" />
        </svg>
        <span className="font-black text-sm tracking-widest text-[#E02424]">
          KONG
        </span>
      </div>
    ),
  },

  // 4. ORIJEN (Nature leaf & modern geometric)
  {
    id: 'orijen',
    name: 'ORIJEN',
    href: '/pharmacy?brand=orijen',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#C0392B]" aria-hidden="true">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s2 3 4 3 6-3 9-4.5 2-4 2-4z" />
        </svg>
        <span className="font-black text-sm tracking-[0.22em] text-[#16241B]">
          ORIJEN
        </span>
      </div>
    ),
  },

  // 5. Farmina (Wheat harvest crest & refined typography)
  {
    id: 'farmina',
    name: 'Farmina',
    href: '/pharmacy?brand=farmina',
    logo: (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0088CC]" aria-hidden="true">
          <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
        </svg>
        <span className="font-serif font-black text-sm tracking-wide text-[#0088CC]">
          Farmina
        </span>
      </div>
    ),
  },

  // 6. Drools (Happy dog face silhouette + modern script)
  {
    id: 'drools',
    name: 'Drools',
    href: '/pet-essentials?brand=drools',
    logo: (
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E65100]" />
        <span className="font-black text-sm tracking-tight text-[#E65100] lowercase font-sans">
          drools
        </span>
      </div>
    ),
  },

  // 7. Outward Hound (Outdoor dog silhouette & bold badge)
  {
    id: 'outward-hound',
    name: 'Outward Hound',
    href: '/pet-essentials?brand=outward-hound',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0D8758]" aria-hidden="true">
          <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2L7 10l-6 8h22L14 6z" />
        </svg>
        <span className="font-extrabold text-xs tracking-wider uppercase text-[#14261C]">
          OUTWARD HOUND
        </span>
      </div>
    ),
  },

  // 8. Chuckit! (Energetic orange flying ring & dynamic italic)
  {
    id: 'chuckit',
    name: 'Chuckit!',
    href: '/pet-essentials?brand=chuckit',
    logo: (
      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-full bg-[#0091FF] border-2 border-[#FF6600]" />
        <span className="font-black italic text-sm tracking-tighter text-[#0091FF]">
          Chuckit<span className="text-[#FF6600]">!</span>
        </span>
      </div>
    ),
  },

  // 9. Barking Buddha (Peaceful lotus paw logo)
  {
    id: 'barking-buddha',
    name: 'Barking Buddha',
    href: '/pet-essentials?brand=barking-buddha',
    logo: (
      <div className="flex items-center gap-1.5">
        <span className="text-[#B8860B] text-sm">🪷</span>
        <span className="font-black text-xs sm:text-sm tracking-tight text-[#5C4033]">
          Barking Buddha
        </span>
      </div>
    ),
  },

  // 10. Ruffwear (Mountain peak outdoor icon)
  {
    id: 'ruffwear',
    name: 'RUFFWEAR',
    href: '/pet-essentials?brand=ruffwear',
    logo: (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#E63946]" aria-hidden="true">
          <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.5l5 4.5h-2v5h-6v-5H7l5-4.5z" />
        </svg>
        <span className="font-black text-xs tracking-widest uppercase text-[#16241B]">
          RUFFWEAR
        </span>
      </div>
    ),
  },

  // 11. Kurgo (Travel & adventure compass badge)
  {
    id: 'kurgo',
    name: 'kurgo',
    href: '/pet-essentials?brand=kurgo',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#D97706]" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 7l2 5-5-2 3-3z" />
        </svg>
        <span className="font-black text-sm tracking-wide text-[#16241B] lowercase">
          kurgo
        </span>
      </div>
    ),
  },

  // 12. WeatherBeeta (Shield jacket crest)
  {
    id: 'weatherbeeta',
    name: 'WeatherBeeta',
    href: '/pet-essentials?brand=weatherbeeta',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1E3A8A]" aria-hidden="true">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
        </svg>
        <span className="font-black text-xs sm:text-sm tracking-tight text-[#1E3A8A]">
          WeatherBeeta
        </span>
      </div>
    ),
  },

  // 13. FURminator (Precision de-shedding mark)
  {
    id: 'furminator',
    name: 'FURMINATOR',
    href: '/pet-essentials?brand=furminator',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#F59E0B]" aria-hidden="true">
          <path d="M3 5v14l8-7-8-7zm10 0v14l8-7-8-7z" />
        </svg>
        <span className="font-black text-xs tracking-tight uppercase text-[#14261C]">
          FURMINATOR
        </span>
      </div>
    ),
  },

  // 14. WAHL (Global grooming star crest)
  {
    id: 'wahl',
    name: 'WAHL',
    href: '/pet-essentials?brand=wahl',
    logo: (
      <div className="flex items-center gap-1.5">
        <span className="text-[#DC2626] font-black text-xs">★</span>
        <span className="font-black text-sm tracking-widest text-[#16241B]">
          WAHL
        </span>
        <span className="text-[#DC2626] font-black text-xs">★</span>
      </div>
    ),
  },

  // 15. ChillPaws (Calm wellness leaf drop)
  {
    id: 'chillpaws',
    name: 'ChillPaws',
    href: '/pharmacy?brand=chillpaws',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#059669]" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
        <span className="font-black text-sm tracking-tight text-[#059669]">
          ChillPaws
        </span>
      </div>
    ),
  },

  // 16. Nutri-Vet (Veterinary medical cross & shield)
  {
    id: 'nutri-vet',
    name: 'Nutri-Vet',
    href: '/pharmacy?brand=nutri-vet',
    logo: (
      <div className="flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-md bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs leading-none">
          +
        </span>
        <span className="font-black text-xs sm:text-sm tracking-tight text-[#DC2626]">
          Nutri-Vet
        </span>
      </div>
    ),
  },

  // 17. Zesty Paws (Sunburst vitality mark)
  {
    id: 'zesty-paws',
    name: 'Zesty Paws',
    href: '/pharmacy?brand=zesty-paws',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#F97316]" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="font-black italic text-xs sm:text-sm tracking-tight text-[#F97316]">
          Zesty Paws
        </span>
      </div>
    ),
  },

  // 18. Mammoth (Mammoth strength rope mark)
  {
    id: 'mammoth',
    name: 'MAMMOTH',
    href: '/pet-essentials?brand=mammoth',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#4B5563]" aria-hidden="true">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <span className="font-black text-xs sm:text-sm tracking-widest text-[#1F2937]">
          MAMMOTH
        </span>
      </div>
    ),
  },
];
