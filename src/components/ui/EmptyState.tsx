import { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function EmptyState({ icon, title, description, ctaLabel, onCtaClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {/* Icon Container */}
      <div className="w-14 h-14 rounded-lg bg-accent-muted flex items-center justify-center mb-6">
        <div className="text-accent w-7 h-7">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-[22px] font-extrabold text-text mb-3">
        {title}
      </h3>
      <p className="text-base text-text-muted leading-normal max-w-md mb-6">
        {description}
      </p>

      {/* CTA */}
      {ctaLabel && onCtaClick && (
        <Button variant="primary" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}


