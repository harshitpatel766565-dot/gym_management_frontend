'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Flame, Lock, Mail, Phone, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      error('Password Mismatch', 'Passwords do not match. Please verify.');
      return;
    }
    if (formData.password.length < 6) {
      error('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      success('Account Created!', 'Welcome to IRONFORGE Fitness!');
      router.push('/');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Registration could not be completed.';
      error('Registration Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-red/10 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center shadow-lg shadow-brand-red/30 group-hover:scale-105 transition-transform">
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-wider font-heading text-white">
              IRON<span className="text-brand-orange">FORGE</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-heading text-white mt-4 uppercase">
            Create Your Athlete Profile
          </h2>
          <p className="text-xs text-forge-400 mt-1">
            Start tracking your lifts, booking elite coaches, and mastering your fitness.
          </p>
        </div>

        <Card className="p-8 bg-forge-900 border-forge-800 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              leftIcon={<User className="w-4 h-4 text-forge-400" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4 text-forge-400" />}
            />

            <Input
              label="Mobile / Phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4 text-forge-400" />}
            />

            <Input
              label="Create Password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<Lock className="w-4 h-4 text-forge-400" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              leftIcon={<Lock className="w-4 h-4 text-forge-400" />}
            />

            <Button
              type="submit"
              isLoading={isSubmitting || isLoading}
              size="lg"
              variant="primary"
              className="w-full uppercase font-heading tracking-wider mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <p className="text-center text-xs text-forge-400 pt-3 border-t border-forge-800">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-orange hover:underline font-bold font-heading">
              Sign In
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
   