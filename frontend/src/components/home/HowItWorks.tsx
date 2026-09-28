import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Search, CalendarCheck, Stethoscope, HeartPulse } from 'lucide-react';

interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  borderColor: string;
}

const stepsData: StepItem[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    title: 'Find a Vet',
    description: 'Search 500+ verified vets by pet type, specialty and location.',
    icon: Search,
    accentColor: '#F47B3A',
    bgLight: '#FFF4ED',
    borderColor: '#FED7AA',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    title: 'Book Instantly',
    description: 'Pick a time slot that suits you and confirm in seconds.',
    icon: CalendarCheck,
    accentColor: '#FFC629',
    bgLight: '#FEF9E7',
    borderColor: '#FDE68A',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    title: 'Consult',
    description: "Visit the clinic with your pet's records ready.",
    icon: Stethoscope,
    accentColor: '#059669',
    bgLight: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    title: 'Happy Pet',
    description: 'Get prescriptions, follow-ups and care reminders in one place.',
    icon: HeartPulse,
    accentColor: '#EF4444',
    bgLight: '#FEF2F2',
    borderColor: '#FECACA',
  },
];

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 60%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 bg-[#FAF6EF] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FDF2E9] border border-[#FCD5B5] px-4 py-1 rounded-full text-xs font-black tracking-widest text-[#F47B3A] uppercase mb-4 shadow-xs">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14261C] tracking-tight">
            Care In Four <span className="text-[#F47B3A]">Simple</span> Steps
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#556658] font-medium leading-relaxed">
            From booking to recovery, we make pet parenting effortless and stress-free.
          </p>
        </div>

        {/* Desktop Layout (Horizontal) */}
        <div className="hidden lg:block relative">
          {/* Connecting Track & Animated Line */}
          <div
            className="absolute top-[88px] left-[10%] right-[10%] h-[3px] pointer-events-none z-0"
            aria-hidden="true"
          >
            {/* Neutral dashed track */}
            <div className="w-full h-full border-t-2 border-dashed border-[#E3DCCE]" />

            {/* Scroll-drawn gradient line */}
            <motion.div
              className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#F47B3A] via-[#FFC629] to-[#059669] rounded-full origin-left"
              style={{ scaleX: smoothProgress }}
            />
          </div>

          {/* 4 Equal Step Cards */}
          <div className="grid grid-cols-4 gap-6 relative z-10">
            {stepsData.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Number Pill */}
                  <span
                    className="text-xs font-black tracking-wider px-3 py-1 rounded-full border mb-4 shadow-xs transition-transform duration-200 group-hover:scale-105"
                    style={{
                      color: step.accentColor,
                      backgroundColor: step.bgLight,
                      borderColor: step.borderColor,
                    }}
                  >
                    {step.stepNumber}
                  </span>

                  {/* Icon Badge */}
                  <div className="relative mb-6">
                    <div
                      className="w-20 h-20 rounded-full bg-white border-2 flex items-center justify-center shadow-[0_8px_24px_rgba(20,38,28,0.06)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_28px_rgba(244,123,58,0.18)]"
                      style={{ borderColor: step.borderColor }}
                    >
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300"
                        style={{ backgroundColor: step.bgLight }}
                      >
                        <IconComponent
                          className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="w-full bg-white rounded-3xl p-6 border border-[#EDE7DA] shadow-[0_4px_20px_rgba(20,38,28,0.03)] transition-all duration-300 group-hover:shadow-[0_10px_28px_rgba(20,38,28,0.08)] group-hover:-translate-y-1 flex-1 flex flex-col justify-start">
                    <h3 className="text-lg font-black text-[#14261C] mb-2 group-hover:text-[#F47B3A] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#556658] leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Layout (Vertical Timeline) */}
        <div className="lg:hidden relative max-w-lg mx-auto">
          {/* Vertical Connecting Track & Animated Line */}
          <div
            className="absolute left-[39px] top-6 bottom-6 w-[3px] pointer-events-none z-0"
            aria-hidden="true"
          >
            {/* Neutral dashed track */}
            <div className="w-full h-full border-l-2 border-dashed border-[#E3DCCE]" />

            {/* Scroll-drawn gradient line */}
            <motion.div
              className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#F47B3A] via-[#FFC629] to-[#059669] rounded-full origin-top"
              style={{ scaleY: smoothProgress }}
            />
          </div>

          {/* Vertical Steps */}
          <div className="space-y-6 sm:space-y-8 relative z-10">
            {stepsData.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="flex items-start gap-4 sm:gap-5 group"
                >
                  {/* Icon Badge */}
                  <div
                    className="w-20 h-20 shrink-0 rounded-full bg-white border-2 flex items-center justify-center shadow-sm relative z-10 transition-transform duration-200 group-hover:scale-105"
                    style={{ borderColor: step.borderColor }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: step.bgLight }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DA] shadow-xs transition-all duration-200 group-hover:shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-black text-[#14261C] group-hover:text-[#F47B3A] transition-colors">
                        {step.title}
                      </h3>
                      <span
                        className="text-[11px] font-black tracking-wider px-2.5 py-0.5 rounded-full border"
                        style={{
                          color: step.accentColor,
                          backgroundColor: step.bgLight,
                          borderColor: step.borderColor,
                        }}
                      >
                        {step.stepNumber}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#556658] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
