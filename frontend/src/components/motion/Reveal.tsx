import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { EASE, DURATIONS } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'span' | 'p' | 'header' | 'footer';
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 28,
  once = true,
  amount = 0.25,
  className = '',
  as = 'div',
  ...props
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const MotionComponent = motion[as] as typeof motion.div;

  if (prefersReduced) {
    return (
      <MotionComponent
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, amount }}
        transition={{ duration: DURATIONS.base, delay }}
        className={className}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: DURATIONS.base,
        ease: EASE,
        delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
