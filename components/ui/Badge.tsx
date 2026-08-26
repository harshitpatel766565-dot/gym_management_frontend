'use client';

import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'flame' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-forge-800 text-forge-300 border-forge-750',
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-800/40',
    danger: 'bg-red-950/60 text-red-400 border-red-800/40',
    purple: 'bg-purple-950/60 text-purple-450 border-purple-800/40',
    flame: 'bg-brand-red/10 text-brand-red border-brand-red/20 shadow-sm shadow-brand-red/5',
    outline: 'bg-transparent text-forge-350 border-forge-750',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider',
    md: 'px-3 py-1 text-xs uppercase font-bold tracking-wider',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-heading',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
