'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WorkoutProgress } from '@/types/user';
import { formatDate } from '@/lib/utils';
import { TrendingDown, Scale } from 'lucide-react';

export function WeightProgressChart({ data }: { data: WorkoutProgress[] }) {
  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    weight: d.weight,
    bodyFat: d.bodyFatPercentage || 0,
  }));

  const initialWeight = data.length > 0 ? data[0].weight : 0;
  const currentWeight = data.length > 0 ? data[data.length - 1].weight : 0;
  const diff = parseFloat((currentWeight - initialWeight).toFixed(1));

  return (
    <Card className="p-6 bg-forge-900 border-forge-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            <Scale className="w-4 h-4 text-brand-orange" />
            <span>Body Weight Trend</span>
          </div>
          <h4 className="text-xl font-bold font-heading text-white mt-1">Weight Progress (kg)</h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold font-heading flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            {diff < 0 ? `${diff} kg` : `+${diff} kg`}
          </span>
          <span className="text-xs text-forge-400">Total Change</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E11D48" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272E" vertical={false} />
            <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#71717A" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181D',
                borderColor: '#27272E',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}
              formatter={(value: number) => [`${value} kg`, 'Weight']}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#E11D48"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#weightGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
