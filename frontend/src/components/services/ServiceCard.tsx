import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { ReadMoreButton } from '../ui/ReadMoreButton';
import type { ServiceDto } from './services.data';
import { resolveServiceImageUrl, serviceIconsMap } from './services.data';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { usePointerFine } from '../../hooks/usePointerFine';

interface ServiceCardProps {
  service: ServiceDto;
  index?: number;
  isHighlighted?: boolean;
  onBook?: (service: ServiceDto) => void;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index = 0,
  isHighlighted = false,
  onBook: _onBook,
  className = '',
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isPointerFine = usePointerFine();
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Motion Values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth Springs for physics-based 3D tilt
  const springConfig = { damping: 24, stiffness: 300, mass: 0.15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Tilt transforms (-10deg to +10deg)
  const rotateX = useMotionTemplate`${smoothMouseY.get() * -12}deg`;
  const rotateY = useMotionTemplate`${smoothMouseX.get() * 12}deg`;

  const iconConfig = serviceIconsMap[service.name] || {
    icon: Stethoscope,
    bg: 'bg-[#E6F9EC]',
    text: 'text-[#287A41]',
  };
  const IconComponent = iconConfig.icon;
  const imageUrl = resolveServiceImageUrl(service);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReduced || !isPointerFine) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalizing between -0.5 and 0.5 for tilt center
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const enable3D = !prefersReduced && isPointerFine;

  return (
    <div
      style={{ perspective: enable3D ? 1100 : undefined }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        id={`service-card-${service.id}`}
        layout={!prefersReduced}
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: enable3D ? rotateX : 0,
          rotateY: enable3D ? rotateY : 0,
          transformStyle: enable3D ? 'preserve-3d' : undefined,
        }}
        animate={
          enable3D
            ? {
                y: isHovered ? -6 : 0,
                scale: isHovered ? 1.01 : 1,
              }
            : {}
        }
        transition={{
          duration: 0.35,
          delay: prefersReduced ? 0 : index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`relative bg-white rounded-[24px] p-4 border transition-all duration-300 flex flex-col group cursor-pointer select-none ${
          isHighlighted
            ? 'ring-2 ring-[#EF7C3C] border-[#EF7C3C] shadow-lg'
            : isHovered
            ? 'border-[#3FA65C] shadow-[0_16px_36px_-10px_rgba(20,38,28,0.12)]'
            : 'border-[#EDE7D9] shadow-xs'
        } ${className}`}
        onClick={() => navigate(`/services/${service.id}`)}
        role="article"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/services/${service.id}`);
          }
        }}
      >
        {/* Parallax Layer: Top Image Container */}
        <div
          style={{
            transform: enable3D && isHovered ? 'translateZ(24px)' : 'translateZ(0px)',
            transition: 'transform 0.3s ease-out',
          }}
          className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-[#FAF7F2] border border-[#EAE3D2] p-2 mb-3"
        >
          <img
            src={imageUrl}
            alt={service.name}
            loading="lazy"
            className="w-full h-full object-contain rounded-[14px] transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Floating Circular Icon */}
          <div
            style={{
              transform: enable3D && isHovered ? 'translateZ(36px)' : 'translateZ(0px)',
              transition: 'transform 0.35s ease-out',
            }}
            className={`absolute top-3 left-3 w-9 h-9 rounded-full ${iconConfig.bg} ${iconConfig.text} flex items-center justify-center shadow-md border border-white/90 z-20 group-hover:rotate-[8deg] group-hover:scale-110 transition-all duration-300`}
          >
            <IconComponent className="w-4 h-4" />
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            transform: enable3D && isHovered ? 'translateZ(16px)' : 'translateZ(0px)',
            transition: 'transform 0.3s ease-out',
          }}
          className="pt-1 flex flex-col flex-grow"
        >
          <h3 className="text-base font-black text-[#16241B] group-hover:text-[#3FA65C] transition-colors duration-200">
            {service.name}
          </h3>
          <p className="text-xs text-[#556658] font-medium leading-relaxed mt-1.5 mb-4 flex-grow line-clamp-2">
            {service.description || service.tagline}
          </p>

          {/* Action Button */}
          <div
            style={{
              transform: enable3D && isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
              transition: 'transform 0.35s ease-out',
            }}
            className="mt-auto pt-3 flex items-center justify-between border-t border-[#F5EFE4]"
          >
            <ReadMoreButton
              variant="green"
              size="sm"
              to={`/services/${service.id}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              READ MORE
            </ReadMoreButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceCard;
