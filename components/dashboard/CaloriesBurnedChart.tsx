'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Flame } from 'lucide-react';

const WEEKLY_CALORIES = [
  { day: 'Mon', calories: 540, duration: 60 },
  { day: 'Tue', calories: 620, duration: 75 },
  { day: 'Wed', calories: 480, duration: 55 },
  { day: 'Thu', calories: 590, duration: 65 },
  { day: 'Fri', calories: 710, duration: 80 },
  { day: 'Sat', calories: 650, duration: 70 },
  { day: 'Sun', calories: 250, duration: 30 }, // Active recovery
];

export function CaloriesBurnedChart() {
  const totalBurned = WEEKLY_CALORIES.reduce((acc, cur) => acc + cur.calories, 0);

  return (
    <Card className="p-6 bg-forge-900 border-forge-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            <Flame className="w-4 h-4 text-brand-red" />
            <span>Energy Output</span>
          </div>
          <h4 className="text-xl font-bold font-heading text-white mt-1">Weekly Calories Burned</h4>
        </div>
        <div className="text-right">
          <span className="text-xl font-black font-heading text-brand-orange">
            {totalBurned.toLocaleString()}
          </span>
          <span className="text-xs text-forge-400 block">kcal this week</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WEEKLY_CALORIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272E" vertical={false} />
            <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181D',
                borderColor: '#27272E',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} kcal`, 'Calories Burned']}
            />
            <Bar dataKey="calories" fill="#FF4500" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
