import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Headphones, CheckCircle2, Mail, PhoneCall } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Reveal } from '../motion/Reveal';
import { SERVICES_FAQ_DATA } from './services.data';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const ServicesFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(SERVICES_FAQ_DATA[0].id);
  const prefersReduced = usePrefersReducedMotion();

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services-faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Heading & Support Assistance Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <Reveal className="space-y-3">
            <Badge variant="orange" className="inline-flex">
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14261C] tracking-tight leading-[1.1]">
              Got Questions? <span className="text-[#EF7C3C]">We've Got</span> Answers.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6F63] font-medium leading-relaxed">
              Everything you need to know about booking, practitioner standards, in-store hygiene, and appointment scheduling.
            </p>
          </Reveal>

          {/* Quick Help / Direct Support Box */}
          <Reveal className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#EDE7D9] shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F9EC] text-[#287A41] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#14261C]">
                  Need Personalized Help?
                </h4>
                <p className="text-xs text-[#556658] font-medium">
                  Our pet care specialists are on standby
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#556658] leading-relaxed">
              Have specific questions about customized dietary planning, senior pet handling, or specific doctor slots? Reach out directly!
            </p>

            <div className="space-y-2.5 pt-1">
              <a
                href="mailto:support@pawfectly.com?subject=In-Store%20Pet%20Service%20Inquiry"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF6EE] hover:bg-[#F3EDE0] text-[#14261C] border border-[#EDE7D9] text-xs font-bold flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#EF7C3C]" />
                  <span>support@pawfectly.com</span>
                </div>
                <span className="text-[11px] text-[#EF7C3C] group-hover:translate-x-0.5 transition-transform">Email us →</span>
              </a>

              <a
                href="tel:+918007293328"
                className="w-full py-2.5 px-4 rounded-xl bg-[#009E66] hover:bg-[#008757] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Care Helpline</span>
              </a>
            </div>

            {/* Quality Commitments List */}
            <div className="pt-3 border-t border-[#F2ECE1] space-y-2 text-xs font-semibold text-[#556658]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#287A41] shrink-0" />
                <span>100% In-Store Verified Care & Sterilized Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#287A41] shrink-0" />
                <span>Licensed Veterinary Practitioners & Stylists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#287A41] shrink-0" />
                <span>Easy 1-Tap Rescheduling in Profile Manager</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Interactive Accordion List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {SERVICES_FAQ_DATA.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <Reveal
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 bg-white overflow-hidden ${
                  isOpen
                    ? 'border-[#059669] shadow-md'
                    : 'border-[#EDE7D9] shadow-2xs hover:border-[#D5EAD9]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#E6F9EC] text-[#059669]' : 'bg-[#FAF6EE] text-[#88998C]'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-base sm:text-lg font-black text-[#14261C]">
                      {faq.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isOpen ? 'bg-[#E6F9EC] text-[#059669]' : 'bg-[#FAF6EE] text-[#88998C]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                      initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={prefersReduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#556658] font-medium leading-relaxed border-t border-[#F2ECE1]/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
