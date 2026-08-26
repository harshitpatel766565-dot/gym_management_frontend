'use client';

import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow' | 'subtle';
  hoverEffect?: boolean;
}

export function Card({
  className,
  variant = 'default',
  hoverEffect = false,
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-forge-900/90 border border-forge-800 text-forge-100 shadow-xl',
    glass: 'bg-forge-900/40 backdrop-blur-xl border border-forge-800/80 text-forge-100 shadow-xl',
    glow: 'bg-forge-900/90 border border-brand-red/30 shadow-forge-glow text-forge-100',
    subtle: 'bg-forge-950/40 border border-forge-850 text-forge-250',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
        variantClasses[variant],
        hoverEffect && 'hover:border-brand-red/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-red/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-bold font-heading text-white tracking-wide', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-forge-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mt-6 pt-4 border-t border-forge-800/60', className)} {...props}>
      {children}
    </div>
  );
}
