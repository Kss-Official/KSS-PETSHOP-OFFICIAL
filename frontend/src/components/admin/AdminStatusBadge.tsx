import React from 'react';

export type StatusType =
  | 'ACTIVE' | 'COMPLETED' | 'CONFIRMED' | 'PAID' | 'Active' | 'Completed' | 'Confirmed' | 'Paid'
  | 'PENDING' | 'READY_FOR_PICKUP' | 'DRAFT' | 'UNPAID' | 'Pending' | 'Ready for Pickup' | 'Draft' | 'Unpaid'
  | 'CANCELLED' | 'INACTIVE' | 'FAILED' | 'DEACTIVATED' | 'Cancelled' | 'Inactive' | 'Failed' | 'Deactivated'
  | 'PROCESSING' | 'INFO' | 'PLACED' | 'Processing' | 'Info' | 'Placed'
  | string;

interface AdminStatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = String(status || '').toUpperCase().replace(/\s+/g, '_');

  let colorClasses = 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]';

  if (['ACTIVE', 'COMPLETED', 'CONFIRMED', 'PAID', 'TRUE'].includes(normalized)) {
    colorClasses = 'bg-[#EBF7EE] text-[#3FA65C] border-[#C3E8CC]';
  } else if (['PENDING', 'UNPAID', 'READY_FOR_PICKUP', 'DRAFT'].includes(normalized)) {
    colorClasses = 'bg-[#FEF3EC] text-[#EF7C3C] border-[#FCD8C1]';
  } else if (['CANCELLED', 'FAILED'].includes(normalized)) {
    colorClasses = 'bg-[#FDEDEC] text-[#C0392B] border-[#FADBD8]';
  } else if (['INACTIVE', 'DEACTIVATED', 'FALSE'].includes(normalized)) {
    colorClasses = 'bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB]';
  } else if (['PROCESSING', 'INFO', 'PLACED'].includes(normalized)) {
    colorClasses = 'bg-[#EFF6FF] text-[#3B7DD8] border-[#BFDBFE]';
  }

  const formatLabel = (s: string) => {
    if (s === 'READY_FOR_PICKUP') return 'Ready for Pickup';
    if (s === 'TRUE') return 'Active';
    if (s === 'FALSE') return 'Inactive';
    return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[78px] px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
      <span>{formatLabel(String(status))}</span>
    </span>
  );
};
