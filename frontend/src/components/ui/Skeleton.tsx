import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={clsx('animate-pulse rounded-2xl bg-[#EAE3D2]/70', className)}
      {...props}
    />
  );
};

export default Skeleton;
