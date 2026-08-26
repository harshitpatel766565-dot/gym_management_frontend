'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { membershipService } from '@/services/membershipService';
import { attendanceService } from '@/services/attendanceService';
import { WorkoutProgress } from '@/types/user';
import { UserMembership } from '@/types/membership';
import { AttendanceMonthlySummary } from '@/types/attendance';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { WeightProgressChart } from '@/components/dashboard/WeightProgressChart';
import { CaloriesBurnedChart } from '@/components/dashboard/CaloriesBurnedChart';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatINR } from '@/lib/utils';
import {
  Flame,
  Scale,
  Calendar,
  Activity,
  Award,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [progressLogs, setProgressLogs] = useState<WorkoutProgress[]>([]);
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceMonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const [logsRes, memRes, attRes] = await Promise.all([
        userService.getProgressLogs(user.id),
        membershipService.getUserMembership(user.id),
        attendanceService.getMonthlySummary(user.id, 2026, 8),
      ]);
      setProgressLogs(logsRes.data);
      setMembership(memRes.data);
      setAttendanceSummary(attRes.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const currentWeight = user?.profile?.weight || 76.5;
  const currentBMI = user?.profile?.bmi || 24.1;

  return (
    <div className="space-y-8">
      {/* Top Banner: Membership Status Alert & Countdown */}
      {membership ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-forge-900 via-brand-darkRed/25 to-forge-900 border border-brand-red/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/20 text-brand-red flex items-center justify-center font-black text-lg font-heading shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-heading text-white">
                  {membership.plan.name} Tier Membership
                </span>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-xs text-forge-300 mt-0.5">
                Valid until <span className="text-white font-semibold">{formatDate(membership.endDate)}</span> • {membership.daysRemaining} days remaining
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/membership">
              <Button variant="outline" size="sm" className="text-xs border-brand-red/40 hover:bg-brand-red/10">
                Renew / Extend
              </Button>
            </Link>
            <Link href="/membership">
              <Button variant="primary" size="sm" className="text-xs" rightIcon={<Zap className="w-3.5 h-3.5" />}>
                Upgrade to Elite
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-forge-900 via-amber-950/20 to-forge-900 border border-amber-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-lg font-heading shrink-0">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold font-heading text-white block">
                No Active Membership Plan
              </span>
              <p className="text-xs text-forge-300 mt-0.5">
                Join IRONFORGE today to unlock floor entry check-ins, custom workout plans, and elite coaching rosters.
              </p>
            </div>
          </div>
          <Link href="/membership" className="shrink-0">
            <Button variant="primary" size="md" className="shadow-lg shadow-brand-red/20 font-heading tracking-wide uppercase text-xs">
              Buy Membership Plan
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          label="Current Weight"
          value={currentWeight}
          unit="kg"
          subtext="Target: 80.0 kg"
          icon={<Scale className="w-5 h-5" />}
          color="orange"
          badge="-4.7 kg lost"
        />

        <MetricCard
          label="Weekly Calories"
          value="3,840"
          unit="kcal"
          subtext="6 Workouts completed"
          icon={<Flame className="w-5 h-5" />}
          color="red"
          badge="+12% vs last wk"
        />

        <MetricCard
          label="Body Mass Index"
          value={currentBMI}
          subtext="Category: Normal"
          icon={<Activity className="w-5 h-5" />}
          color="emerald"
          badge="Healthy"
        />

        <MetricCard
          label="Monthly Attendance"
          value={attendanceSummary ? `${attendanceSummary.attendancePercentage}%` : '85%'}
          subtext="17 visits this month"
          icon={<Calendar className="w-5 h-5" />}
          color="blue"
          badge="9-Day Streak"
        />
      </div>

      {/* Quick Actions Bar */}
      <QuickActions onCheckInSuccess={loadDashboardData} />

      {/* Middle Split: Today's Workout & Coach Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Today's Workout Routine Checklist */}
        <div className="lg:col-span-2">
          <TodayWorkoutCard />
        </div>

        {/* Assigned Trainer Profile Widget */}
        <div className="space-y-6">
          <Card className="p-6 bg-forge-900 border-forge-800 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-forge-800 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                Assigned Head Coach
              </span>
              <Badge variant="flame">1-on-1</Badge>
            </div>

            <img
              src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300&auto=format&fit=crop&q=80"
              alt="Coach Marcus Vance"
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-brand-red shadow-lg mb-3"
            />
            <h4 className="text-lg font-bold font-heading text-white">Coach Marcus Vance</h4>
            <p className="text-xs text-brand-orange font-semibold">Head Strength &amp; Conditioning</p>
            <p className="text-xs text-forge-400 mt-2 line-clamp-2">
              Next scheduled session: Tomorrow at 07:30 AM (Deadlift technique).
            </p>

            <div className="mt-5 pt-4 border-t border-forge-800 flex gap-2">
              <Link href="/dashboard/bookings" className="flex-1">
                <Button variant="primary" size="sm" className="w-full text-xs">
                  Book Next Session
                </Button>
              </Link>
              <Link href="/trainers/trn-1" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  View Profile
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recharts Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeightProgressChart data={progressLogs} />
        <CaloriesBurnedChart />
      </div>

      {/* Bottom Row: Attendance Breakdown & Goal Status */}
      {attendanceSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AttendanceChart summary={attendanceSummary} />
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 bg-forge-900 border-forge-800 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                      Transformation Milestone
                    </span>
                    <h4 className="text-xl font-bold font-heading text-white mt-1">
                      Target Physique: Lean Muscle Bulk (80kg)
                    </h4>
                  </div>
                  <span className="text-sm font-bold text-brand-orange font-heading">78% Completed</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-forge-950 border border-forge-800 flex justify-between items-center">
                    <span className="text-forge-300">Bench Press Goal: 100kg</span>
                    <span className="text-emerald-400 font-bold">Achieved (100kg PR)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-forge-950 border border-forge-800 flex justify-between items-center">
                    <span className="text-forge-300">Body Fat Goal: 14%</span>
                    <span className="text-brand-orange font-bold">14.5% (0.5% to go)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-forge-950 border border-forge-800 flex justify-between items-center">
                    <span className="text-forge-300">Weekly Consistency: 4+ sessions/wk</span>
                    <span className="text-emerald-400 font-bold">5 sessions completed</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-forge-800 flex justify-between items-center">
                <span className="text-xs text-forge-400">Keep up the intensity, Alex!</span>
                <Link href="/dashboard/progress">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Detailed History
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
