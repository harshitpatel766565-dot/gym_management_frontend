'use client';

import React from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'glow' | 'glass';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <Card variant={variant} className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1 tracking-tight">
            {value}
          </h4>
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-forge-800/80 border border-forge-700/80 flex items-center justify-center text-brand-orange shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-forge-800/60 flex items-center justify-between text-xs">
          {subtitle && <span className="text-forge-400">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold',
                trend.isPositive ? 'text-emerald-400' : 'text-red-400'
              )}
            >
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend.value}% {trend.label || 'vs last month'}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
