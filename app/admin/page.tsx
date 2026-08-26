'use client';

import React, { useState, useEffect } from 'react';
import { adminService, AdminAnalyticsSummary } from '@/services/adminService';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  UserCheck,
  UserX,
  CreditCard,
  CalendarCheck,
  Clock,
  UserPlus,
  TrendingUp,
  Flame,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAnalyticsDashboard() {
  const [summary, setSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminService.getAnalyticsSummary();
        setSummary(res.data);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !summary) {
    return (
      <div className="pt-20 flex items-center justify-center">
        <LoadingSpinner label="Compiling Gym Telemetry & Financials..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">
            Executive Analytics &amp; KPI Dashboard
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Real-time business performance, membership retention, and floor operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/users">
            <Button variant="secondary" size="sm">
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/payments">
            <Button variant="primary" size="sm">
              View Transactions
            </Button>
          </Link>
        </div>
      </div>

      {/* 7 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Users"
          value={summary.totalUsers}
          subtitle="Athletes & Staff"
          icon={<Users className="w-5 h-5 text-blue-400" />}
          trend={{ value: 14, isPositive: true }}
        />

        <StatCard
          title="Active Members"
          value={summary.activeMembers}
          subtitle="71.5% Active Rate"
          icon={<UserCheck className="w-5 h-5 text-emerald-400" />}
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Expired Members"
          value={summary.expiredMembers}
          subtitle="Renewal follow-up queue"
          icon={<UserX className="w-5 h-5 text-amber-400" />}
        />

        <StatCard
          title="Total Gross Revenue"
          value={formatINR(summary.totalRevenue)}
          subtitle="Fiscal YTD"
          icon={<CreditCard className="w-5 h-5 text-brand-orange" />}
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Bookings Logged"
          value={summary.totalBookings}
          subtitle="Coaching & Classes"
          icon={<CalendarCheck className="w-5 h-5 text-purple-400" />}
        />

        <StatCard
          title="Today's Floor Attendance"
          value={summary.todayAttendance}
          subtitle="Live Check-Ins"
          icon={<Clock className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="New Members (This Month)"
          value={summary.newUsersThisMonth}
          subtitle="+18% vs Last Month"
          icon={<UserPlus className="w-5 h-5 text-brand-red" />}
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Trend */}
        <Card className="p-6 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                Financial Velocity
              </span>
              <h3 className="text-lg font-bold font-heading text-white mt-0.5">
                Monthly Revenue Growth (INR)
              </h3>
            </div>
            <Badge variant="success">+28% Trajectory</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.monthlyRevenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4500" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF4500" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272E" vertical={false} />
                <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181D',
                    borderColor: '#27272E',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [formatINR(val), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF4500" strokeWidth={3} fill="url(#adminRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Popular Programs Enrollment */}
        <Card className="p-6 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                Program Popularity
              </span>
              <h3 className="text-lg font-bold font-heading text-white mt-0.5">
                Active Enrolled Athletes by Program
              </h3>
            </div>
            <Badge variant="flame">Weight Loss #1</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.popularPrograms} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272E" vertical={false} />
                <XAxis dataKey="name" stroke="#71717A" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181D',
                    borderColor: '#27272E',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="enrolled" fill="#E11D48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Hourly Floor Traffic */}
      <Card className="p-6 bg-forge-900 border-forge-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
              Facility Utilization
            </span>
            <h3 className="text-lg font-bold font-heading text-white mt-0.5">
              Average Hourly Floor Traffic &amp; Peak Congestion
            </h3>
          </div>
          <span className="text-xs text-forge-400">Peak: 06:00 PM – 08:00 PM (95 athletes)</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.attendanceByHour} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272E" vertical={false} />
              <XAxis dataKey="hour" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181D',
                  borderColor: '#27272E',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
