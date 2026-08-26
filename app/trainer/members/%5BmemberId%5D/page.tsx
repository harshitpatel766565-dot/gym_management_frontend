'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trainerService, Workout, Booking } from '@/services/trainerService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Activity,
  Plus,
  ArrowLeft,
  Flame,
  Weight,
  Heart,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDate } from '@/lib/utils';

export default function TrainerMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  const memberId = params.memberId as string;

  const [member, setMember] = useState<any>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'bookings' | 'progress'>('overview');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, workoutRes, bookingRes, progressRes] = await Promise.all([
        trainerService.getMemberProfile(memberId),
        trainerService.getMemberWorkouts(memberId),
        trainerService.getMyBookings(), // Filtered client-side for member or we can get userBookings
        trainerService.getMemberProgress(memberId),
      ]);

      setMember(profileRes.data);
      setWorkouts(workoutRes.data || []);
      
      // Filter bookings for this member
      const memberBookings = (bookingRes.data || []).filter(
        (b: any) => (b.member?._id || b.member) === memberId
      );
      setBookings(memberBookings);
      setProgress(progressRes.data || []);
    } catch (err) {
      console.error('Failed to load member profile details:', err);
      error('Error', 'Unable to fetch athlete details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) {
      loadData();
    }
  }, [memberId]);

  if (isLoading || !member) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-forge-950">
        <LoadingSpinner label="Compiling athlete records & biometrics..." />
      </div>
    );
  }

  // Weight Trend Data for Recharts
  const chartData = progress.map(p => ({
    date: p.date,
    weight: p.weight,
    bodyFat: p.bodyFatPercentage || 0,
  }));

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto text-white">
      {/* Back navigation */}
      <button
        onClick={() => router.push('/trainer/members')}
        className="inline-flex items-center gap-2 text-sm text-forge-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Member List
      </button>

      {/* Header Profile Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-forge-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-brand-red/25">
            {member.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black font-heading uppercase tracking-tight">{member.name}</h1>
            <p className="text-xs text-forge-400">Athlete Profile • Member Since {formatDate(member.createdAt)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant={member.isActive ? 'success' : 'outline'}>
            {member.isActive ? 'Active Member' : 'Inactive'}
          </Badge>
          <Badge variant="flame">
            Goal: {member.profile?.fitnessGoal || 'General Fitness'}
          </Badge>
        </div>
      </div>

      {/* Biometric summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <Weight className="w-8 h-8 text-brand-orange shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-400 block font-heading">Current Weight</span>
            <p className="text-xl font-black font-heading text-white">{member.profile?.weight || '--'} kg</p>
          </div>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <Activity className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-400 block font-heading">Calculated BMI</span>
            <p className="text-xl font-black font-heading text-white">{member.profile?.bmi || '--'}</p>
          </div>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <Flame className="w-8 h-8 text-brand-red shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-400 block font-heading">Body Fat %</span>
            <p className="text-xl font-black font-heading text-white">{member.profile?.bodyFatPercentage || '--'}%</p>
          </div>
        </Card>

        <Card className="p-5 bg-forge-900 border-forge-800 flex items-center gap-4">
          <Heart className="w-8 h-8 text-blue-400 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-400 block font-heading">Height</span>
            <p className="text-xl font-black font-heading text-white">{member.profile?.height || '--'} cm</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-forge-800 text-xs font-bold uppercase font-heading tracking-wider gap-4">
        {(['overview', 'workouts', 'bookings', 'progress'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-brand-orange text-brand-orange'
                : 'text-forge-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <Card className="p-6 bg-forge-900 border-forge-800 space-y-6">
            <h3 className="text-lg font-bold font-heading uppercase text-white">Contact & Profile Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-forge-300">
                  <Mail className="w-4 h-4 text-forge-500" />
                  <span>Email: {member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-forge-300">
                  <Phone className="w-4 h-4 text-forge-500" />
                  <span>Phone: {member.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-forge-300">
                  <Calendar className="w-4 h-4 text-forge-500" />
                  <span>Age: {member.profile?.age || 'Not specified'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-forge-300">
                  <User className="w-4 h-4 text-forge-500" />
                  <span>Gender: {member.profile?.gender || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-3 text-forge-300">
                  <Activity className="w-4 h-4 text-forge-500" />
                  <span>Activity Level: {member.profile?.activityLevel || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-3 text-forge-300">
                  <Heart className="w-4 h-4 text-forge-500" />
                  <span>Medical Alerts: {member.profile?.medicalConditions || 'None'}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'workouts' && (
          <Card className="p-6 bg-forge-900 border-forge-800 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-heading uppercase text-white">Assigned Routines</h3>
              <Button
                onClick={() => router.push(`/trainer/workouts`)}
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Manage Workouts
              </Button>
            </div>

            <div className="space-y-4">
              {workouts.length === 0 ? (
                <p className="text-sm text-forge-400 py-6 text-center">No workout routines assigned to this member.</p>
              ) : (
                workouts.map((w) => (
                  <div key={w._id} className="p-4 rounded-2xl bg-forge-950 border border-forge-850 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-white font-heading">{w.name}</p>
                      <span className="text-xs text-forge-400">Goal: {w.goal || 'Not specified'} • {w.exercises.length} Exercises</span>
                    </div>
                    <Badge variant={w.status === 'active' ? 'success' : 'outline'}>{w.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'bookings' && (
          <Card className="p-6 bg-forge-900 border-forge-800 space-y-6">
            <h3 className="text-lg font-bold font-heading uppercase text-white">Training Sessions History</h3>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-sm text-forge-400 py-6 text-center">No session bookings found.</p>
              ) : (
                bookings.map((b) => (
                  <div key={b._id} className="p-4 rounded-2xl bg-forge-950 border border-forge-850 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-white font-heading">{b.title}</p>
                      <span className="text-xs text-forge-400">
                        {formatDate(b.date)} • {b.startTime}
                      </span>
                    </div>
                    <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'completed' ? 'purple' : 'outline'}>
                      {b.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weight trend chart */}
            <Card className="p-6 bg-forge-900 border-forge-800 space-y-4">
              <h3 className="text-lg font-bold font-heading uppercase text-white">Weight Velocity (kg)</h3>
              <div className="h-64 w-full">
                {chartData.length === 0 ? (
                  <p className="text-sm text-forge-400 py-20 text-center">No progress checkpoints recorded.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#27272E" vertical={false} />
                      <XAxis dataKey="date" stroke="#71717A" fontSize={10} />
                      <YAxis stroke="#71717A" fontSize={10} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181D',
                          borderColor: '#27272E',
                        }}
                      />
                      <Line type="monotone" dataKey="weight" stroke="#FF4500" strokeWidth={3} dot={{ fill: '#FF4500' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* List logs */}
            <Card className="p-6 bg-forge-900 border-forge-800 space-y-4">
              <h3 className="text-lg font-bold font-heading uppercase text-white">Biometric Logs</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {progress.length === 0 ? (
                  <p className="text-sm text-forge-400 py-6 text-center">No logs logged.</p>
                ) : (
                  progress.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-forge-950 border border-forge-850 flex justify-between items-center text-xs text-forge-300">
                      <div>
                        <p className="font-bold text-white text-sm">{formatDate(p.date)}</p>
                        <span className="text-[10px] text-forge-400">Duration: {p.workoutDurationMinutes} mins • {p.caloriesBurned} kcal burned</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-orange text-sm">{p.weight} kg</p>
                        {p.bodyFatPercentage && <p className="text-[10px] text-forge-400">{p.bodyFatPercentage}% Fat</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
