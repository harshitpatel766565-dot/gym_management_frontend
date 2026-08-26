'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { attendanceService } from '@/services/attendanceService';
import { AttendanceMonthlySummary, AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Sun,
  QrCode,
  Zap,
  Flame,
  Award,
  Clock,
} from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [summary, setSummary] = useState<AttendanceMonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const loadAttendance = async () => {
    if (!user) return;
    try {
      const res = await attendanceService.getMonthlySummary(user.id, 2026, 8);
      setSummary(res.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const handleCheckIn = async () => {
    if (!user) return;
    setIsCheckingIn(true);
    try {
      const res = await attendanceService.checkInToday(user.id, user.name);
      success('Check-in Logged!', res.message);
      loadAttendance();
    } catch {
      info('Notice', 'Already checked in for today.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="pt-20 flex items-center justify-center">
        <LoadingSpinner label="Loading Attendance Logs..." />
      </div>
    );
  }

  // Generate 31-day calendar cells for August
  const daysInMonth = 31;
  const calendarCells = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;
    const dateStr = `2026-08-${dayNumber < 10 ? `0${dayNumber}` : dayNumber}`;
    const record = summary.records.find((r) => r.date === dateStr);
    const isToday = dayNumber === 20;

    let status: AttendanceStatus | 'upcoming' = record ? record.status : dayNumber > 20 ? 'upcoming' : 'absent';

    return {
      dayNumber,
      dateStr,
      record,
      status,
      isToday,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Gym Attendance &amp; Check-In
          </h2>
          <p className="text-xs text-forge-400 mt-0.5">
            Maintain your training streak and monitor monthly attendance consistency.
          </p>
        </div>

        <Button
          onClick={handleCheckIn}
          isLoading={isCheckingIn}
          variant="primary"
          size="md"
          leftIcon={<QrCode className="w-4 h-4" />}
        >
          Instant QR Check-In
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Total Visits
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black font-heading text-white mt-2">
            {summary.presentCount}
          </p>
          <span className="text-xs text-forge-400">out of {summary.totalDays} sessions</span>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Consistency Index
            </span>
            <Zap className="w-5 h-5 text-brand-orange" />
          </div>
          <p className="text-3xl font-black font-heading text-brand-orange mt-2">
            {summary.attendancePercentage}%
          </p>
          <span className="text-xs text-emerald-400 font-semibold">Elite Tier Habit</span>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Current Streak
            </span>
            <Flame className="w-5 h-5 text-brand-red animate-pulse" />
          </div>
          <p className="text-3xl font-black font-heading text-brand-red mt-2">
            {summary.currentStreakDays} Days
          </p>
          <span className="text-xs text-forge-400">Unbroken training streak</span>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Longest Streak
            </span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black font-heading text-amber-400 mt-2">
            {summary.longestStreakDays} Days
          </p>
          <span className="text-xs text-forge-400">All-time personal record</span>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="p-8 bg-forge-900 border-forge-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forge-800">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-brand-orange" />
            <div>
              <h3 className="text-xl font-bold font-heading text-white uppercase">
                August 2026 Attendance
              </h3>
              <p className="text-xs text-forge-400">Real-time floor check-in logs</p>
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Absent
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Holiday
            </span>
            <span className="flex items-center gap-1.5 text-forge-500">
              <span className="w-2.5 h-2.5 rounded-full bg-forge-800" /> Upcoming
            </span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {calendarCells.map((cell) => {
            const isPresent = cell.status === 'present';
            const isAbsent = cell.status === 'absent';
            const isHoliday = cell.status === 'holiday';

            return (
              <div
                key={cell.dayNumber}
                className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all flex flex-col justify-between min-h-[75px] sm:min-h-[90px] ${
                  cell.isToday
                    ? 'ring-2 ring-brand-orange bg-forge-900 border-brand-orange'
                    : isPresent
                    ? 'bg-emerald-950/25 border-emerald-800/40 text-emerald-300'
                    : isAbsent
                    ? 'bg-red-950/15 border-red-900/30 text-red-400'
                    : isHoliday
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                    : 'bg-forge-950/60 border-forge-800 text-forge-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold font-heading">{cell.dayNumber}</span>
                  {cell.isToday && (
                    <span className="text-[9px] font-extrabold uppercase bg-brand-orange text-black px-1.5 py-0.2 rounded">
                      Today
                    </span>
                  )}
                </div>

                <div className="text-[10px] truncate">
                  {isPresent && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">{cell.record?.checkInTime}</span>
                    </span>
                  )}
                  {isHoliday && <span className="text-amber-400 font-medium">Holiday</span>}
                  {isAbsent && <span className="text-red-400/80 font-medium">Rest Day</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
