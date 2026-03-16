import React from 'react';

type StatusVariant = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'NEUTRAL';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ children, variant = 'NEUTRAL' }) => {
  const styles = {
    SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
    ERROR: 'bg-rose-50 text-rose-700 border-rose-200',
    INFO: 'bg-blue-50 text-blue-700 border-blue-200',
    NEUTRAL: 'bg-slate-50 text-slate-700 border-slate-200',
  }[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      {children}
    </span>
  );
};
