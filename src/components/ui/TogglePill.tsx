import { ReactNode } from 'react';

interface TogglePillProps {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function TogglePill({ children, selected, onClick, disabled = false }: TogglePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-[14px] py-[10px] text-sm rounded-sm border-2 transition-all duration-200 text-left font-semibold
        focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-background
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          selected
            ? 'bg-accent-muted border-accent text-accent shadow-sm'
            : 'bg-white border-border text-text-muted hover:bg-accent-muted/30 hover:border-accent/50 hover:text-text'
        }`}
    >
      {children}
    </button>
  );
}

