'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Flame,
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();

  const { login, isLoading } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      error(
        'Login Failed',
        'Please enter your email and password.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedInUser = await login({
        email: email.trim(),
        password,
      });

      success(
        'Welcome Back!',
        `Logged in successfully as ${loggedInUser.role}.`
      );

      // Trainer → Trainer Panel
      if (loggedInUser.role === 'trainer') {
        router.push('/trainer');
        return;
      }

      // Normal Member → Member Dashboard
      if (loggedInUser.role === 'user') {
        router.push('/dashboard');
        return;
      }

      // Fallback
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Invalid email or password.';

      error('Login Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-red/10 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full relative z-10"
      >

        {/* Brand */}
        <div className="text-center mb-8">

          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center shadow-lg shadow-brand-red/30 group-hover:scale-105 transition-transform">
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>

            <span className="text-3xl font-extrabold tracking-wider font-heading text-white">
              IRON<span className="text-brand-orange">FORGE</span>
            </span>
          </Link>

          <h2 className="text-2xl font-bold font-heading text-white mt-4 uppercase">
            Sign In to Your Account
          </h2>

          <p className="text-xs text-forge-400 mt-1">
            Access your workouts, progress charts, and personal bookings.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-forge-900 border-forge-800 shadow-2xl space-y-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trainer@example.com"
              leftIcon={
                <Mail className="w-4 h-4 text-forge-400" />
              }
              autoComplete="email"
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={
                <Lock className="w-4 h-4 text-forge-400" />
              }
              autoComplete="current-password"
            />

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-xs pt-1">

              <label className="flex items-center gap-2 text-forge-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded accent-brand-red bg-forge-950"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-brand-orange hover:underline font-semibold"
              >
                Forgot password?
              </Link>

            </div>

            {/* Submit */}
            <Button
              type="submit"
              isLoading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
              size="lg"
              variant="primary"
              className="w-full uppercase font-heading tracking-wider mt-2"
              rightIcon={
                <ArrowRight className="w-4 h-4" />
              }
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

          </form>

          {/* Trainer Info */}
          <div className="pt-4 border-t border-forge-800">
            <div className="rounded-xl bg-forge-950 border border-forge-800 p-4">
              <p className="text-xs text-forge-300 text-center">
                Trainers can sign in using their registered gym
                account to access the Trainer Dashboard.
              </p>
            </div>
          </div>

          {/* Register */}
          <p className="text-center text-xs text-forge-400 pt-2">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="text-brand-orange hover:underline font-bold font-heading"
            >
              Join IRONFORGE
            </Link>
          </p>

        </Card>
      </motion.div>
    </div>
  );
}