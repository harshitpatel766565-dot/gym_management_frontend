'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dumbbell, CheckCircle2, Circle, Flame, Clock, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

interface ExerciseItem {
  id: string;
  name: string;
  target: string;
  sets: string;
  completed: boolean;
}

export function TodayWorkoutCard() {
  const { success } = useToast();
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    { id: '1', name: 'Barbell Flat Bench Press', target: 'Chest', sets: '4 sets × 8-10 reps', completed: true },
    { id: '2', name: 'Incline Dumbbell Press', target: 'Upper Chest', sets: '3 sets × 10-12 reps', completed: true },
    { id: '3', name: 'Standing Overhead Military Press', target: 'Shoulders', sets: '4 sets × 8-10 reps', completed: false },
    { id: '4', name: 'Cable Tricep Pushdowns', target: 'Triceps', sets: '3 sets × 12-15 reps', completed: false },
    { id: '5', name: 'Hanging Leg Raises', target: 'Core', sets: '3 sets × 15 reps', completed: false },
  ]);

  const toggleExercise = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === id) {
          const next = !ex.completed;
          if (next) success('Set Completed!', `Logged ${ex.name}`);
          return { ...ex, completed: next };
        }
        return ex;
      })
    );
  };

  const completedCount = exercises.filter((e) => e.completed).length;
  const progressPercent = Math.round((completedCount / exercises.length) * 100);

  return (
    <Card className="p-6 bg-forge-900 border-forge-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forge-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange font-heading">
              Today&apos;s Workout Routine
            </span>
          </div>
          <h3 className="text-xl font-bold font-heading text-white mt-1">
            Upper Body Push &amp; Shoulders Hypertrophy
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-forge-400">
          <span className="flex items-center gap-1.5 bg-forge-950 px-3 py-1.5 rounded-xl border border-forge-800">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            60 Mins
          </span>
          <span className="flex items-center gap-1.5 bg-forge-950 px-3 py-1.5 rounded-xl border border-forge-800">
            <Flame className="w-3.5 h-3.5 text-brand-red" />
            ~520 kcal
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-4 space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-forge-400">Completion Status</span>
          <span className="text-brand-orange">{completedCount} of {exercises.length} Exercises ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-forge-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-red to-brand-orange transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Exercise Checklist */}
      <div className="space-y-2.5 my-5">
        {exercises.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleExercise(item.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              item.completed
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                : 'bg-forge-950/60 border-forge-800 hover:border-forge-700 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-forge-500 shrink-0" />
              )}
              <div>
                <p className={`text-xs sm:text-sm font-bold font-heading ${item.completed ? 'line-through opacity-70' : ''}`}>
                  {item.name}
                </p>
                <span className="text-[11px] text-forge-400">
                  {item.target} • {item.sets}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forge-900 border border-forge-800 text-forge-400">
              {item.completed ? 'Done' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/workouts" className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full" leftIcon={<Dumbbell className="w-3.5 h-3.5" />}>
            Browse Workout Library
          </Button>
        </Link>
        <Link href="/dashboard/progress" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Log Body Metrics
          </Button>
        </Link>
      </div>
    </Card>
  );
}
