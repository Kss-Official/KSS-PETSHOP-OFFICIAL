import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { MagneticButton } from '../motion/MagneticButton';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface GroomingExcellenceProps {
  onExploreGrooming?: () => void;
}

export const GroomingExcellence: React.FC<GroomingExcellenceProps> = ({ onExploreGrooming }) => {
  const prefersReduced = usePrefersReducedMotion();

  const features = [
    {
      icon: Award,
      title: 'Trained Groomers',
      description:
        "Our buddies take great pride in the health of your pet. And the best part is we have patience, lot's of it!",
    },
    {
      icon: ShieldCheck,
      title: 'Hygiene',
      description:
        'We provide a luxurious and spa-like experience for your furry friend, with all the amenities they need to look and feel their best.',
    },
    {
      icon: HeartHandshake,
      title: 'Best products',
      description:
        'We strictly select gentle, premium products from top brands tailored to nourish their coat and keep them looking their best.',
    },
  ];

  return (
    <section aria-labelledby="grooming-excellence-title" className="relative py-12 lg:py-20 bg-[#FAF6EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Media / Collage Image */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, x: -30 }}
            whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex justify-center items-center relative"
          >
            <div className="relative w-full max-w-[560px] group">
              {/* Subtle decorative backdrop glow */}
              <div 
                className="absolute -inset-4 bg-gradient-to-tr from-[#EF7C3C]/10 via-[#F5A623]/5 to-transparent rounded-3xl filter blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" 
                aria-hidden="true" 
              />
              
              <div className="relative overflow-hidden rounded-3xl transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src="/images/grooming_excellence_collage.png"
                  alt="Pawfectly Grooming Excellence Collage - Happy pets receiving grooming and care"
                  className="w-full h-auto object-contain drop-shadow-sm transition-all duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Why Us & Content */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, x: 30 }}
            whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-6 space-y-8"
          >
            {/* Header / Subtitle */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EF7C3C]/10 border border-[#EF7C3C]/20 text-[#EF7C3C] text-xs sm:text-sm font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#EF7C3C]" />
                <span>Why us?</span>
              </div>
              <h2
                id="grooming-excellence-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14261C] tracking-tight leading-[1.15]"
              >
                Unparalleled Grooming Excellence
              </h2>
              <p className="text-base sm:text-lg text-[#556658] font-medium leading-relaxed pt-1">
                Experience our meticulous care in a tidy, sanitized, and cozy setting, where we ensure your cherished companion emerges looking their absolute finest. Your pet&apos;s magnificence is our mission.
              </p>
            </div>

            {/* Feature Points */}
            <div className="space-y-6 pt-2">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={prefersReduced ? {} : { opacity: 0, y: 15 }}
                    whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + idx * 0.1 }}
                    className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/60 hover:bg-white/90 border border-[#EDE7D9] transition-all duration-300 hover:shadow-md hover:border-[#EF7C3C]/30 group"
                  >
                    <div className="p-3 rounded-xl bg-[#EF7C3C]/10 text-[#EF7C3C] group-hover:bg-[#EF7C3C] group-hover:text-white transition-colors duration-300 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold text-[#14261C] group-hover:text-[#EF7C3C] transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#556658] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Action button matching site style */}
            {onExploreGrooming && (
              <div className="pt-2">
                <MagneticButton
                  variant="orange"
                  size="lg"
                  showPaw
                  onClick={onExploreGrooming}
                  className="bg-[#F47B3A] hover:bg-[#d96627] text-white font-bold shadow-lg text-sm sm:text-base px-8 py-4 rounded-full cursor-pointer transition-transform"
                >
                  Explore Grooming Services
                </MagneticButton>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default GroomingExcellence;
