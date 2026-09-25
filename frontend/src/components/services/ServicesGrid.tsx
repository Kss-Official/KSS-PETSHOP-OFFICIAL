import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../motion/Skeleton';
import { EmptyState } from '../feedback/EmptyState';
import { ErrorState } from '../feedback/ErrorState';
import { ServiceCard } from './ServiceCard';
import type { ServiceDto } from './services.data';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ServicesGridProps {
  services: ServiceDto[];
  loading: boolean;
  error: string | null;
  highlightedServiceId: number | null;
  onRetry: () => void;
  onBook: (service: ServiceDto) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  loading,
  error,
  highlightedServiceId,
  onRetry,
  onBook,
}) => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-mt-24">
      {/* Section Header with Staggered Entrance */}
      <div className="text-center space-y-3.5 mb-10 sm:mb-12 max-w-3xl mx-auto">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EF7C3C]/10 border border-[#EF7C3C]/20 text-[#EF7C3C] text-xs sm:text-sm font-bold tracking-wide uppercase">
            WHAT WE OFFER
          </span>
        </motion.div>

        <motion.h2
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: prefersReduced ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14261C] tracking-tight leading-[1.15]"
        >
          Our Pet Care <span className="text-[#EF7C3C]">Services</span>
        </motion.h2>

        <motion.p
          initial={prefersReduced ? {} : { opacity: 0, y: 14 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: prefersReduced ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg text-[#556658] max-w-2xl mx-auto font-medium leading-relaxed"
        >
          From preventative wellness and surgical care to luxury grooming and 24/7 transport,
          discover comprehensive care tailored to your pet.
        </motion.p>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] p-4 border border-[#EDE7D9] space-y-3">
              <Skeleton width="100%" height={180} rounded="xl" />
              <Skeleton width="65%" height={20} rounded="md" />
              <Skeleton width="100%" height={14} rounded="sm" />
              <Skeleton width="80%" height={14} rounded="sm" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services found"
          description="We are currently updating our list of available services."
          actionLabel="Check Again"
          onAction={onRetry}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isHighlighted={highlightedServiceId === service.id}
              onBook={onBook}
            />
          ))}
        </div>
      )}
    </section>
  );
};
