'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND, NAV_LINKS } from '@/lib/constants';
import { useToast } from '@/context/ToastContext';
import {
  Flame,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    success('Subscribed!', 'You will now receive weekly training tips, nutrition advice, and gym updates.');
    setEmail('');
  };

  return (
    <footer className="bg-forge-950 border-t border-forge-800/80 text-forge-300 relative overflow-hidden pt-16 pb-12">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-brand-red/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-forge-850">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center shadow-lg shadow-brand-red/30">
                <Flame className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-wider font-heading text-white">
                IRON<span className="text-brand-orange">FORGE</span>
              </span>
            </Link>
            <p className="text-sm text-forge-400 max-w-sm leading-relaxed">
              Forging champion mindsets and unbreakable physiques through world-class coaching, state-of-the-art facilities, and data-driven training regimens.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-forge-900 border border-forge-750 flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-forge-900 border border-forge-750 flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={BRAND.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-forge-900 border border-forge-750 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={BRAND.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-forge-900 border border-forge-750 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-brand-orange transition-colors">
                  Training Programs
                </Link>
              </li>
              <li>
                <Link href="/trainers" className="hover:text-brand-orange transition-colors">
                  Expert Coaches
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-brand-orange transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/workouts" className="hover:text-brand-orange transition-colors">
                  Workout Database
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tools & Calculators */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Fitness Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/bmi-calculator" className="hover:text-brand-orange transition-colors">
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/calorie-calculator" className="hover:text-brand-orange transition-colors">
                  TDEE / Calorie Calc
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Book a Trial Pass
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-orange transition-colors">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Signup */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Stay In The Zone
            </h4>
            <p className="text-xs text-forge-400 leading-relaxed">
              Get science-backed workout plans and exclusive member discounts delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-forge-900 border border-forge-750 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-brand-red hover:bg-brand-orange text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Operating Hours & Location Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-forge-850 text-xs text-forge-400">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-brand-orange shrink-0" />
            <div>
              <span className="text-white font-bold">Mon–Fri:</span> {BRAND.hours.weekdays} | <span className="text-white font-bold">Sat:</span> {BRAND.hours.saturday}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
            <a href={BRAND.googleMapsUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              {BRAND.address}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-brand-orange shrink-0" />
            <a href={`tel:${BRAND.phone}`} className="hover:text-white transition-colors">
              {BRAND.phone} • {BRAND.email}
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-forge-500 gap-4">
          <p>© {new Date().getFullYear()} {BRAND.name} Fitness Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-forge-300">Privacy Policy</Link>
            <Link href="/about" className="hover:text-forge-300">Terms of Service</Link>
            <Link href="/contact" className="hover:text-forge-300">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
