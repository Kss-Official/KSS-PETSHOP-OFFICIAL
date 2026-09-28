import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { DogFaceIcon, GroomingIcon, TrainingIcon } from '../icons/PetLineIcons';

interface ServiceArchItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  link: string;
}

const servicesData: ServiceArchItem[] = [
  {
    id: 1,
    title: 'Pet Taxi & Vet 24/7',
    subtitle: 'Emergency & Transport',
    description: 'A plan for ensuring that young pets receive their core vaccinations and urgent medical transport at the appropriate ages.',
    icon: <DogFaceIcon className="w-6 h-6 text-[#EF7C3C]" />,
    imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788896169/8e9541cf-3bdc-4ed9-8979-e137acb9e77b_1.png',
    imageAlt: 'Pet Taxi & Vet Transport with caring pet parent',
    link: '/services',
  },
  {
    id: 2,
    title: 'Pet Grooming',
    subtitle: 'Spa & Wellness',
    description: 'Comprehensive styling, soothing bubble baths, nail trimming, and coat conditioning from certified professional groomers.',
    icon: <GroomingIcon className="w-6 h-6 text-[#EF7C3C]" />,
    imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788797640/service_01_vet_care.jpg',
    imageAlt: 'Pet medical examination and grooming care',
    link: '/services',
  },
  {
    id: 3,
    title: 'Pet Training',
    subtitle: 'Obedience & Fun',
    description: 'Positive reinforcement training, agility courses, and behavioral enrichment designed for happy, well-adjusted companions.',
    icon: <TrainingIcon className="w-6 h-6 text-[#EF7C3C]" />,
    imageUrl: 'https://res.cloudinary.com/vphylrop/image/upload/v1788896174/c1b76666-8097-4311-911e-8b51d62c4739_1.png',
    imageAlt: 'Pet trainer training husky outdoor',
    link: '/services',
  },
];

