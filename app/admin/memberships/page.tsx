'use client';

import React, { useState, useEffect } from 'react';
import { membershipService } from '@/services/membershipService';
import { MembershipPlan } from '@/types/membership';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatINR } from '@/lib/utils';
import {
  CreditCard,
  Edit2,
  Sparkles,
  Check,
  X,
  Plus,
  Trash2,
  Clock,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_FORM_DATA = {
  name: '',
  tagline: '',
  description: '',
  duration: 30,
  monthlyPrice: 999,
  yearlyPrice: 9990,
  isPopular: false,
  accessHours: '24/7 Access',
  guestPassesPerMonth: 0,
  trainerSessionsPerMonth: 0,
  dietConsultationsPerQuarter: 0,
  saunaAccess: false,
  lockerAccess: true,
};

export default function AdminMembershipsPage() {
  const { success, error } = useToast();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [features, setFeatures] = useState<{ title: string; included: boolean }[]>([]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await membershipService.getPlans();
      if (res.success && res.data) {
        setPlans(res.data);
      } else {
        error('Fetch Failed', res.message || 'Unable to retrieve plans.');
      }
    } catch (err: any) {
      error('Fetch Error', err.message || 'Failed to fetch membership tiers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData(DEFAULT_FORM_DATA);
    setFeatures([
      { title: 'Access to gym floor', included: true },
      { title: 'Locker room access', included: true },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      tagline: plan.tagline || '',
      description: plan.features.map(f => f.title).join(', '),
      duration: 30, // Default duration
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      isPopular: !!plan.isPopular,
      accessHours: plan.accessHours || '24/7 Access',
      guestPassesPerMonth: plan.guestPassesPerMonth || 0,
      trainerSessionsPerMonth: plan.trainerSessionsPerMonth || 0,
      dietConsultationsPerQuarter: plan.dietConsultationsPerQuarter || 0,
      saunaAccess: !!plan.saunaAccess,
      lockerAccess: !!plan.lockerAccess,
    });
    setFeatures(plan.features || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this membership plan? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await membershipService.deletePlan(planId);
      if (res.success) {
        success('Plan Deleted', 'The membership plan has been removed.');
        fetchPlans();
      } else {
        error('Delete Failed', res.message || 'Could not delete the plan.');
      }
    } catch (err: any) {
      error('Delete Error', err.message || 'An error occurred during deletion.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (!formData.name.trim()) {
      error('Validation Error', 'Plan Name is required.');
      return;
    }
    if (features.some(f => !f.title.trim())) {
      error('Validation Error', 'All feature titles must be filled out.');
      return;
    }

    const payload = {
      name: formData.name,
      tagline: formData.tagline,
      description: formData.tagline,
      duration: formData.duration,
      monthlyPrice: Number(formData.monthlyPrice),
      yearlyPrice: Number(formData.yearlyPrice),
      isPopular: formData.isPopular,
      accessHours: formData.accessHours,
      guestPassesPerMonth: Number(formData.guestPassesPerMonth),
      trainerSessionsPerMonth: Number(formData.trainerSessionsPerMonth),
      dietConsultationsPerQuarter: Number(formData.dietConsultationsPerQuarter),
      saunaAccess: formData.saunaAccess,
      lockerAccess: formData.lockerAccess,
      features: features.filter(f => f.title.trim() !== ''),
    };

    try {
      let res;
      if (editingPlan) {
        res = await membershipService.updatePlan(editingPlan.id, payload);
      } else {
        res = await membershipService.createPlan(payload);
      }

      if (res.success) {
        success(
          editingPlan ? 'Plan Updated' : 'Plan Created',
          editingPlan ? 'Changes saved to database.' : 'New membership plan is now live.'
        );
        setIsModalOpen(false);
        fetchPlans();
      } else {
        error('Save Failed', res.message || 'Failed to save membership plan.');
      }
    } catch (err: any) {
      error('Save Error', err.message || 'An error occurred while saving.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-brand-orange" />
            Membership Plans &amp; Tiers
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Configure dynamic pricing tiers, inclusions, accessibility, and manage subscription structures.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Plan
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-t-brand-red border-forge-800 rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-forge-900/50 border border-forge-850 rounded-2xl">
          <Sparkles className="w-10 h-10 text-forge-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No plans configured yet</h3>
          <p className="text-xs text-forge-400 mt-1 max-w-sm mx-auto">
            Get started by creating your first gym subscription tier. Click the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="p-6 bg-forge-900 border-forge-800 hover:border-forge-700/80 transition-all flex flex-col justify-between relative group"
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 right-6">
                  <Badge variant="flame">Popular Option</Badge>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">{plan.name} Plan</h3>
                  <p className="text-xs text-brand-orange font-medium mt-0.5">{plan.tagline}</p>
                </div>

                {/* Pricing table */}
                <div className="p-4 rounded-xl bg-forge-950/80 border border-forge-800 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-forge-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-forge-500" /> Monthly Rate:
                    </span>
                    <span className="text-base font-bold font-heading text-white">{formatINR(plan.monthlyPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-forge-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-forge-500" /> Yearly Rate:
                    </span>
                    <span className="text-base font-bold font-heading text-emerald-400">
                      {formatINR(plan.yearlyPrice)}
                    </span>
                  </div>
                </div>

                {/* Details list */}
                <div className="grid grid-cols-2 gap-3 text-[11px] text-forge-300 py-1.5 border-y border-forge-850">
                  <div className="space-y-1">
                    <p className="text-forge-500 font-bold uppercase tracking-wider">Access Hours</p>
                    <p className="text-white font-medium truncate">{plan.accessHours}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-forge-500 font-bold uppercase tracking-wider">Locker Access</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      {plan.lockerAccess ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Included
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 text-brand-red" /> No
                        </>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-forge-500 font-bold uppercase tracking-wider">Trainer Sessions</p>
                    <p className="text-white font-medium">{plan.trainerSessionsPerMonth} / Mo</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-forge-500 font-bold uppercase tracking-wider">Sauna Access</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      {plan.saunaAccess ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Included
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 text-brand-red" /> No
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-forge-300 uppercase font-heading block">Inclusions &amp; Benefits:</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-forge-300">
                        {f.included ? (
                          <Check className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-forge-600 shrink-0 mt-0.5" />
                        )}
                        <span className={f.included ? 'text-forge-200' : 'text-forge-500 line-through'}>
                          {f.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-6 border-t border-forge-800 flex items-center gap-3">
                <Button
                  onClick={() => openEditModal(plan)}
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-1.5 text-forge-300 hover:text-white border-forge-750"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button
                  onClick={() => handleDelete(plan.id)}
                  variant="danger"
                  size="sm"
                  className="px-3"
                  title="Delete plan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-forge-900 border border-forge-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-forge-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
                  </h3>
                  <p className="text-xs text-forge-400 mt-0.5">
                    {editingPlan ? 'Make changes to this subscription tier.' : 'Define features, inclusions, and prices.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-forge-850 hover:bg-forge-800 text-forge-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Plan Name"
                    placeholder="e.g. Platinum Tier"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Short Tagline"
                    placeholder="e.g. VIP Gym Access & Elite Coaching"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Monthly Price (INR)"
                    type="number"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
                    required
                  />
                  <Input
                    label="Yearly Price (INR)"
                    type="number"
                    value={formData.yearlyPrice}
                    onChange={(e) => setFormData({ ...formData, yearlyPrice: Number(e.target.value) })}
                    required
                  />
                  <Input
                    label="Duration (Days)"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Access Hours"
                    placeholder="e.g. 24/7 Access or 6:00 AM – 10:00 PM"
                    value={formData.accessHours}
                    onChange={(e) => setFormData({ ...formData, accessHours: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      label="Guest Passes"
                      type="number"
                      value={formData.guestPassesPerMonth}
                      onChange={(e) => setFormData({ ...formData, guestPassesPerMonth: Number(e.target.value) })}
                    />
                    <Input
                      label="PT Sessions"
                      type="number"
                      value={formData.trainerSessionsPerMonth}
                      onChange={(e) => setFormData({ ...formData, trainerSessionsPerMonth: Number(e.target.value) })}
                    />
                    <Input
                      label="Diets/Quarter"
                      type="number"
                      value={formData.dietConsultationsPerQuarter}
                      onChange={(e) => setFormData({ ...formData, dietConsultationsPerQuarter: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Checkbox fields */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-forge-950 border border-forge-800">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-forge-300 font-heading">
                    <input
                      type="checkbox"
                      checked={formData.saunaAccess}
                      onChange={(e) => setFormData({ ...formData, saunaAccess: e.target.checked })}
                      className="rounded border-forge-700 bg-forge-900 text-brand-red focus:ring-brand-red/40 w-4.5 h-4.5"
                    />
                    Sauna Access
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-forge-300 font-heading">
                    <input
                      type="checkbox"
                      checked={formData.lockerAccess}
                      onChange={(e) => setFormData({ ...formData, lockerAccess: e.target.checked })}
                      className="rounded border-forge-700 bg-forge-900 text-brand-red focus:ring-brand-red/40 w-4.5 h-4.5"
                    />
                    Locker Access
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-forge-300 font-heading">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded border-forge-700 bg-forge-900 text-brand-red focus:ring-brand-red/40 w-4.5 h-4.5"
                    />
                    Mark Popular
                  </label>
                </div>

                {/* Features (Dynamic array) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-1 border-b border-forge-850">
                    <label className="text-xs font-bold uppercase tracking-wider text-forge-300 font-heading">
                      Plan Inclusions (Bullet Points)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFeatures([...features, { title: '', included: true }])}
                      className="flex items-center gap-1 text-[11px] text-brand-orange border-brand-orange/30 hover:border-brand-orange"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Inclusion
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={feature.included}
                            onChange={(e) => {
                              const updated = [...features];
                              updated[idx].included = e.target.checked;
                              setFeatures(updated);
                            }}
                            className="rounded border-forge-700 bg-forge-950 text-brand-red focus:ring-brand-red/40 w-4 h-4"
                          />
                          <span className="text-[10px] text-forge-400 font-bold uppercase ml-1">Included</span>
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          placeholder="e.g. Access to Cardio Zone"
                          onChange={(e) => {
                            const updated = [...features];
                            updated[idx].title = e.target.value;
                            setFeatures(updated);
                          }}
                          className="flex-1 bg-forge-950/80 border border-forge-750 hover:border-forge-600 rounded-xl py-2 px-3.5 text-xs text-white placeholder-forge-500 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                          className="p-2 text-forge-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {features.length === 0 && (
                      <p className="text-xs text-forge-500 italic text-center py-2">
                        No features added yet. Click Add Inclusion to document perks.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-forge-800">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    {editingPlan ? 'Save Changes' : 'Create Plan'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
