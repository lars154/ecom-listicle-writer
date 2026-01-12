'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ToastProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'default';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ children, variant = 'default', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const variantClasses = {
    success: 'border-l-4 border-l-success',
    error: 'border-l-4 border-l-error',
    default: 'border-l-4 border-l-accent',
  };

  const iconColor = {
    success: 'text-success',
    error: 'text-error',
    default: 'text-accent',
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        bg-surface border border-border rounded-md shadow-sm
        px-4 py-3 flex items-start gap-3 max-w-md
        animate-in slide-in-from-bottom-5 fade-in duration-300
        ${variantClasses[variant]}
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${iconColor[variant]}`}>
        {variant === 'success' && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {variant === 'error' && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
        {variant === 'default' && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-sm text-text">
        {children}
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="flex-shrink-0 text-text-muted hover:text-text transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}


