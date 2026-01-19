import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  variant?: 'accent' | 'neutral';
}

export function Chip({ children, variant = 'accent' }: ChipProps) {
  const variantClasses = {
    accent: 'bg-accent-muted text-accent border border-accent/30',
    neutral: 'bg-slate-100 border border-slate-300 text-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-[10px] py-[6px] text-xs font-bold uppercase tracking-wider shadow-sm ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

