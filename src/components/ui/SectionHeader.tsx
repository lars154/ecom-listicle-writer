import { ReactNode } from 'react';
import { Chip } from './Chip';

interface SectionHeaderProps {
  chipLabel?: string;
  headline: string;
  supporting?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ chipLabel, headline, supporting, align = 'left' }: SectionHeaderProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  };

  return (
    <div className={`flex flex-col gap-3 ${alignClasses[align]}`}>
      {chipLabel && <Chip variant="accent">{chipLabel}</Chip>}
      <h2 className="text-[28px] font-extrabold leading-snug text-text max-w-3xl">
        {headline}
      </h2>
      {supporting && (
        <p className="text-base text-text-muted leading-normal max-w-[520px]">
          {supporting}
        </p>
      )}
    </div>
  );
}


