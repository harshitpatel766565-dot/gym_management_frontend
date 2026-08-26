'use client';

import React, { useState, useEffect } from 'react';
import { trainerService, TrainerMember } from '@/services/trainerService';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import {
  TrendingUp,
  Scale,
  Calendar,
  Activity,
  Flame,
  Clock,
  User,
  Users,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatDate } from '@/lib/utils';

export default function TrainerProgressPage() {
  const { error } = useToast();
  const [members, setMembers] = useState<TrainerMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [progress, setProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const res = await trainerService.getMyMembers();
      if (res.success && res.data) {
        setMembers(res.data);
        if (res.data.length > 0) {
          setSelectedMemberId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load trainer members:', err);
      error('Error', 'Unable to fetch assigned members.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgress = async (memberId: string) => {
    if (!memberId) return;
    try {
      setIsChartLoading(true);
      const res = await trainerService.getMemberProgress(memberId);
      if (res.success) {
        setProgress(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load member progress:', err);
    } finally {
      setIsChartLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      loadProgress(selectedMemberId);
    } else {
      setProgress([]);
    }
  }, [selectedMemberId]);

  const selectedMember = members.find((m) => m._id === selectedMemberId);

  // Format Recharts data
  const chartData = [...progress]
    .reverse() // Display chronological order (oldest to newest)
    .map((p) => ({
      date: formatDate(p.date),
      weight: p.weight,
      bodyFat: p.bodyFatPercentage || 0,
      calories: p.caloriesBurned || 0,
    }));

  if (isLoading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner label="Loading athlete roster..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
          TRAINER WORKSPACE
        </p>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-white mt-2">
          ATHLETE PROGRESS RADAR
        </h1>
        <p className="text-sm text-forge-400 mt-2">
          Select a member to track their weight shifts, metabolic burn rate, and biometric history.
        </p>
      </div>

      {members.length === 0 ? (
        <Card className="p-12 text-center bg-forge-900 border-forge-800">
          <Users className="w-12 h-12 mx-auto text-forge-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Assigned Athletes</h3>
          <p className="text-sm text-forge-400 max-w-md mx-auto">
            You currently do not have any members assigned to your coaching account. Head to the "My Members" page to assign members to yourself first.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Member Selector Card */}
          <Card className="p-6 bg-forge-900 border-forge-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-300 font-heading">
                  Active Athlete
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full sm:w-72 bg-forge-950 border border-forge-750 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red font-semibold"
                >
                  {members.map((m) => (
                    <option key={m._id} value={m._id} className="bg-forge-950">
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMember && (
                <div className="flex items-center gap-4 p-3 bg-forge-950/50 border border-forge-850 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold">
                    {selectedMember.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedMember.name}</h4>
                    <p className="text-[11px] text-forge-400">{selectedMember.phone || 'No phone recorded'}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {isChartLoading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <LoadingSpinner label="Decrypting biometric telemetry..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Progress Chart */}
              <Card className="p-6 bg-forge-900 border-forge-800 lg:col-span-2 space-y-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading uppercase text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-red" />
                    Weight Velocity Curve
                  </h3>
                  <span className="text-[10px] px-2 py-1 rounded bg-forge-950 text-forge-400 font-mono">
                    {progress.length} Data Points
                  </span>
                </div>

                <div className="h-80 w-full">
                  {chartData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-forge-500">
                      <Scale className="w-10 h-10 mb-2 opacity-55" />
                      <p className="text-sm font-semibold">No Biometric Logs Logged</p>
                      <p className="text-xs mt-1">This athlete has not recorded any progress metrics yet.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#27272E" vertical={false} />
                        <XAxis dataKey="date" stroke="#71717A" fontSize={9} />
                        <YAxis stroke="#71717A" fontSize={9} domain={['auto', 'auto']} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181D',
                            borderColor: '#27272E',
                            color: '#fff',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10, marginTop: 10 }} />
                        <Line
                          name="Weight (kg)"
                          type="monotone"
                          dataKey="weight"
                          stroke="#FF4500"
                          strokeWidth={3}
                          dot={{ fill: '#FF4500', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          name="Body Fat %"
                          type="monotone"
                          dataKey="bodyFat"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              {/* Progress Log List */}
              <Card className="p-6 bg-forge-900 border-forge-800 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-heading uppercase text-white flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Biometric Checkpoints
                  </h3>

                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-forge-800">
                    {progress.length === 0 ? (
                      <p className="text-sm text-forge-400 py-12 text-center">No logs logged.</p>
                    ) : (
                      progress.map((p, idx) => (
                        <div
                          key={p._id || idx}
                          className="p-3.5 rounded-xl bg-forge-950 border border-forge-850 flex justify-between items-center text-xs text-forge-300 hover:border-brand-red/30 transition"
                        >
                          <div className="space-y-1">
                            <p className="font-bold text-white text-sm flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                              {formatDate(p.date)}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-forge-400">
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3 text-blue-400" />
                                {p.workoutDurationMinutes}m
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Flame className="w-3 h-3 text-brand-red" />
                                {p.caloriesBurned} kcal
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-brand-orange text-sm">{p.weight} kg</p>
                            {p.bodyFatPercentage && (
                              <p className="text-[10px] text-forge-400">{p.bodyFatPercentage}% Fat</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {selectedMember && (
                  <div className="pt-4 border-t border-forge-850">
                    <button
                      onClick={() => window.location.href = `/trainer/members/${selectedMemberId}`}
                      className="w-full py-2.5 rounded-xl bg-forge-950 border border-forge-800 hover:border-brand-red/50 text-xs font-bold uppercase tracking-wider text-white transition-all text-center"
                    >
                      View Complete Roster Profile
                    </button>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
