'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_LINKS, BRAND } from '@/lib/constants';
import {
  BarChart3,
  Users,
  UserCheck,
  CreditCard,
  Dumbbell,
  Activity,
  Calendar,
  Clock,
  Receipt,
  Flame,
  ArrowLeft,
  Package,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'w-64 bg-forge-900 border-r border-forge-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 transition-transform duration-300',
        isOpen !== undefined && (isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 fixed lg:sticky')
      )}
    >
      <div>
        {/* Admin Brand Header */}
        <div className="p-6 border-b border-forge-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center shadow-lg shadow-brand-red/30">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider font-heading text-white">
                IRON<span className="text-brand-orange">FORGE</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-brand-orange">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          {ADMIN_NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-heading transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/25'
                    : 'text-forge-300 hover:text-white hover:bg-forge-850/60'
                )}
              >
                {iconMap[item.icon] || <Activity className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to website link */}
      <div className="p-4 border-t border-forge-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase font-heading text-forge-400 hover:text-white hover:bg-forge-850/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Main Site</span>
        </Link>
      </div>
    </aside>
  );
}
