import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  type ServiceDto,
  SERVICES_HERO_SUBTITLE,
} from './services.data';

interface ServicesHeroProps {
  services?: ServiceDto[];
  onBookAppointment?: () => void;
  onJumpToService?: (serviceId: number) => void;
}

export const ServicesHero: React.FC<ServicesHeroProps> = () => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      id="services-hero"
      aria-label="Services Header"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-2 text-center"
    >
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
        animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs font-bold text-[#EF7C3C] uppercase tracking-widest bg-[#FEF3EB] px-3.5 py-1.5 rounded-full border border-[#EF7C3C]/20 inline-block">
          Our Services
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-tight">
          Care That Makes Tails <span className="text-[#EF7C3C]">Wag</span> & Pets Thrive.
        </h1>

        <p className="text-sm sm:text-base text-[#556658] font-medium leading-relaxed max-w-2xl mx-auto">
          {SERVICES_HERO_SUBTITLE}
        </p>
      </motion.div>
    </section>
  );
};

export default ServicesHero;

