'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  Clock3,
  UserCheck,
  Dumbbell,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  trainerService,
  TrainerDashboardData,
} from '@/services/trainerService';

export default function TrainerDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] =
    useState<TrainerDashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await trainerService.getDashboard();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || 'Failed to load trainer dashboard'
          );
        }

        setDashboard(response.data);
      } catch (error) {
        console.error('Trainer dashboard error:', error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load trainer dashboard.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner
          label="Loading Trainer Dashboard..."
          size="lg"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-8 bg-forge-900 border-forge-800 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
            <Clock3 className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold font-heading text-white">
            Dashboard Could Not Load
          </h2>

          <p className="text-sm text-forge-400 mt-2">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-semibold transition"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const stats = [
    {
      title: 'Assigned Members',
      value: dashboard.totalMembers,
      subtitle: 'Active members',
      icon: Users,
      iconClass: 'text-blue-400',
      bgClass: 'bg-blue-400/10',
    },
    {
      title: "Today's Sessions",
      value: dashboard.todaySessions,
      subtitle: 'Training sessions',
      icon: CalendarCheck,
      iconClass: 'text-brand-orange',
      bgClass: 'bg-brand-orange/10',
    },
    {
      title: 'Pending Bookings',
      value: dashboard.pendingBookings,
      subtitle: 'Need your attention',
      icon: Clock3,
      iconClass: 'text-amber-400',
      bgClass: 'bg-amber-400/10',
    },
    {
      title: "Today's Attendance",
      value: dashboard.todayAttendance,
      subtitle: 'Members checked in',
      icon: UserCheck,
      iconClass: 'text-emerald-400',
      bgClass: 'bg-emerald-400/10',
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Trainer Dashboard
          </p>

          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white mt-2 uppercase">
            Welcome, {user?.name?.split(' ')[0] || 'Trainer'}
          </h1>

          <p className="text-sm text-forge-400 mt-2 max-w-2xl">
            Manage your members, workouts, training sessions and fitness
            progress from one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/trainer/workouts"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-semibold transition"
          >
            <Dumbbell className="w-4 h-4" />
            Assign Workout
          </Link>

          <Link
            href="/trainer/members"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forge-900 border border-forge-800 hover:border-brand-red/50 text-white text-sm font-semibold transition"
          >
            View Members
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="p-5 bg-forge-900 border-forge-800 hover:border-brand-red/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-forge-400 uppercase tracking-wide">
                    {stat.title}
                  </p>

                  <h2 className="text-3xl font-black text-white mt-2">
                    {stat.value}
                  </h2>

                  <p className="text-xs text-forge-500 mt-2">
                    {stat.subtitle}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgClass} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.iconClass}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold font-heading text-white">
            Quick Actions
          </h2>

          <p className="text-xs text-forge-400 mt-1">
            Frequently used trainer tools
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <QuickAction
            href="/trainer/members"
            icon={<Users className="w-6 h-6" />}
            title="My Members"
            description="View and manage assigned members."
            iconClass="text-blue-400"
            bgClass="bg-blue-400/10"
          />

          <QuickAction
            href="/trainer/workouts"
            icon={<Dumbbell className="w-6 h-6" />}
            title="Workouts"
            description="Create and assign training plans."
            iconClass="text-brand-orange"
            bgClass="bg-brand-orange/10"
          />

          <QuickAction
            href="/trainer/bookings"
            icon={<CalendarCheck className="w-6 h-6" />}
            title="Bookings"
            description="Manage upcoming training sessions."
            iconClass="text-emerald-400"
            bgClass="bg-emerald-400/10"
          />

          <QuickAction
            href="/trainer/progress"
            icon={<TrendingUp className="w-6 h-6" />}
            title="Progress"
            description="Track your members' progress."
            iconClass="text-purple-400"
            bgClass="bg-purple-400/10"
          />
        </div>
      </section>

      {/* Sessions + Attendance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Today's Sessions */}
        <Card className="xl:col-span-2 p-6 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Today&apos;s Sessions
              </h2>

              <p className="text-xs text-forge-400 mt-1">
                Your scheduled training sessions
              </p>
            </div>

            <Link
              href="/trainer/bookings"
              className="text-xs text-brand-orange hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {dashboard.upcomingSessions.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarCheck className="w-10 h-10 mx-auto text-forge-600 mb-3" />

              <p className="text-sm text-forge-300">
                No upcoming sessions
              </p>

              <p className="text-xs text-forge-500 mt-1">
                Your scheduled sessions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-forge-950 border border-forge-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-orange font-bold">
                      {session.memberName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        {session.memberName}
                      </p>

                      <p className="text-xs text-forge-400 mt-0.5">
                        {session.program}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-orange">
                        {session.time}
                      </p>

                      <p className="text-[11px] text-forge-500">
                        Today
                      </p>
                    </div>

                    <span
                      className={`
                        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold
                        ${
                          session.status.toLowerCase() === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }
                      `}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Attendance */}
        <Card className="p-6 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Attendance
              </h2>

              <p className="text-xs text-forge-400 mt-1">
                Today&apos;s member check-ins
              </p>
            </div>

            <UserCheck className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="mt-8 text-center">
            <div className="w-32 h-32 rounded-full border-8 border-emerald-500/20 mx-auto flex items-center justify-center">
              <div>
                <p className="text-3xl font-black text-white">
                  {dashboard.todayAttendance}
                </p>

                <p className="text-xs text-forge-400">
                  Checked In
                </p>
              </div>
            </div>

            <p className="text-sm text-emerald-400 font-semibold mt-5">
              Today&apos;s attendance
            </p>

            <Link
              href="/trainer/attendance"
              className="inline-flex items-center gap-1 mt-4 text-xs text-brand-orange hover:underline"
            >
              Manage attendance
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Member Progress */}
      <Card className="p-6 bg-forge-900 border-forge-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">
              Recent Member Progress
            </h2>

            <p className="text-xs text-forge-400 mt-1">
              Latest updates from your assigned members
            </p>
          </div>

          <Link
            href="/trainer/progress"
            className="text-xs text-brand-orange hover:underline flex items-center gap-1"
          >
            View progress
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {dashboard.recentProgress.length === 0 ? (
          <div className="py-10 text-center">
            <TrendingUp className="w-10 h-10 mx-auto text-forge-600 mb-3" />

            <p className="text-sm text-forge-300">
              No progress updates yet
            </p>

            <p className="text-xs text-forge-500 mt-1">
              Member progress will appear here once available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboard.recentProgress.map((item, index) => (
              <div
                key={`${item.memberName}-${item.metric}-${index}`}
                className="p-4 rounded-xl bg-forge-950 border border-forge-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {item.memberName}
                    </p>

                    <p className="text-xs text-forge-500 mt-1">
                      {item.metric}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-400">
                      {item.progress}
                    </p>

                    <p className="text-[10px] text-forge-500">
                      {item.period}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  iconClass,
  bgClass,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
  bgClass: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-5 h-full bg-forge-900 border-forge-800 hover:border-brand-red/50 hover:-translate-y-1 transition-all duration-200">
        <div
          className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

        <h3 className="text-base font-bold text-white mt-4">
          {title}
        </h3>

        <p className="text-xs text-forge-400 mt-1.5 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-1 text-xs text-brand-orange mt-4">
          Open
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Card>
    </Link>
  );
}