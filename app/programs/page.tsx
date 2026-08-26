'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_PROGRAMS } from '@/services/mockData';
import { Program, ExerciseDifficulty } from '@/types/workout';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Search, Flame, Clock, Users, Star, ArrowRight, Dumbbell, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      try {
        setIsLoading(true);
        const res = await adminService.getPrograms();
        if (res.success && res.data && res.data.length > 0) {
          setPrograms(res.data);
        } else {
          setPrograms(INITIAL_PROGRAMS);
        }
      } catch {
        setPrograms(INITIAL_PROGRAMS);
      } finally {
        setIsLoading(false);
      }
    }
    loadPrograms();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Weight Training',
    'Muscle Building',
    'Weight Loss',
    'CrossFit',
    'HIIT',
    'Yoga',
  ];

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trainerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

    const matchesCategory =
      selectedCategory === 'All' || p.title.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900 border border-brand-red/40 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-4">
            <Flame className="w-4 h-4" />
            <span>Targeted Physique Transformations</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight uppercase">
            TRAINING <span className="text-brand-red">PROGRAMS</span>
          </h1>
          <p className="text-forge-300 text-sm sm:text-base mt-2">
            Scientifically structured workout cycles designed for raw power, hyper-efficient fat loss, and aesthetic muscular hypertrophy.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-6 rounded-3xl bg-forge-900/80 border border-forge-800 shadow-2xl mb-12 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="w-full md:w-80">
              <Input
                placeholder="Search programs or trainers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-forge-400" />}
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-brand-orange" /> Difficulty:
              </span>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
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

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-forge-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading shrink-0 mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-heading uppercase transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/40'
                    : 'text-forge-400 hover:text-white hover:bg-forge-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="py-20 text-center text-forge-400 border border-dashed border-forge-800 rounded-3xl bg-forge-900/30">
            <Dumbbell className="w-12 h-12 mx-auto text-forge-600 mb-3" />
            <h3 className="text-lg font-bold font-heading text-white">No Programs Match Your Criteria</h3>
            <p className="text-xs text-forge-500 mt-1">Try changing your search keywords or resetting the filters.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('All');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, idx) => (
              <motion.div
                key={program._id || program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-3xl bg-forge-900/90 border border-forge-800 hover:border-brand-red/50 transition-all duration-300 overflow-hidden shadow-xl hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forge-900 via-transparent to-black/40" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <Badge variant={program.difficulty === 'Advanced' ? 'danger' : program.difficulty === 'Intermediate' ? 'warning' : 'success'}>
                        {program.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {program.rating}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold font-heading text-white tracking-wide group-hover:text-brand-orange transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-xs text-forge-400 mt-2 line-clamp-3 leading-relaxed">
                      {program.shortDescription}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 my-5 py-3 border-y border-forge-800/80 text-xs">
                      <div className="flex items-center gap-2 text-forge-300">
                        <Clock className="w-4 h-4 text-brand-orange" />
                        <span>{program.durationWeeks} Weeks • {program.sessionsPerWeek}x/wk</span>
                      </div>
                      <div className="flex items-center gap-2 text-forge-300">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>{program.enrolledCount}+ Athletes</span>
                      </div>
                    </div>

                    {/* Trainer Lead */}
                    <div className="flex items-center gap-3">
                      <img
                      src={program.trainerAvatar}
                      alt={program.trainerName}
                      className="w-9 h-9 rounded-full object-cover border border-brand-red/40"
                    />
                      <div className="text-xs">
                        <span className="text-forge-400 block">Lead Coach</span>
                        <span className="font-bold text-white font-heading">{program.trainerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-6 pt-0">
                  <Link href={`/programs/${program._id || program.id}`} className="block w-full">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Join Program &amp; View Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
