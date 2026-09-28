import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  formatter?: (val: number) => string;
  className?: string;
  once?: boolean;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.8,
  suffix = '',
  prefix = '',
  decimals = 0,
  formatter,
  className = '',
  once = true,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (formatter) return formatter(from);
    return from.toFixed(decimals);
  });
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once, margin: '0px 0px -50px 0px' });
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (prefersReduced) {
      if (formatter) {
        setDisplayValue(formatter(to));
      } else {
        setDisplayValue(
          decimals > 0
            ? to.toFixed(decimals)
            : to.toLocaleString('en-IN')
        );
      }
      return;
    }

    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (formatter) {
          setDisplayValue(formatter(latest));
        } else if (decimals > 0) {
          setDisplayValue(latest.toFixed(decimals));
        } else {
          setDisplayValue(Math.round(latest).toLocaleString('en-IN'));
        }
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration, decimals, formatter, prefersReduced]);

  return (
    <span ref={ref} className={`tabular-nums inline-block ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
