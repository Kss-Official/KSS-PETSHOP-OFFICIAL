import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'orange' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#009E66] hover:bg-[#008757] text-white',
    secondary:
      'bg-white border border-[#E2DCCE] text-[#16241B] hover:bg-[#F8F5EE]',
    orange: 'bg-[#009E66] hover:bg-[#008757] text-white',
    dark: 'bg-[#009E66] hover:bg-[#008757] text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm sm:text-base gap-2',
    lg: 'px-8 py-4 text-base sm:text-lg gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
