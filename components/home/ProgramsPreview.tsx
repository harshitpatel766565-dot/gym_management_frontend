'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_PROGRAMS } from '@/services/mockData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Flame, Clock, Users, Star, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProgramsPreview() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const filtered = selectedDifficulty === 'All'
    ? INITIAL_PROGRAMS.slice(0, 6)
    : INITIAL_PROGRAMS.filter((p) => p.difficulty === selectedDifficulty);

  return (
    <section className="py-24 bg-forge-950 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-2">
              <Flame className="w-4 h-4" />
              <span>Engineered For Results</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
              FEATURED TRAINING <span className="text-brand-red">PROGRAMS</span>
            </h2>
            <p className="text-forge-400 text-sm sm:text-base max-w-xl mt-2">
              Designed by master sports scientists and strength coaches to systematically break through genetic plateaus.
            </p>
          </div>

          {/* Difficulty filter chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-heading transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                    : 'bg-forge-900 border border-forge-800 text-forge-400 hover:text-white hover:border-forge-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((program, index) => (
            <motion.div
              key={program._id || program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-3xl bg-forge-900/90 border border-forge-800 hover:border-brand-red/50 transition-all duration-300 overflow-hidden shadow-xl hover:-translate-y-1.5 group flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forge-900 via-transparent to-black/30" />

                  {/* Top Badges */}
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

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold font-heading text-white tracking-wide group-hover:text-brand-orange transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-xs text-forge-400 mt-2 line-clamp-2 leading-relaxed">
                    {program.shortDescription}
                  </p>

                  {/* Program Meta Metrics */}
                  <div className="grid grid-cols-2 gap-3 my-5 py-3 border-y border-forge-800/80 text-xs">
                    <div className="flex items-center gap-2 text-forge-300">
                      <Clock className="w-4 h-4 text-brand-orange" />
                      <span>{program.durationWeeks} Weeks ({program.sessionsPerWeek}x/wk)</span>
                    </div>
                    <div className="flex items-center gap-2 text-forge-300">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>{program.enrolledCount}+ Enrolled</span>
                    </div>
                  </div>

                  {/* Coach info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={program.trainerAvatar}
                      alt={program.trainerName}
                      className="w-8 h-8 rounded-full object-cover border border-forge-700"
                    />
                    <div className="text-xs">
                      <span className="text-forge-400 block">Program Lead</span>
                      <span className="font-bold text-white font-heading">{program.trainerName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-6 pt-0">
                <Link href={`/programs/${program._id || program.id}`} className="block w-full">
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red transition-all"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View Program
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore All CTA */}
        <div className="mt-14 text-center">
          <Link href="/programs">
            <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore All 15+ Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
