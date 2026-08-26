'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { userService } from '@/services/userService';
import { WorkoutProgress } from '@/types/user';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  PlusCircle,
  TrendingDown,
  Scale,
  Flame,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';

export default function ProgressTrackerPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [logs, setLogs] = useState<WorkoutProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Log Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: 76.5,
    bodyFatPercentage: 14.5,
    chest: 107,
    waist: 80,
    arms: 39.5,
    legs: 60.5,
    workoutDurationMinutes: 65,
    caloriesBurned: 550,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLogs = async () => {
    if (!user) return;
    try {
      const res = await userService.getProgressLogs(user.id);
      setLogs(res.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [user]);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await userService.addProgressLog(user.id, formData);
      success('Progress Logged!', 'New body metrics recorded successfully.');
      setIsModalOpen(false);
      loadLogs();
    } catch (err: unknown) {
      error('Failed to log', 'Could not save metrics.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = logs.map((log) => ({
    date: formatDate(log.date),
    Weight: log.weight,
    'Body Fat %': log.bodyFatPercentage || 0,
    Chest: log.chest || 0,
    Waist: log.waist || 0,
    Arms: log.arms || 0,
    Legs: log.legs || 0,
    Calories: log.caloriesBurned,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Workout &amp; Body Metrics Tracker
          </h2>
          <p className="text-xs text-forge-400 mt-0.5">
            Log your circumferences, weight fluctuations, and caloric output over time.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Log New Measurement
        </Button>
      </div>

      {/* Progress Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weight & Body Fat Line Chart */}
        <Card className="p-6 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                Longitudinal Composition
              </span>
              <h4 className="text-lg font-bold font-heading text-white mt-0.5">
                Weight (kg) vs Body Fat (%)
              </h4>
            </div>
            <span className="text-xs text-emerald-400 font-bold px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800">
              -3.0% Body Fat
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272E" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181D',
                    borderColor: '#27272E',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Weight" stroke="#E11D48" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Body Fat %" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Circumference Measurements Chart (Chest, Waist, Arms, Legs) */}
        <Card className="p-6 bg-forge-900 border-forge-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading">
                Muscle Circumferences
              </span>
              <h4 className="text-lg font-bold font-heading text-white mt-0.5">
                Chest, Waist, Arms &amp; Legs (cm)
              </h4>
            </div>
            <span className="text-xs text-brand-orange font-bold px-2.5 py-1 rounded-xl bg-brand-orange/10 border border-brand-orange/30">
              +2.5cm Arm Growth
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272E" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181D',
                    borderColor: '#27272E',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Chest" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Waist" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Arms" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="Legs" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Historical Data Log Table */}
      <Card className="p-6 bg-forge-900 border-forge-800">
        <h4 className="text-lg font-bold font-heading text-white mb-4">
          Historical Logged Entries
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase">
                <th className="py-3 px-3 font-bold">Date</th>
                <th className="py-3 px-3 font-bold">Weight</th>
                <th className="py-3 px-3 font-bold">Body Fat</th>
                <th className="py-3 px-3 font-bold">Chest</th>
                <th className="py-3 px-3 font-bold">Waist</th>
                <th className="py-3 px-3 font-bold">Arms</th>
                <th className="py-3 px-3 font-bold">Duration</th>
                <th className="py-3 px-3 font-bold">Calories</th>
                <th className="py-3 px-3 font-bold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-forge-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">{formatDate(log.date)}</td>
                  <td className="py-3.5 px-3 font-mono text-brand-orange">{log.weight} kg</td>
                  <td className="py-3.5 px-3 text-emerald-400">{log.bodyFatPercentage}%</td>
                  <td className="py-3.5 px-3 text-forge-300">{log.chest || '—'} cm</td>
                  <td className="py-3.5 px-3 text-forge-300">{log.waist || '—'} cm</td>
                  <td className="py-3.5 px-3 text-forge-300">{log.arms || '—'} cm</td>
                  <td className="py-3.5 px-3 text-forge-400">{log.workoutDurationMinutes} mins</td>
                  <td className="py-3.5 px-3 text-brand-red font-semibold">~{log.caloriesBurned} kcal</td>
                  <td className="py-3.5 px-3 text-forge-400 italic max-w-xs truncate">{log.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Measurement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Body Metrics & Progress"
        description="Record your latest physical measurements and training session stats"
        maxWidth="lg"
      >
        <form onSubmit={handleAddLog} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              required
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Body Fat (%)"
              type="number"
              step="0.1"
              value={formData.bodyFatPercentage}
              onChange={(e) => setFormData({ ...formData, bodyFatPercentage: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Chest (cm)"
              type="number"
              step="0.5"
              value={formData.chest}
              onChange={(e) => setFormData({ ...formData, chest: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Waist (cm)"
              type="number"
              step="0.5"
              value={formData.waist}
              onChange={(e) => setFormData({ ...formData, waist: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Arms (cm)"
              type="number"
              step="0.5"
              value={formData.arms}
              onChange={(e) => setFormData({ ...formData, arms: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration (Minutes)"
              type="number"
              value={formData.workoutDurationMinutes}
              onChange={(e) => setFormData({ ...formData, workoutDurationMinutes: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Calories Burned (kcal)"
              type="number"
              value={formData.caloriesBurned}
              onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
              Personal Notes / PRs
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Felt powerful on bench press. Hit new 5RM..."
              className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            size="lg"
            variant="primary"
            className="w-full uppercase font-heading tracking-wider mt-4"
          >
            Save Metrics Entry
          </Button>
        </form>
      </Modal>
    </div>
  );
}
