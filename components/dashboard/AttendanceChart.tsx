'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, CheckCircle2, XCircle, Sun } from 'lucide-react';
import { AttendanceMonthlySummary } from '@/types/attendance';

export function AttendanceChart({ summary }: { summary: AttendanceMonthlySummary }) {
  const data = [
    { name: 'Present', value: summary.presentCount, color: '#10B981' },
    { name: 'Absent', value: summary.absentCount, color: '#EF4444' },
    { name: 'Holiday', value: summary.holidayCount, color: '#F59E0B' },
  ];

  return (
    <Card className="p-6 bg-forge-900 border-forge-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Consistency Index</span>
          </div>
          <h4 className="text-xl font-bold font-heading text-white mt-1">Monthly Attendance</h4>
        </div>
        <span className="text-2xl font-black font-heading text-emerald-400">
          {summary.attendancePercentage}%
        </span>
      </div>

      <div className="h-48 w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181D',
                borderColor: '#27272E',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-forge-400 font-bold uppercase font-heading">Streak</span>
          <span className="text-lg font-extrabold text-white font-heading">{summary.currentStreakDays} Days</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-forge-800 text-xs text-center">
        <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
          <span className="text-emerald-400 font-bold block">{summary.presentCount} Days</span>
          <span className="text-[10px] text-forge-400">Present</span>
        </div>
        <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/40">
          <span className="text-red-400 font-bold block">{summary.absentCount} Days</span>
          <span className="text-[10px] text-forge-400">Absent</span>
        </div>
        <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
          <span className="text-amber-400 font-bold block">{summary.holidayCount} Days</span>
          <span className="text-[10px] text-forge-400">Holidays</span>
        </div>
      </div>
    </Card>
  );
}
