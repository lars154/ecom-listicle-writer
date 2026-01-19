import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 h-11 bg-white border-2 rounded-sm text-text placeholder:text-text-subtle transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-accent
            hover:border-accent/50
            disabled:opacity-60 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error/35' : 'border-border'}
            ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-text-muted">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

