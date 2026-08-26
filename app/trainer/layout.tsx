'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarCheck,
  ClipboardCheck,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/trainer',
    icon: LayoutDashboard,
  },
  {
    label: 'My Members',
    href: '/trainer/members',
    icon: Users,
  },
  {
    label: 'Workouts',
    href: '/trainer/workouts',
    icon: Dumbbell,
  },
  {
    label: 'Bookings',
    href: '/trainer/bookings',
    icon: CalendarCheck,
  },
  {
    label: 'Attendance',
    href: '/trainer/attendance',
    icon: ClipboardCheck,
  },
  {
    label: 'Progress',
    href: '/trainer/progress',
    icon: TrendingUp,
  },
  {
    label: 'Profile',
    href: '/trainer/profile',
    icon: User,
  },
];

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }

      if (user?.role !== 'trainer') {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-forge-950 flex items-center justify-center">
        <LoadingSpinner
          label="Authenticating Trainer..."
          size="lg"
        />
      </div>
    );
  }

  if (!user || user.role !== 'trainer') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-forge-950 text-forge-100">
      {/* Mobile top bar */}
      <div className="lg:hidden h-16 bg-forge-900 border-b border-forge-800 flex items-center justify-between px-4 sticky top-0 z-50">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-forge-900 border border-forge-800 text-forge-400 hover:text-white flex items-center justify-center"
          aria-label="Open trainer menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="text-lg font-black font-heading text-white">
          IRON<span className="text-[#FF6B00]">FORGE</span>
        </div>

        <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 flex items-center justify-center font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-forge-900 border-r border-forge-800
          transform transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 px-6 border-b border-forge-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black font-heading tracking-wider text-white">
                IRON<span className="text-brand-orange">FORGE</span>
              </h1>

              <p className="text-[10px] text-forge-400 uppercase tracking-[0.2em] mt-1">
                Trainer Panel
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-9 h-9 rounded-lg bg-forge-900 border border-forge-800 text-forge-400 flex items-center justify-center"
              aria-label="Close trainer menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Trainer info */}
          <div className="p-5 border-b border-forge-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-white truncate">
                  {user.name}
                </p>

                <p className="text-xs text-forge-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-3 inline-flex px-2.5 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-[10px] text-brand-red uppercase tracking-wider font-bold">
              Trainer
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === '/trainer'
                  ? pathname === '/trainer'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-250
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/20'
                        : 'text-forge-400 hover:text-white hover:bg-forge-850/60'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-forge-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-forge-400 hover:text-white hover:bg-forge-850/60 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-72 min-h-screen">
        {/* Desktop header */}
        <header className="hidden lg:flex h-20 bg-forge-900 border-b border-forge-800 items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <p className="text-xs text-forge-400 uppercase tracking-widest">
              IRONFORGE
            </p>

            <h2 className="text-lg font-bold font-heading text-white">
              Trainer Workspace
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {user.name}
              </p>

              <p className="text-xs text-forge-400">
                Trainer
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-5 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}