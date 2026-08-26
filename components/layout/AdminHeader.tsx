'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { Menu, ShieldAlert, LogOut } from 'lucide-react';
import Link from 'next/link';

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-forge-900 border-b border-forge-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-forge-900 border border-forge-800 text-forge-400 hover:text-white hover:bg-forge-800"
            aria-label="Toggle admin sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
            Live Gym Floor • System Nominal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter />

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-forge-800">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-brand-red"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white font-heading truncate max-w-[120px]">
                {user.name}
              </p>
              <span className="text-[10px] text-brand-orange font-bold uppercase">System Admin</span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-forge-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
