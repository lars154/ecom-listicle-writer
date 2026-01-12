import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-background inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-[#6366F1] to-[#3B82F6] text-white hover:-translate-y-0.5 shadow-md hover:shadow-xl hover:from-[#4F46E5] hover:to-[#2563EB] transition-all',
    secondary: 'bg-white border-2 border-border-strong text-text hover:bg-accent-muted hover:border-accent transition-all',
    ghost: 'bg-transparent text-text-muted hover:text-accent hover:bg-accent-muted transition-all',
    success: 'bg-success text-white hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all',
  };
  
  const sizeClasses = {
    sm: 'px-[14px] py-2 text-sm h-10',
    md: 'px-[18px] py-3 text-base h-11',
    lg: 'px-[22px] py-3 text-base h-12',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

