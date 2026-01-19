import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-surface border border-border text-text-muted',
    accent: 'bg-accent-muted text-accent',
    success: 'bg-success-muted text-success',
    warning: 'bg-warning-muted text-warning',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}

