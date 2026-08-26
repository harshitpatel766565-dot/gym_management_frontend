'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, ShieldCheck, Phone, Mail, Award, Clock, FileText } from 'lucide-react';

export default function TrainerProfilePage() {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      success('Profile Updated', 'Your contact info has been saved.');
    } catch {
      error('Error', 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
          Trainer Profile Settings
        </h1>
        <p className="text-sm text-forge-400 mt-2">
          Manage your personal contact info and view your coaching credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <Card className="p-8 bg-forge-900 border-forge-800 space-y-6">
          <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
            <User className="w-5 h-5 text-brand-orange" />
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2 bg-forge-950 border border-forge-850 rounded-xl px-4 py-3 text-sm text-forge-500 font-medium">
                <Mail className="w-4 h-4 text-forge-600" />
                <span>{user?.email}</span>
              </div>
              <p className="text-[10px] text-forge-500 mt-1">Contact administration to change email.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
                Coaching Role
              </label>
              <div className="flex items-center gap-2 bg-forge-950 border border-forge-850 rounded-xl px-4 py-3 text-sm text-brand-orange font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="uppercase tracking-wider">Master Coach (Trainer)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Credentials View */}
        <Card className="p-8 bg-forge-900 border-forge-800 space-y-6">
          <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-orange" />
            Professional Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-forge-950 border border-forge-850 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Coaching Roster Status</span>
              </div>
              <p className="text-xs text-forge-400">
                You are registered as an active IRONFORGE personal trainer. You can design workouts, review logs, and accept bookings.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-forge-950 border border-forge-850 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Account Integration</span>
              </div>
              <p className="text-xs text-forge-400">
                Connected to secure email SMTP for real-time athlete session confirmations and system alerts.
              </p>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSaving}
            size="lg"
            className="w-full sm:w-auto uppercase tracking-wider font-heading"
          >
            Save Profile Updates
          </Button>
        </div>
      </form>
    </div>
  );
}
