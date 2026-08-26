'use client';

import React, { useState, useEffect } from 'react';
import { Search, Dumbbell, UserCheck, Flame, CreditCard, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { INITIAL_PROGRAMS, INITIAL_EXERCISES, INITIAL_TRAINERS, INITIAL_MEMBERSHIP_PLANS } from '@/services/mockData';
import Link from 'next/link';

export function QuickSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or trigger if caller provides handler
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredPrograms = query.trim()
    ? INITIAL_PROGRAMS.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.shortDescription.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredExercises = query.trim()
    ? INITIAL_EXERCISES.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.targetMuscle.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredTrainers = query.trim()
    ? INITIAL_TRAINERS.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.specialization.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredPlans = query.trim()
    ? INITIAL_MEMBERSHIP_PLANS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.tagline.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasResults =
    filteredPrograms.length > 0 ||
    filteredExercises.length > 0 ||
    filteredTrainers.length > 0 ||
    filteredPlans.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" showCloseButton={false}>
      <div className="space-y-4">
        {/* Search input bar */}
        <div className="relative flex items-center border-b border-forge-750 pb-4">
          <Search className="w-5 h-5 text-brand-orange shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search programs, workouts, coaches, or plans... (e.g. CrossFit, Bench, Marcus)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-forge-500 text-base focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-forge-400 bg-forge-800 rounded border border-forge-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto space-y-6 pt-2">
          {!query.trim() ? (
            <div className="py-8 text-center text-forge-400">
              <p className="text-sm">Type anything to search the entire IRONFORGE platform.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-forge-500">Popular:</span>
                {['CrossFit', 'Weight Training', 'Bench Press', 'Pro Plan', 'Marcus'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-forge-800/80 hover:bg-forge-750 text-forge-300 hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-forge-400">
              <p className="text-sm">No results found for &ldquo;<span className="text-white font-semibold">{query}</span>&rdquo;</p>
              <p className="text-xs text-forge-500 mt-1">Try searching for a different exercise, trainer name, or program.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Programs */}
              {filteredPrograms.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 mb-2 font-heading">
                    <Flame className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Training Programs</span>
                  </div>
                  <div className="space-y-1">
                    {filteredPrograms.map((p) => (
                      <Link
                        key={p.id}
                        href={`/programs/${p.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl bg-forge-950/60 hover:bg-forge-800 transition-colors border border-forge-800/60 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red font-bold text-xs font-heading">
                            {p.durationWeeks}W
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-brand-orange transition-colors">
                              {p.title}
                            </p>
                            <p className="text-xs text-forge-400">{p.difficulty} • Coach {p.trainerName}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-forge-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Workouts / Exercises */}
              {filteredExercises.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 mb-2 font-heading">
                    <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
                    <span>Workout Exercises</span>
                  </div>
                  <div className="space-y-1">
                    {filteredExercises.map((e) => (
                      <Link
                        key={e.id}
                        href={`/workouts`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl bg-forge-950/60 hover:bg-forge-800 transition-colors border border-forge-800/60 group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {e.name}
                          </p>
                          <p className="text-xs text-forge-400">Target: {e.targetMuscle} • {e.sets} sets × {e.reps}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-forge-800 text-forge-300">
                          {e.difficulty}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Trainers */}
              {filteredTrainers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 mb-2 font-heading">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Expert Trainers</span>
                  </div>
                  <div className="space-y-1">
                    {filteredTrainers.map((t) => (
                      <Link
                        key={t.id}
                        href={`/trainers/${t.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl bg-forge-950/60 hover:bg-forge-800 transition-colors border border-forge-800/60 group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatarUrl}
                            alt={t.name}
                            className="w-8 h-8 rounded-full object-cover border border-forge-700"
                          />
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {t.name}
                            </p>
                            <p className="text-xs text-forge-400">{t.specialization} • ★ {t.rating}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-forge-500 group-hover:text-white" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Membership Plans */}
              {filteredPlans.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 mb-2 font-heading">
                    <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                    <span>Membership Plans</span>
                  </div>
                  <div className="space-y-1">
                    {filteredPlans.map((pl) => (
                      <Link
                        key={pl.id}
                        href={`/membership`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl bg-forge-950/60 hover:bg-forge-800 transition-colors border border-forge-800/60 group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {pl.name} Tier
                          </p>
                          <p className="text-xs text-forge-400">{pl.tagline}</p>
                        </div>
                        <span className="text-xs font-bold text-brand-orange font-heading">
                          ₹{pl.monthlyPrice}/mo
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
