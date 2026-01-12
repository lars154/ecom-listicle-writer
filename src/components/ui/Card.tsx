import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-surface/95 backdrop-blur-sm border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

