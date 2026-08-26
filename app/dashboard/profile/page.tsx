'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { User, ShieldCheck, HeartPulse, Phone, Lock, Save, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: 26,
    gender: 'male' as 'male' | 'female' | 'other',
    height: 178,
    weight: 76.5,
    targetWeight: 80,
    fitnessGoal: 'muscle_gain' as 'muscle_gain' | 'weight_loss' | 'strength' | 'endurance' | 'general_fitness',
    activityLevel: 'very_active' as 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active',
    emergencyContactName: 'Sarah Johnson',
    emergencyContactPhone: '+91 98765 22222',
    medicalConditions: 'None',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        age: user.profile?.age || 26,
        gender: user.profile?.gender || 'male',
        height: user.profile?.height || 178,
        weight: user.profile?.weight || 76.5,
        targetWeight: user.profile?.targetWeight || 80,
        fitnessGoal: user.profile?.fitnessGoal || 'muscle_gain',
        activityLevel: user.profile?.activityLevel || 'very_active',
        emergencyContactName: user.profile?.emergencyContactName || 'Sarah Johnson',
        emergencyContactPhone: user.profile?.emergencyContactPhone || '+91 98765 22222',
        medicalConditions: user.profile?.medicalConditions || 'None',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      success('Profile Updated', 'Your biometric and contact info has been saved.');
    } catch {
      error('Error', 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
          Athlete Profile &amp; Biometrics
        </h2>
        <p className="text-xs text-forge-400 mt-0.5">
          Keep your physical metrics, fitness goals, and emergency details up to date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Personal Details */}
        <Card className="p-8 bg-forge-900 border-forge-800 space-y-6">
          <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
            <User className="w-5 h-5 text-brand-orange" />
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email (Registered Account)"
              disabled
              value={user?.email || ''}
              helperText="Contact admin desk to change primary email address."
            />
            <Select
              label="Biological Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other / Prefer not to say' },
              ]}
            />
          </div>
        </Card>

        {/* Biometrics & Goals */}
        <Card className="p-8 bg-forge-900 border-forge-800 space-y-6">
          <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-brand-red" />
            Biometrics &amp; Targets
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Age (Years)"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Current Weight (kg)"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Target Goal Weight (kg)"
              type="number"
              step="0.1"
              value={formData.targetWeight}
              onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Physique Goal"
              value={formData.fitnessGoal}
              onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as typeof formData.fitnessGoal })}
              options={[
                { value: 'muscle_gain', label: 'Muscle Hypertrophy & Bulk' },
                { value: 'weight_loss', label: 'Fat Loss & Conditioning' },
                { value: 'strength', label: 'Maximum Power & Strength' },
                { value: 'endurance', label: 'Cardiovascular Endurance' },
                { value: 'general_fitness', label: 'General Health & Mobility' },
              ]}
            />

            <Select
              label="Activity Level"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as typeof formData.activityLevel })}
              options={[
                { value: 'sedentary', label: 'Sedentary (Desk Job)' },
                { value: 'light', label: 'Lightly Active (1-3 days/wk)' },
                { value: 'moderate', label: 'Moderately Active (3-5 days/wk)' },
                { value: 'very_active', label: 'Very Active (6-7 days/wk)' },
                { value: 'extra_active', label: 'Extra Active (2x Daily)' },
              ]}
            />
          </div>
        </Card>

        {/* Emergency Contact & Medical */}
        <Card className="p-8 bg-forge-900 border-forge-800 space-y-6">
          <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            Safety &amp; Emergency Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Emergency Contact Person"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            />
            <Input
              label="Emergency Contact Phone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
              Medical Conditions / Allergies / Old Injuries
            </label>
            <textarea
              rows={2}
              value={formData.medicalConditions}
              onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSaving}
            size="lg"
            variant="primary"
            className="uppercase font-heading tracking-wider"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
