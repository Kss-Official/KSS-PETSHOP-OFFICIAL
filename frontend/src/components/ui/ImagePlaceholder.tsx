import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  label: string;
  className?: string;
  src?: string;
  alt?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  label,
  className = '',
  src,
  alt = label,
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-full bg-[#E5E5E5] border-2 border-dashed border-[#B8B8B8] rounded-[inherit] flex flex-col items-center justify-center p-4 text-center select-none text-[#555555] transition-all hover:bg-[#DEDEDE] ${className}`}
      title={label}
    >
      <ImageIcon className="w-8 h-8 mb-2 text-[#777777] stroke-[1.5]" />
      <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#444444] max-w-[90%] leading-tight">
        {label}
      </span>
    </div>
  );
};
