import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, PawPrint } from 'lucide-react';
import { usePointerFine } from '../../hooks/usePointerFine';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'orange' | 'dark' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  magnetic?: boolean;
  ripple?: boolean;
  arrowSlide?: boolean;
  showPaw?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  magnetic = true,
  ripple = true,
  arrowSlide = false,
  showPaw = false,
  className = '',
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isPointerFine = usePointerFine();
  const prefersReduced = usePrefersReducedMotion();

  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  // Motion values for magnetic pull
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !isPointerFine || prefersReduced || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Constrain magnetic movement to max 12px
    const maxOffset = 12;
    const pullX = Math.max(Math.min(distanceX * 0.35, maxOffset), -maxOffset);
    const pullY = Math.max(Math.min(distanceY * 0.35, maxOffset), -maxOffset);

    mouseX.set(pullX);
    mouseY.set(pullY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !prefersReduced && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const newRipple: RippleEffect = { x: clickX, y: clickY, id: Date.now() };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  };

  const baseStyles =
    'group relative inline-flex items-center justify-center font-bold rounded-full transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-[#009E66] hover:bg-[#16241B] text-white border border-[#009E66] hover:border-[#16241B] focus-visible:ring-[#009E66]',
    secondary:
      'bg-white border border-[#E2DCCE] text-[#16241B] hover:bg-[#F8F5EE] hover:border-[#D0C7B5] focus-visible:ring-[#16241B]',
    orange:
      'bg-[#EF7C3C] hover:bg-[#16241B] text-white border border-[#EF7C3C] hover:border-[#16241B] focus-visible:ring-[#EF7C3C]',
    dark:
      'bg-[#16241B] hover:bg-[#009E66] text-white border border-[#16241B] hover:border-[#009E66] focus-visible:ring-[#16241B]',
    link:
      'bg-transparent text-[#14261C] hover:text-[#059669] border-none shadow-none font-extrabold px-0 py-0',
  };

  const sizeStyles = {
    sm: showPaw ? 'pl-4 pr-1.5 py-1.5 text-xs gap-2' : 'px-4 py-2 text-xs gap-1.5',
    md: showPaw ? 'pl-6 pr-2 py-2 text-sm sm:text-base gap-2.5' : 'px-6 py-3 text-sm sm:text-base gap-2',
    lg: showPaw ? 'pl-8 pr-2.5 py-2.5 text-base sm:text-lg gap-3' : 'px-8 py-4 text-base sm:text-lg gap-2.5',
  };

  const pawSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  };

  return (
    <motion.button
      ref={buttonRef}
      style={{
        x: isPointerFine && !prefersReduced ? x : 0,
        y: isPointerFine && !prefersReduced ? y : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${variant !== 'link' ? sizeStyles[size] : ''} ${className}`}
      {...(props as any)}
    >
      {/* Ripple elements */}
      {ripples.map((rip) => (
        <span
          key={rip.id}
          className="absolute rounded-full pointer-events-none bg-white/40 animate-ping"
          style={{
            top: rip.y,
            left: rip.x,
            width: 20,
            height: 20,
            transform: 'translate(-50%, -50%)',
            animationDuration: '600ms',
          }}
        />
      ))}

      {/* Button content & optional arrow sliding */}
      <span
        className={`relative z-10 inline-flex items-center gap-2 transition-transform duration-200 ${
          arrowSlide ? 'group-hover:-translate-x-0.5' : ''
        }`}
      >
        {children}
        {arrowSlide && (
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </span>

      {/* Paw Icon Option */}
      {showPaw && (
        <span
          className={`relative z-10 inline-flex items-center justify-center shrink-0 rounded-full ${pawSizes[size]} transition-all duration-300 ease-out`}
        >
          <span
            className={`relative z-10 w-full h-full rounded-full bg-white text-[#16241B] flex items-center justify-center shadow-xs transition-all duration-300 ease-out group-hover:scale-110 ${
              variant === 'orange'
                ? 'group-hover:bg-[#EF7C3C] group-hover:text-white'
                : 'group-hover:bg-[#009E66] group-hover:text-white'
            }`}
          >
            <PawPrint
              className={`${iconSizes[size]} fill-current transition-transform duration-300 group-hover:rotate-12`}
            />
          </span>
        </span>
      )}
    </motion.button>
  );
};
