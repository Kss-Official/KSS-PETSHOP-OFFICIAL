import React from 'react';
import { PawPrint } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'orange' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showPaw?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showPaw = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'group relative inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 ease-out cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 overflow-hidden';

  const variantStyles = {
    primary:
      'bg-[#009E66] hover:bg-[#16241B] text-white border border-[#009E66] hover:border-[#16241B]',
    secondary:
      'bg-white border border-[#E2DCCE] text-[#16241B] hover:bg-[#F8F5EE] hover:border-[#D0C7B5]',
    orange:
      'bg-[#EF7C3C] hover:bg-[#16241B] text-white border border-[#EF7C3C] hover:border-[#16241B]',
    dark:
      'bg-[#16241B] hover:bg-[#009E66] text-white border border-[#16241B] hover:border-[#009E66]',
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
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>

      {showPaw && (
        <span
          className={`relative z-10 inline-flex items-center justify-center shrink-0 rounded-full ${pawSizes[size]} transition-all duration-300 ease-out`}
        >
          {/* Animated Rotating Conic Halo */}
          <span
            className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-spin-slow"
            style={{
              background:
                variant === 'orange'
                  ? 'conic-gradient(transparent, #EF7C3C 40%, transparent 80%)'
                  : 'conic-gradient(transparent, #009E66 40%, transparent 80%)',
            }}
          />

          {/* Inner Paw Circle */}
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
    </button>
  );
};
