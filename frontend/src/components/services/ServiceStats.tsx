import React from 'react';
import { CountUp } from '../motion/CountUp';
import { RevealGroup } from '../motion/RevealGroup';
import { motion } from 'framer-motion';
import { fadeUpVariant } from '../../lib/motion';

export const ServiceStats: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#EDE7D9] shadow-xs">
        <RevealGroup
          staggerDelay={0.12}
          amount={0.2}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x md:divide-[#E5DFD0] items-center text-center"
        >
          {/* Stat 1: 25,000+ */}
          <motion.div variants={fadeUpVariant} className="px-4 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F47B3A] tracking-tight leading-none">
              <CountUp
                to={25000}
                duration={1.8}
                suffix="+"
                formatter={(val) => Math.round(val).toLocaleString('en-IN')}
              />
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#445548] mt-2.5 tracking-wide">
              Happy Pets Treated
            </span>
          </motion.div>

          {/* Stat 2: 500+ */}
          <motion.div variants={fadeUpVariant} className="px-4 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F47B3A] tracking-tight leading-none">
              <CountUp
                to={500}
                duration={1.8}
                suffix="+"
                formatter={(val) => Math.round(val).toLocaleString('en-IN')}
              />
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#445548] mt-2.5 tracking-wide">
              Verified Practitioners
            </span>
          </motion.div>

          {/* Stat 3: 4.8★ */}
          <motion.div variants={fadeUpVariant} className="px-4 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F47B3A] tracking-tight leading-none">
              <CountUp
                to={4.8}
                duration={1.8}
                decimals={1}
                suffix="★"
              />
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#445548] mt-2.5 tracking-wide">
              Average Client Rating
            </span>
          </motion.div>

          {/* Stat 4: 24/7 Support */}
          <motion.div variants={fadeUpVariant} className="px-4 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F47B3A] tracking-tight leading-none">
              24/7
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#445548] mt-2.5 tracking-wide">
              Emergency Assistance
            </span>
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  );
};
