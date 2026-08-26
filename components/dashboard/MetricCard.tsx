'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface DashboardMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon: React.ReactNode;
  color?: 'red' | 'orange' | 'emerald' | 'blue' | 'purple' | 'amber';
  badge?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtext,
  icon,
  color = 'orange',
  badge,
}: DashboardMetricProps) {
  const colorMap = {
    red: 'bg-brand-red/10 border-brand-red/30 text-brand-red',
    orange: 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange',
    emerald: 'bg-emerald-950/60 border-emerald-800 text-emerald-400',
    blue: 'bg-blue-950/60 border-blue-800 text-blue-400',
    purple: 'bg-purple-950/60 border-purple-800 text-purple-400',
    amber: 'bg-amber-950/60 border-amber-800 text-amber-400',
  };

  return (
    <Card className="p-5 flex flex-col justify-between bg-forge-900/80 border-forge-800">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            {label}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black font-heading text-white tracking-tight">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-forge-400">{unit}</span>}
          </div>
        </div>

        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center', colorMap[color])}>
          {icon}
        </div>
      </div>

      {(subtext || badge) && (
        <div className="mt-4 pt-3 border-t border-forge-800/60 flex items-center justify-between text-xs">
          {subtext && <span className="text-forge-400">{subtext}</span>}
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forge-800 text-forge-300">
              {badge}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
