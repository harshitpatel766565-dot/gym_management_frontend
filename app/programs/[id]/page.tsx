'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workoutService } from '@/services/workoutService';
import { Program } from '@/types/workout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Clock,
  Users,
  Star,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  ArrowLeft,
  Dumbbell,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { success } = useToast();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProgram() {
      if (!params.id) return;
      try {
        const res = await workoutService.getProgramByIdOrSlug(params.id as string);
        setProgram(res.data);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadProgram();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <LoadingSpinner label="Loading Program Details..." size="lg" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="pt-32 pb-20 max-w-lg mx-auto text-center px-4">
        <h2 className="text-2xl font-bold font-heading text-white">Program Not Found</h2>
        <p className="text-forge-400 text-sm mt-2 mb-6">The requested program could not be located.</p>
        <Link href="/programs">
          <Button variant="primary">Return to Programs</Button>
        </Link>
      </div>
    );
  }

  const handleEnroll = () => {
    success('Enrolled!', `You are now enrolled in ${program.title}. Check your dashboard!`);
    router.push('/dashboard');
  };

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      {/* Top Banner */}
      <div className="relative min-h-[400px] flex items-end pb-12 overflow-hidden border-b border-forge-800">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${program.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forge-950 via-forge-950/85 to-black/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 hover:text-white transition-colors mb-6 font-heading"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Programs
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant={program.difficulty === 'Advanced' ? 'danger' : 'warning'}>
                  {program.difficulty} Level
                </Badge>
                <span className="flex items-center gap-1 text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {program.rating} / 5.0
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
                {program.title}
              </h1>
              <p className="text-forge-300 text-sm sm:text-base leading-relaxed">
                {program.shortDescription}
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0">
              <Button size="lg" variant="primary" onClick={handleEnroll} leftIcon={<Zap className="w-5 h-5" />}>
                Enroll in Program
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Schedule & Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <Card className="p-8 bg-forge-900 border-forge-800">
              <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide mb-4">
                Program Overview &amp; Methodology
              </h3>
              <p className="text-sm text-forge-300 leading-relaxed">{program.fullDescription}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-forge-800 text-center">
                <div className="p-3 rounded-2xl bg-forge-950 border border-forge-800">
                  <span className="text-2xl font-black font-heading text-brand-orange">{program.durationWeeks} Weeks</span>
                  <span className="text-[10px] uppercase font-bold text-forge-400 block mt-0.5">Duration</span>
                </div>
                <div className="p-3 rounded-2xl bg-forge-950 border border-forge-800">
                  <span className="text-2xl font-black font-heading text-white">{program.sessionsPerWeek}x</span>
                  <span className="text-[10px] uppercase font-bold text-forge-400 block mt-0.5">Sessions / Wk</span>
                </div>
                <div className="p-3 rounded-2xl bg-forge-950 border border-forge-800">
                  <span className="text-2xl font-black font-heading text-brand-red">~{program.estimatedCaloriesPerSession}</span>
                  <span className="text-[10px] uppercase font-bold text-forge-400 block mt-0.5">Cal / Session</span>
                </div>
              </div>
            </Card>

            {/* Weekly Schedule */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-orange" />
                <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide">
                  Weekly Split &amp; Focus
                </h3>
              </div>

              <div className="space-y-3">
                {program.scheduleOverview.map((item, idx) => (
                  <div
                    key={item.day}
                    className="p-4 rounded-2xl bg-forge-900 border border-forge-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center font-bold text-xs text-brand-red font-heading shrink-0">
                        {item.day}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white font-heading">{item.focus}</p>
                        <p className="text-xs text-forge-400">Target training session</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-forge-300 px-3 py-1 rounded-xl bg-forge-950 border border-forge-800 shrink-0">
                      {item.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Exercises */}
            {program.exercises && program.exercises.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-brand-red" />
                  <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide">
                    Featured Core Exercises
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-4 rounded-2xl bg-forge-900 border border-forge-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{ex.targetMuscle}</Badge>
                          <span className="text-xs text-forge-400">{ex.sets} sets × {ex.reps}</span>
                        </div>
                        <h4 className="text-sm font-bold font-heading text-white">{ex.name}</h4>
                        <p className="text-xs text-forge-400 mt-1 line-clamp-2">{ex.instructions[0]}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-forge-800/80 text-[11px] text-brand-orange">
                        Rest: {ex.restTimeSeconds}s • Equip: {ex.equipmentNeeded.split(',')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Coach Info & Inclusions */}
          <div className="space-y-6">
            {/* Coach Card */}
            <Card className="p-6 bg-forge-900 border-forge-800 text-center">
              <img
                src={program.trainerAvatar}
                alt={program.trainerName}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-brand-red shadow-lg mb-4"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange font-heading">
                Program Director
              </span>
              <h4 className="text-xl font-bold font-heading text-white mt-1">
                {program.trainerName}
              </h4>
              <p className="text-xs text-forge-400 mt-1">Certified Master Strength Coach</p>

              <div className="mt-6 pt-4 border-t border-forge-800">
                <Link href={`/trainers/${program.trainerId}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    View Coach Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Equipment Required */}
            <Card className="p-6 bg-forge-900 border-forge-800">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading mb-3">
                Equipment Utilized
              </h4>
              <div className="flex flex-wrap gap-2">
                {program.equipment.map((eq) => (
                  <span
                    key={eq}
                    className="px-3 py-1 rounded-xl bg-forge-950 border border-forge-800 text-xs text-forge-300"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </Card>

            {/* Guarantee */}
            <div className="p-6 rounded-3xl bg-brand-red/10 border border-brand-red/30 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-brand-red mx-auto" />
              <h4 className="text-sm font-bold uppercase font-heading text-white">
                Included in All Memberships
              </h4>
              <p className="text-xs text-forge-300">
                Active Basic, Pro, and Elite members receive complimentary full access to this program via the app.
              </p>
              <Link href="/membership" className="block pt-2">
                <Button size="sm" variant="primary" className="w-full">
                  Upgrade Membership
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
