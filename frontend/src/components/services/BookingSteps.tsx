import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Reveal } from '../motion/Reveal';
import { BOOKING_STEPS_DATA } from './services.data';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const BookingSteps: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 60%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 28,
  });

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header */}
      <Reveal className="text-center space-y-3 mb-12 sm:mb-16 max-w-2xl mx-auto">
        <Badge variant="orange" className="inline-flex">
          HOW IT WORKS
        </Badge>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14261C] tracking-tight leading-[1.1]">
          Simple Steps, <span className="text-[#F47B3A]">Happy</span> Pets
        </h2>
        <p className="text-sm sm:text-base text-[#5D6F63] font-medium leading-relaxed">
          Book certified care in minutes with transparent scheduling and direct vet communication.
        </p>
      </Reveal>

      {/* Steps List with Scroll-Drawn Connector */}
      <div className="relative max-w-5xl mx-auto">
        {/* Animated Horizontal SVG Connector Line for Desktop */}
        <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-8 -z-0 pointer-events-none">
          <svg
            className="w-full h-8 overflow-visible"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            {/* Background dashed path */}
            <path
              d="M 0,5 Q 25,0 50,5 T 100,5"
              fill="none"
              stroke="#E5DFCE"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            {/* Animated drawing foreground stroke */}
            <motion.path
              d="M 0,5 Q 25,0 50,5 T 100,5"
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                pathLength: prefersReduced ? 1 : smoothProgress,
              }}
            />
          </svg>
        </div>

        {/* 3 Step Cards */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10 list-none p-0 m-0">
          {BOOKING_STEPS_DATA.map((stepItem) => {
            const Icon = stepItem.icon;

            return (
              <li
                key={stepItem.step}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Circle with Icon */}
                <div className="relative mb-6">
                  <motion.div
                    style={{
                      scale: prefersReduced ? 1 : undefined,
                    }}
                    whileHover={prefersReduced ? {} : { scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-24 h-24 rounded-full bg-white border-2 border-[#EDE7D9] group-hover:border-[#059669] shadow-md flex items-center justify-center transition-colors duration-300 relative z-10"
                  >
                    <Icon className="w-10 h-10 text-[#059669] transition-transform duration-300 group-hover:scale-110" />
                  </motion.div>

                  {/* Step Number Tag */}
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#14261C] text-white text-xs font-black flex items-center justify-center shadow-md z-20 border-2 border-white">
                    {stepItem.step}
                  </span>
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-black text-[#14261C] mb-2 group-hover:text-[#F47B3A] transition-colors">
                  {stepItem.title}
                </h3>
                <p className="text-sm text-[#556658] font-medium max-w-[260px] leading-relaxed">
                  {stepItem.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
