'use client';

import React, { useState } from 'react';
import { INITIAL_EXERCISES } from '@/services/mockData';
import { Exercise, MuscleGroup, ExerciseDifficulty } from '@/types/workout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Search,
  Dumbbell,
  Flame,
  Clock,
  Repeat,
  Info,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkoutsPage() {
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | 'All'>('All');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const muscleGroups: (MuscleGroup | 'All')[] = [
    'All',
    'Chest',
    'Back',
    'Legs',
    'Arms',
    'Shoulders',
    'Abs',
    'Full Body',
    'Cardio',
  ];

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipmentNeeded.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscle =
      selectedMuscle === 'All' || ex.targetMuscle === selectedMuscle;

    const matchesDifficulty =
      selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;

    return matchesSearch && matchesMuscle && matchesDifficulty;
  });

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900 border border-brand-red/40 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-4">
            <Dumbbell className="w-4 h-4" />
            <span>Master Every Movement</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight uppercase">
            WORKOUT <span className="text-brand-red">LIBRARY</span>
          </h1>
          <p className="text-forge-300 text-sm sm:text-base mt-2">
            Comprehensive directory of compound movements, isolation drills, and metabolic conditioning protocols with optimal sets, rep ranges, and rest intervals.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-6 rounded-3xl bg-forge-900/80 border border-forge-800 shadow-2xl mb-12 space-y-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Input
                placeholder="Search exercise or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-forge-400" />}
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-brand-orange" /> Level:
              </span>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff as ExerciseDifficulty | 'All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase font-heading tracking-wider transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-brand-red text-white shadow-md'
                      : 'bg-forge-950 border border-forge-800 text-forge-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Muscle Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-forge-800">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading shrink-0 mr-1">
              Muscle Target:
            </span>
            {muscleGroups.map((muscle) => (
              <button
                key={muscle}
                onClick={() => setSelectedMuscle(muscle)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase font-heading tracking-wider transition-all cursor-pointer shrink-0 ${
                  selectedMuscle === muscle
                    ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/30'
                    : 'bg-forge-950 border border-forge-800 text-forge-400 hover:text-white hover:border-forge-700'
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <div className="py-20 text-center text-forge-400 border border-dashed border-forge-800 rounded-3xl bg-forge-900/30">
            <Dumbbell className="w-12 h-12 mx-auto text-forge-600 mb-3" />
            <h3 className="text-lg font-bold font-heading text-white">No Exercises Found</h3>
            <p className="text-xs text-forge-500 mt-1">Try selecting a different muscle group or keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise, idx) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="rounded-3xl bg-forge-900/90 border border-forge-800 hover:border-brand-red/50 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forge-900 via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <Badge variant="flame">{exercise.targetMuscle}</Badge>
                      <Badge variant={exercise.difficulty === 'Advanced' ? 'danger' : exercise.difficulty === 'Intermediate' ? 'warning' : 'success'}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold font-heading text-white tracking-wide group-hover:text-brand-orange transition-colors">
                      {exercise.name}
                    </h3>

                    {/* Prescription Metrics */}
                    <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-forge-950 border border-forge-800 text-center text-xs">
                      <div>
                        <span className="font-bold text-white block font-heading">{exercise.sets}</span>
                        <span className="text-[10px] text-forge-400">Sets</span>
                      </div>
                      <div>
                        <span className="font-bold text-brand-orange block font-heading">{exercise.reps}</span>
                        <span className="text-[10px] text-forge-400">Reps</span>
                      </div>
                      <div>
                        <span className="font-bold text-brand-red block font-heading">{exercise.restTimeSeconds}s</span>
                        <span className="text-[10px] text-forge-400">Rest</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-forge-400">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-brand-red" />
                        ~{exercise.caloriesBurnedEstimate} kcal
                      </span>
                      <span className="truncate max-w-[140px] text-[11px]">
                        {exercise.equipmentNeeded.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-5 pt-0">
                  <Button
                    onClick={() => setActiveExercise(exercise)}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    leftIcon={<Info className="w-4 h-4" />}
                  >
                    View Technique &amp; Guide
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {activeExercise && (
        <Modal
          isOpen={!!activeExercise}
          onClose={() => setActiveExercise(null)}
          title={activeExercise.name}
          description={`Target Muscle: ${activeExercise.targetMuscle} • ${activeExercise.difficulty} Level`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-forge-800">
              <img
                src={activeExercise.imageUrl}
                alt={activeExercise.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forge-950 via-transparent to-transparent" />
            </div>

            {/* Set prescription */}
            <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl bg-forge-950 border border-forge-800 text-center">
              <div>
                <span className="text-xl font-bold font-heading text-white">{activeExercise.sets}</span>
                <span className="text-[10px] text-forge-400 block uppercase">Working Sets</span>
              </div>
              <div>
                <span className="text-xl font-bold font-heading text-brand-orange">{activeExercise.reps}</span>
                <span className="text-[10px] text-forge-400 block uppercase">Rep Range</span>
              </div>
              <div>
                <span className="text-xl font-bold font-heading text-emerald-400">{activeExercise.restTimeSeconds}s</span>
                <span className="text-[10px] text-forge-400 block uppercase">Rest Time</span>
              </div>
              <div>
                <span className="text-xl font-bold font-heading text-brand-red">~{activeExercise.caloriesBurnedEstimate}</span>
                <span className="text-[10px] text-forge-400 block uppercase">Calories</span>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading mb-3">
                Execution &amp; Biomechanical Cueing
              </h4>
              <div className="space-y-2.5">
                {activeExercise.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-forge-200">
                    <span className="w-5 h-5 rounded-full bg-brand-red/20 text-brand-red font-bold flex items-center justify-center shrink-0 mt-0.5 font-heading">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment & Tips */}
            <div className="p-4 rounded-2xl bg-forge-950 border border-forge-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-forge-400">Required Gear:</span>
                <span className="font-semibold text-white">{activeExercise.equipmentNeeded}</span>
              </div>
              {activeExercise.secondaryMuscles && (
                <div className="flex justify-between">
                  <span className="text-forge-400">Secondary Muscles:</span>
                  <span className="font-semibold text-forge-300">{activeExercise.secondaryMuscles.join(', ')}</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => setActiveExercise(null)}
              variant="primary"
              size="md"
              className="w-full uppercase font-heading"
            >
              Got It • Add to Routine
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
