import { ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  align?: 'left' | 'center';
}

export function FeatureItem({ icon, title, description, align = 'left' }: FeatureItemProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  };

  return (
    <div className={`flex flex-col gap-4 ${alignClasses[align]}`}>
      {/* Icon Container */}
      <div className="w-11 h-11 rounded-md bg-accent-muted flex items-center justify-center flex-shrink-0">
        <div className="text-accent w-6 h-6">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 ${alignClasses[align]}`}>
        <h3 className="text-[22px] font-extrabold text-text">
          {title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}


