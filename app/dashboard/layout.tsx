'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { USER_NAV_LINKS } from '@/lib/constants';
import {
  LayoutDashboard,
  Activity,
  Calendar,
  CalendarCheck,
  User,
  Zap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard className="w-4 h-4" />,
  'Progress Tracker': <Activity className="w-4 h-4" />,
  Attendance: <Calendar className="w-4 h-4" />,
  'My Bookings': <CalendarCheck className="w-4 h-4" />,
  'Profile Settings': <User className="w-4 h-4" />,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <LoadingSpinner label="Authenticating Member Session..." size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      {/* Dashboard Top Header Bar */}
      <div className="bg-forge-900/90 border-b border-forge-800 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
                }
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-red shadow-lg shadow-brand-red/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
                    {user.name}
                  </h1>
                  <Badge variant="flame">{user.role}</Badge>
                </div>
                <p className="text-xs text-forge-400 mt-0.5">
                  Member ID: <span className="font-mono text-forge-300">IF-{user.id.slice(-6).toUpperCase()}</span> • Dedicated Athlete
                </p>
              </div>
            </div>

            {/* Active Subscription Pill */}
            <div className="flex items-center gap-3">
              <div className="p-3 px-4 rounded-2xl bg-forge-950 border border-brand-red/30 flex items-center gap-3 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-brand-red/20 text-brand-red flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-forge-400 font-heading block">
                    Current Membership
                  </span>
                  <span className="text-xs font-bold text-white font-heading">
                    Pro Tier (Active)
                  </span>
                </div>
              </div>

              <Link
                href="/membership"
                className="p-3 rounded-2xl bg-brand-red hover:bg-brand-orange text-white text-xs font-bold uppercase font-heading transition-colors shadow-md shadow-brand-red/30 hidden sm:flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Upgrade</span>
              </Link>
            </div>
          </div>

          {/* Subnavigation Bar */}
          <nav className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-forge-800/80 mt-6 pb-1">
            {USER_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-heading transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/25'
                      : 'bg-forge-950/60 border border-forge-800 text-forge-400 hover:text-white hover:border-forge-700'
                  }`}
                >
                  {iconMap[link.name] || <Activity className="w-4 h-4" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Protected Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
