import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { usePointerFine } from '../../hooks/usePointerFine';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface HoverCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  yOffset = -8,
  ...props
}) => {
  const isPointerFine = usePointerFine();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div className={`relative ${className}`} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="rest"
      whileHover={isPointerFine ? 'hover' : undefined}
      whileTap={!isPointerFine ? { scale: 0.98 } : undefined}
      variants={{
        rest: {
          y: 0,
          boxShadow: '0 2px 8px -1px rgba(22, 36, 27, 0.05), 0 1px 3px 0 rgba(22, 36, 27, 0.04)',
          transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
        hover: {
          y: yOffset,
          boxShadow: '0 20px 35px -8px rgba(22, 36, 27, 0.12), 0 8px 16px -4px rgba(22, 36, 27, 0.06)',
          transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
      }}
      className={`group relative [&_.card-img]:transition-transform [&_.card-img]:duration-500 [&_.card-img]:ease-out hover:[&_.card-img]:scale-[1.06] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
