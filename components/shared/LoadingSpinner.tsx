'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingSpinner({
  className,
  label = 'Loading IRONFORGE...',
  size = 'md',
}: {
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-12 gap-3 text-forge-400', className)}>
      <Loader2 className={cn('animate-spin text-brand-orange', sizeClasses[size])} />
      {label && <p className="text-xs uppercase font-bold tracking-widest font-heading">{label}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-forge-800 rounded-3xl bg-forge-950/40 my-6">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-forge-900 border border-forge-800 flex items-center justify-center text-forge-400 mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-lg font-bold font-heading text-white tracking-wide">{title}</h4>
      {description && <p className="text-sm text-forge-400 max-w-sm mt-1 mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