export const ServicesShowcase: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [leftService, centerService, rightService] = servicesData;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 py-2"
    >
      {/* Section Header */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-[#FCE8DB] text-[#223328] shadow-xs">
          Our Service <span aria-hidden="true">🐾</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14261C] tracking-tight leading-[1.08]">
          Making Memories Around the <span className="text-[#EF7C3C]">World</span>, Together
        </h2>
        <p className="text-sm sm:text-base text-[#5D6F63] font-medium leading-relaxed">
          Compassionate veterinary care, soothing grooming, and certified training crafted for your pet's best life.
        </p>
      </div>

      {/* 3-Column Arch Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start max-w-5xl mx-auto">
        {/* LEFT COLUMN: Outer scroll fade-in -> Floating wrapper -> Inner interactive cards */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0ms' }}
        >
          {/* Pure Floating Container (No hover transforms) */}
          <div className="flex flex-col gap-5 sm:gap-6 animate-float-updown">
            {/* Top Text Card */}
            <Link
              to={leftService.link}
              className="block w-full max-w-[280px] mx-auto group cursor-pointer"
            >
              <div className="w-full h-[260px] bg-white rounded-t-[140px] rounded-b-[24px] p-5 sm:p-6 pt-7 sm:pt-8 border border-[#ECE5D8] shadow-xs group-hover:border-[#E0D6C2] group-hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col items-center text-center justify-center">
                <div className="w-13 h-13 rounded-full bg-[#FFF3EA] border border-[#F5DFC7] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-all duration-300 ease-out shrink-0">
                  {leftService.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#14261C] group-hover:text-[#EF7C3C] transition-all duration-300 ease-out leading-snug mb-1.5">
                  {leftService.title}
                </h3>
                <p className="text-xs text-[#5D6F63] font-medium leading-relaxed max-w-[220px] line-clamp-3">
                  {leftService.description}
                </p>
              </div>
            </Link>

            {/* Bottom Image Card */}
            <Link
              to={leftService.link}
              className="block w-full max-w-[280px] mx-auto group cursor-pointer"
            >
              <div className="relative w-full h-[260px] rounded-t-[24px] rounded-b-[140px] overflow-hidden border border-[#ECE5D8] shadow-xs group-hover:border-[#E0D6C2] group-hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 ease-out bg-[#F4EFE6]">
                <img
                  src={leftService.imageUrl}
                  alt={leftService.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
              </div>
            </Link>
          </div>
        </div>

        {/* CENTER COLUMN: Static (No Float), Image Card on Top, Text Card Below, CTA Button Centered */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '140ms' }}
        >
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* Top Image Card */}
            <Link
              to={centerService.link}
              className="block w-full max-w-[280px] mx-auto group cursor-pointer"
            >
              <div className="relative w-full h-[260px] rounded-t-[140px] rounded-b-[24px] overflow-hidden border border-[#ECE5D8] shadow-xs group-hover:border-[#E0D6C2] group-hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 ease-out bg-[#F4EFE6]">
                <img
                  src={centerService.imageUrl}
                  alt={centerService.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
              </div>
            </Link>

            {/* Bottom Text Card */}
            <Link
              to={centerService.link}
              className="block w-full max-w-[280px] mx-auto group cursor-pointer"
            >
              <div className="w-full h-[260px] bg-white rounded-t-[24px] rounded-b-[140px] p-5 sm:p-6 pb-7 sm:pb-8 border border-[#ECE5D8] shadow-xs group-hover:border-[#E0D6C2] group-hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col items-center text-center justify-center">
                <div className="w-13 h-13 rounded-full bg-[#FFF3EA] border border-[#F5DFC7] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-all duration-300 ease-out shrink-0">
                  {centerService.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#14261C] group-hover:text-[#EF7C3C] transition-all duration-300 ease-out leading-snug mb-1.5">
                  {centerService.title}
                </h3>
                <p className="text-xs text-[#5D6F63] font-medium leading-relaxed max-w-[220px] line-clamp-3">
                  {centerService.description}
                </p>
              </div>
            </Link>

            {/* Centered CTA Button beneath Center Column */}
            <div className="flex justify-center pt-1">
              <Link to="/services">
                <Button
                  variant="orange"
                  size="md"
                  showPaw
                  className="rounded-full px-6 shadow-md"
                >
                  VIEW SERVICES
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Outer scroll fade-in -> Floating wrapper (delayed) -> Inner interactive cards */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '280ms' }}
        >
          {/* Pure Floating Container (No hover transforms) */}
          <div className="flex flex-col gap-5 sm:gap-6 animate-float-updown-delayed">
            {/* Top Text Card */}
            <Link
              to={rightService.link}
              className="block w-full max-w-[280px] mx-auto group cursor-pointer"
            >
              <div className="w-full h-[260px] bg-white rounded-t-[140px] rounded-b-[24px] p-5 sm:p-6 pt-7 sm:pt-8 border border-[#ECE5D8] shadow-xs group-hover:border-[#E0D6C2] group-hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col items-center text-center justify-center">
                <div className="w-13 h-13 rounded-full bg-[#FFF3EA] border border-[#F5DFC7] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-all duration-300 ease-out shrink-0">
                  {rightService.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#14261C] group-hover:text-[#EF7C3C] transition-all duration-300 ease-out leading-snug mb-1.5">
                  {rightService.title}
                </h3>
                <p className="text-xs text-[#5D6F63] font-medium leading-relaxed max-w-[220px] line-clamp-3">
                  {rightService.description}
                </p>
              </div>
            </Link>

            {/* Bottom Image Card */}
            <Link
              to={rightService.link}
              className="block w-full max-w-[280px] mx-auto group cursor-pointer"
            >
              <div className="relative w-full h-[260px] rounded-t-[24px] rounded-b-[140px] overflow-hidden border border-[#ECE5D8] shadow-xs group-hover:border-[#E0D6C2] group-hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 ease-out bg-[#F4EFE6]">
                <img
                  src={rightService.imageUrl}
                  alt={rightService.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
