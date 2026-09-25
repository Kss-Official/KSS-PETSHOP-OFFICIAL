import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface RevealGroupProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
  className?: string;
  as?: 'div' | 'section' | 'ul' | 'ol' | 'main';
}

export const RevealGroup: React.FC<RevealGroupProps> = ({
  children,
  staggerDelay = 0.1,
  delayChildren = 0.05,
  once = true,
  amount = 0.25,
  className = '',
  as = 'div',
  ...props
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const MotionComponent = motion[as] as typeof motion.div;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : staggerDelay,
        delayChildren: prefersReduced ? 0 : delayChildren,
      },
    },
  };

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
