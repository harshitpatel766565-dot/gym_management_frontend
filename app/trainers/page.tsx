'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_TRAINERS } from '@/services/mockData';
import { Trainer, TrainerSpecialization } from '@/types/trainer';
import { trainerService } from '@/services/trainerService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Search,
  Star,
  Award,
  ArrowRight,
  UserCheck,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Filter,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  useEffect(() => {
    async function loadTrainers() {
      try {
        const res = await trainerService.getAllTrainers();
        if (res.success && res.data) {
          setTrainers(res.data);
        }
      } catch (err) {
        console.error("Failed to load trainers:", err);
      }
    }
    loadTrainers();
  }, []);

  const specializations = [
    'All',
    'Strength Coach',
    'Nutrition Coach',
    'CrossFit Coach',
    'Weight Loss Coach',
    'Yoga Instructor',
    'Master Coach',
  ];

  const filteredTrainers = trainers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'All' || t.specialization === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900 border border-brand-red/40 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-4">
            <UserCheck className="w-4 h-4" />
            <span>Master Coaches &amp; Sports Scientists</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight uppercase">
            EXPERT <span className="text-brand-red">TRAINERS</span>
          </h1>
          <p className="text-forge-300 text-sm sm:text-base mt-2">
            Work with world-class coaches who customize your lifts, correct your biomechanics, and accelerate your personal transformation.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-6 rounded-3xl bg-forge-900/80 border border-forge-800 shadow-2xl mb-12 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-80">
              <Input
                placeholder="Search coach by name or focus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-forge-400" />}
              />
            </div>

            {/* Specialization Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400 font-heading shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-brand-orange" /> Specialty:
              </span>
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase font-heading tracking-wider transition-all cursor-pointer shrink-0 ${
                    selectedSpecialty === spec
                      ? 'bg-brand-red text-white shadow-md'
                      : 'bg-forge-950 border border-forge-800 text-forge-400 hover:text-white'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trainers Grid */}
        {filteredTrainers.length === 0 ? (
          <div className="py-20 text-center text-forge-400 border border-dashed border-forge-800 rounded-3xl bg-forge-900/30">
            <UserCheck className="w-12 h-12 mx-auto text-forge-600 mb-3" />
            <h3 className="text-lg font-bold font-heading text-white">No Coaches Match Your Search</h3>
            <p className="text-xs text-forge-500 mt-1">Try resetting the specialization filter or searching another term.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrainers.map((trainer, idx) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-3xl bg-forge-900/90 border border-forge-800 hover:border-brand-red/50 transition-all duration-300 overflow-hidden shadow-xl hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo */}
                  <div className="relative h-72 w-full overflow-hidden">
                    <img
                      src={trainer.avatarUrl}
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forge-900 via-transparent to-black/30" />

                    <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {trainer.rating} ({trainer.reviewCount})
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <Badge variant="flame">{trainer.specialization}</Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-heading text-white tracking-wide group-hover:text-brand-orange transition-colors">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-forge-400 mt-1">{trainer.title}</p>
                    <p className="text-xs text-forge-300 mt-3 line-clamp-2 leading-relaxed">
                      {trainer.bio}
                    </p>

                    {/* Certifications preview */}
                    <div className="my-4 pt-4 border-t border-forge-800/80 space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-forge-300">
                        <Award className="w-4 h-4 text-brand-orange shrink-0" />
                        <span className="truncate">{trainer.certifications.join(' • ')}</span>
                      </div>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-2 pt-1 text-forge-400">
                      {trainer.socialLinks.instagram && (
                        <a href={trainer.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-forge-950 border border-forge-800 hover:text-brand-orange transition-colors">
                          <Instagram className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {trainer.socialLinks.twitter && (
                        <a href={trainer.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-forge-950 border border-forge-800 hover:text-blue-400 transition-colors">
                          <Twitter className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {trainer.socialLinks.youtube && (
                        <a href={trainer.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-forge-950 border border-forge-800 hover:text-red-500 transition-colors">
                          <Youtube className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-6 pt-0">
                  <Link href={`/trainers/${trainer.id}`} className="block w-full">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      View Profile &amp; Book Session
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
