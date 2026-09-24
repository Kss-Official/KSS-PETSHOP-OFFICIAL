import React, { useEffect, useRef, useState } from 'react';
import { useCountUp } from '../../hooks/useCountUp';

export const StatsStrip: React.FC = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const petsCount = useCountUp(25000, 3500, inView);
  const vetsCount = useCountUp(500, 3500, inView);
  const ratingCount = useCountUp(48, 2800, inView);

  const stats = [
    { value: `${petsCount.toLocaleString('en-IN')}+`, label: 'Happy Pets' },
    { value: `${vetsCount.toLocaleString('en-IN')}+`, label: 'Verified Vets' },
    { value: `${(ratingCount / 10).toFixed(1)}★`, label: 'Average Rating' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 md:divide-x md:divide-[#E5DFD0] items-center text-center">
        {stats.map((stat, index) => (
          <div key={index} className="px-4 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#EF7C3C] tracking-tight leading-none">
              {stat.value}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#445548] mt-2 tracking-wide">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
