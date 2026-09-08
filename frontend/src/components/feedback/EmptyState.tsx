import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLink?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionLink,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#FAF6EE] rounded-3xl p-8 sm:p-12 text-center border border-[#EAE3D2] flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-white border border-[#E5DFCE] flex items-center justify-center text-[#3FA65C] shadow-xs">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="text-lg sm:text-xl font-black text-[#16241B]">{title}</h3>
        <p className="text-xs sm:text-sm text-[#556658] font-medium leading-relaxed max-w-md">
          {description}
        </p>
      </div>
      {actionLabel && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center justify-center font-black rounded-full transition-all duration-200 cursor-pointer text-xs sm:text-sm px-5 py-2.5 bg-[#009E66] hover:bg-[#008757] text-white shadow-xs"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <Button variant="primary" size="md" onClick={onAction} className="shadow-xs">
              {actionLabel}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
