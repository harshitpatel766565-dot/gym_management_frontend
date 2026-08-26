'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_TRAINERS } from '@/services/mockData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, ArrowRight, Award, Instagram, Twitter, Youtube, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function TrainersPreview() {
  return (
    <section className="py-24 bg-forge-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-2">
              <UserCheck className="w-4 h-4" />
              <span>World-Class Mentorship</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
              MEET OUR <span className="text-brand-red">EXPERT COACHES</span>
            </h2>
            <p className="text-forge-400 text-sm sm:text-base max-w-xl mt-2">
              Certified master trainers, Olympic qualifiers, and sports nutritionists committed to unlocking your peak human performance.
            </p>
          </div>

          <Link href="/trainers">
            <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 20+ Coaches
            </Button>
          </Link>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_TRAINERS.slice(0, 4).map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-3xl bg-forge-900/80 border border-forge-800 hover:border-brand-red/50 transition-all duration-300 overflow-hidden shadow-xl hover:-translate-y-1.5 group flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={trainer.avatarUrl}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forge-900 via-transparent to-transparent" />

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{trainer.rating}</span>
                  </div>

                  {/* Specialty badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="flame">{trainer.specialization}</Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-lg font-bold font-heading text-white tracking-wide group-hover:text-brand-orange transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-forge-400 mt-0.5 line-clamp-1">{trainer.title}</p>

                  <div className="flex items-center gap-1.5 text-xs text-forge-300 mt-3 pt-3 border-t border-forge-800">
                    <Award className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>{trainer.experienceYears}+ Yrs Exp • {trainer.certifications[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <Link href={`/trainers/${trainer.id}`} className="block w-full">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Profile & Book
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
