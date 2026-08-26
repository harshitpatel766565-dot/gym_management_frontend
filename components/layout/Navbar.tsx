'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NAV_LINKS, BRAND } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { QuickSearchModal } from './QuickSearchModal';
import {
  Flame,
  Menu,
  X,
  Search,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  Calculator,
  Info,
  Dumbbell,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAIN_NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Programs', href: '/programs' },
  { name: 'Trainers', href: '/trainers' },
  { name: 'Membership', href: '/membership' },
  { name: 'Contact', href: '/contact' },
];

const MORE_NAV_LINKS = [
  { name: 'About', href: '/about', icon: Info },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Calculators', href: '/calculators', icon: Calculator },
  { name: 'Products', href: '/products', icon: Package },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-350 border-b py-3.5 ${
          isScrolled
            ? 'bg-forge-950/80 border-forge-800/80 backdrop-blur-xl shadow-2xl shadow-black/25'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center shadow-lg shadow-brand-red/30 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-wider font-heading text-white flex items-center gap-1">
                IRON<span className="text-brand-red">FORGE</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-forge-400 font-bold -mt-1 hidden sm:block">
                Elite Gym & Fitness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {MAIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs 2xl:text-sm font-semibold tracking-wide uppercase font-heading transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-brand-red to-brand-orange shadow-md shadow-brand-red/20'
                      : 'text-forge-300 hover:text-white hover:bg-forge-900/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs 2xl:text-sm font-semibold tracking-wide uppercase font-heading transition-all duration-300 cursor-pointer ${
                  MORE_NAV_LINKS.some((link) => pathname === link.href)
                    ? 'text-white bg-gradient-to-r from-brand-red to-brand-orange shadow-md shadow-brand-red/20'
                    : 'text-forge-300 hover:text-white hover:bg-forge-900/60'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMoreDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-48 rounded-xl bg-forge-900 border border-forge-800 shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      {MORE_NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMoreDropdownOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase font-heading transition-colors ${
                              isActive
                                ? 'bg-brand-red text-white'
                                : 'text-forge-300 hover:text-white hover:bg-forge-800'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-brand-orange" />
                            <span>{link.name}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Icons & Auth (Desktop only) */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-xl border border-forge-800 bg-forge-900/40 hover:bg-forge-900 hover:text-white text-forge-300 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
              title="Search (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-forge-400" />
              <span className="hidden xl:inline text-forge-300">Search</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] bg-forge-950 rounded border border-forge-800 text-forge-400">
                ⌘K
              </kbd>
            </button>

            {/* Notification Center */}
            {isAuthenticated && <NotificationCenter />}

            {/* User Auth Buttons or Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-forge-900/80 border border-forge-800 hover:border-forge-700 transition-all cursor-pointer"
                >
                  <img
                    src={
                      user.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        user.name
                      )}`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-red/40"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-white font-heading leading-tight truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-brand-orange tracking-wider">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-forge-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-forge-900 border border-forge-800 shadow-2xl p-2 z-50 overflow-hidden"
                      >
                        <div className="px-3 py-2 border-b border-forge-800/85 mb-1">
                          <p className="text-sm font-bold text-white font-heading truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-forge-450 truncate">{user.email}</p>
                        </div>

                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold uppercase font-heading text-amber-500 hover:bg-amber-950/40 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold uppercase font-heading text-forge-300 hover:text-white hover:bg-forge-850 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                          <span>Member Dashboard</span>
                        </Link>

                        <Link
                          href="/dashboard/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold uppercase font-heading text-forge-300 hover:text-white hover:bg-forge-850 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-blue-400" />
                          <span>Profile & Goals</span>
                        </Link>

                        <div className="border-t border-forge-800/80 my-1 pt-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold uppercase font-heading text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/membership">
                  <Button variant="primary" size="sm">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions & Menu Toggle (below xl) */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-xl border border-forge-800 bg-forge-900/40 hover:bg-forge-900 text-forge-300 transition-all cursor-pointer flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Center on Mobile/Tablet */}
            {isAuthenticated && <NotificationCenter />}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-forge-900 border border-forge-800 text-forge-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-forge-950/98 backdrop-blur-2xl border-b border-forge-850 px-6 py-6 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-bold uppercase font-heading tracking-wide ${
                      pathname === link.href
                        ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/20'
                        : 'text-forge-300 hover:text-white hover:bg-forge-900/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-forge-800 space-y-3">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-forge-900/50 border border-forge-800">
                        <img
                          src={
                            user.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-brand-red/40"
                        />
                        <div>
                          <p className="font-bold text-white font-heading">{user.name}</p>
                          <p className="text-xs text-forge-450">{user.email}</p>
                        </div>
                      </div>

                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="outline"
                            size="md"
                            className="w-full text-amber-400 border-amber-500/40"
                          >
                            Admin Portal
                          </Button>
                        </Link>
                      )}

                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="primary" size="md" className="w-full">
                          Member Dashboard
                        </Button>
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" size="md" className="w-full">
                          Profile & Goals
                        </Button>
                      </Link>

                      <Button
                        variant="danger"
                        size="md"
                        className="w-full"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="secondary" size="md" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/membership" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="primary" size="md" className="w-full">
                          Join Now
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Quick Search Modal */}
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
