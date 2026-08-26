'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
      md: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
      lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5',
      xl: 'px-8 py-4 text-lg font-bold rounded-2xl gap-3',
    };

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-orange hover:to-brand-red text-white shadow-lg shadow-brand-red/25 hover:scale-[1.02] active:scale-[0.98] hover:shadow-brand-red/35 transition-all duration-300 border-none',
      secondary:
        'bg-forge-900 hover:bg-forge-850 text-white border border-forge-800 hover:border-forge-700 transition-all duration-350',
      outline:
        'bg-transparent border border-forge-750 hover:border-brand-red hover:bg-brand-red/5 text-forge-300 hover:text-white transition-all duration-300',
      ghost:
        'bg-transparent hover:bg-forge-900 text-forge-300 hover:text-white transition-all duration-300',
      danger:
        'bg-red-650 hover:bg-red-750 text-white shadow-lg shadow-red-950/30 transition-all duration-300',
      glow:
        'bg-white text-forge-950 font-extrabold hover:shadow-forge-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-heading tracking-wide uppercase',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
