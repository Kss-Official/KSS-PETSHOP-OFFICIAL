import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type CommonProps = {
  children?: React.ReactNode;
  variant?: 'orange' | 'green';
  shape?: 'pill' | 'rounded';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    to?: undefined;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };

type LinkProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    to?: undefined;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };

type RouterLinkProps = CommonProps & {
  to: string;
  href?: undefined;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export type ReadMoreButtonProps = ButtonProps | LinkProps | RouterLinkProps;

export const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({
  children = 'READ MORE',
  variant = 'orange',
  shape = 'pill',
  size = 'md',
  className = '',
  ...rest
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isHovered || isFocused;

  // Variant color definitions
  const variantConfig = {
    orange: {
      border: 'border-[#F47B3A]/40 group-hover:border-[#F47B3A] group-focus-visible:border-[#F47B3A]',
      bgFill: 'bg-[#F47B3A]',
      initialText: 'text-[#14261C]',
      activeText: 'text-white',
      ring: 'focus-visible:ring-[#F47B3A]',
    },
    green: {
      border: 'border-[#059669]/40 group-hover:border-[#059669] group-focus-visible:border-[#059669]',
      bgFill: 'bg-[#059669]',
      initialText: 'text-[#14261C]',
      activeText: 'text-white',
      ring: 'focus-visible:ring-[#059669]',
    },
  }[variant];

  // Size styling map
  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
  }[size];

  // Shape styling map
  const shapeStyles = shape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const baseContainerClasses = `
    group relative inline-flex items-center justify-center
    font-semibold uppercase tracking-wider
    overflow-hidden select-none border transition-colors duration-300
    outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    cursor-pointer
    ${variantConfig.border}
    ${variantConfig.ring}
    ${shapeStyles}
    ${sizeStyles}
    ${className}
  `.trim();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const innerContent = (
    <>
      {/* 1. Background Fill: Sweeps in from left to right */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 ${variantConfig.bgFill} pointer-events-none transition-transform duration-300 ease-out origin-left`}
        style={{
          transform: prefersReduced
            ? isActive
              ? 'scaleX(1)'
              : 'scaleX(0)'
            : isActive
            ? 'scaleX(1)'
            : 'scaleX(0)',
          transitionDuration: prefersReduced ? '0ms' : '300ms',
        }}
      />

      {/* 2. Slide-in Arrow Icon on the left */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={
          prefersReduced
            ? { opacity: isActive ? 1 : 0, display: isActive ? 'inline-flex' : 'none' }
            : {
                x: isActive ? 0 : -8,
                opacity: isActive ? 1 : 0,
                width: isActive ? 'auto' : 0,
                marginRight: isActive ? 4 : 0,
              }
        }
        transition={{
          duration: 0.2,
          ease: 'easeOut',
          delay: isActive ? 0.05 : 0,
        }}
        className="relative z-10 inline-flex items-center justify-center shrink-0 overflow-hidden"
      >
        <ArrowRight
          className={`w-3.5 h-3.5 transition-colors duration-200 ${
            isActive ? variantConfig.activeText : variantConfig.initialText
          }`}
        />
      </motion.span>

      {/* 3. Text label with smooth color transition */}
      <span
        className={`relative z-10 font-bold transition-colors duration-200 ${
          isActive ? variantConfig.activeText : variantConfig.initialText
        }`}
      >
        {children}
      </span>
    </>
  );

  // Render as React Router Link
  if ('to' in rest && rest.to) {
    const { to, onClick, ...linkProps } = rest as RouterLinkProps;
    return (
      <Link
        to={to}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={baseContainerClasses}
        {...linkProps}
      >
        {innerContent}
      </Link>
    );
  }

  // Render as standard Anchor tag
  if ('href' in rest && rest.href) {
    const { href, onClick, ...anchorProps } = rest as LinkProps;
    return (
      <a
        href={href}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={baseContainerClasses}
        {...anchorProps}
      >
        {innerContent}
      </a>
    );
  }

  // Render as Button element
  const { onClick, type = 'button', disabled, ...buttonProps } = rest as ButtonProps;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`${baseContainerClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...buttonProps}
    >
      {innerContent}
    </button>
  );
};

export default ReadMoreButton;
