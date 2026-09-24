import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OdometerProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const DigitWheel: React.FC<{ digit: string }> = ({ digit }) => {
  if (isNaN(Number(digit))) {
    return <span>{digit}</span>;
  }

  const num = Number(digit);

  return (
    <div className="relative inline-flex h-[1.15em] w-[0.62em] overflow-hidden leading-none align-middle">
      <motion.div
        key={num}
        initial={{ y: '80%', opacity: 0.2 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-80%', opacity: 0.2 }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className="flex flex-col items-center absolute inset-x-0 top-0"
      >
        <span className="inline-block">{num}</span>
      </motion.div>
    </div>
  );
};

export const Odometer: React.FC<OdometerProps> = ({
  value,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const digits = value.toLocaleString().split('');

  return (
    <span className={`inline-flex items-center font-bold select-none ${className}`}>
      {prefix && <span>{prefix}</span>}
      <AnimatePresence mode="popLayout" initial={false}>
        {digits.map((char, index) => (
          <DigitWheel key={`${digits.length - index}-${char}`} digit={char} />
        ))}
      </AnimatePresence>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};

export default Odometer;
