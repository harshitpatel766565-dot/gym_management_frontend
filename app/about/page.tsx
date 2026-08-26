'use client';

import React from 'react';
import { HERO_STATS, BRAND } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Flame, ShieldCheck, Dumbbell, Award, Target, Eye, Sparkles, ArrowRight, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      {/* Page Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900 border border-brand-red/40 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-4"
          >
            <Flame className="w-4 h-4" />
            <span>The Ironforge Legacy</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight uppercase"
          >
            BUILT ON DISCIPLINE, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange">
              DRIVEN BY RESULTS
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-forge-300 text-base sm:text-xl max-w-2xl mx-auto mt-4"
          >
            Founded with a singular mission: to provide the ultimate training atmosphere where excuses die and champions are forged.
          </motion.p>
        </div>
      </section>

      {/* Gym Story & Vision Grid */}
      <section className="py-16 bg-forge-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading">
                <Sparkles className="w-4 h-4" />
                <span>Our Heritage</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white uppercase">
                From Underground Iron Dungeon to <span className="text-brand-red">Premier Fitness Institute</span>
              </h2>
              <p className="text-forge-300 text-sm sm:text-base leading-relaxed">
                IRONFORGE began over 10 years ago as a raw, no-nonsense strength sanctuary for powerlifters and athletes dissatisfied with commercial corporate gyms that prioritized smoothies over proper squat racks.
              </p>
              <p className="text-forge-300 text-sm sm:text-base leading-relaxed">
                Today, IRONFORGE has evolved into a premier 25,000 sq.ft state-of-the-art facility blending calibrated Olympic lifting equipment, high-energy CrossFit arenas, infrared recovery spas, and sports science nutritionists under one roof.
              </p>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl bg-forge-950 border border-forge-800 text-center">
                    <span className="text-2xl sm:text-3xl font-black font-heading text-brand-orange">
                      {stat.value}
                    </span>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-forge-400 font-heading mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Collage */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80"
                alt="Gym weights arena"
                className="rounded-3xl object-cover h-64 w-full shadow-2xl border border-forge-800"
              />
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
                alt="CrossFit training area"
                className="rounded-3xl object-cover h-64 w-full shadow-2xl border border-forge-800 mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80"
                alt="Personal training session"
                className="rounded-3xl object-cover h-64 w-full shadow-2xl border border-forge-800 -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80"
                alt="Olympic lifting platform"
                className="rounded-3xl object-cover h-64 w-full shadow-2xl border border-forge-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-forge-900 border-forge-800">
              <div className="w-12 h-12 rounded-2xl bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white uppercase tracking-wide">
                Our Mission
              </h3>
              <p className="text-sm text-forge-300 mt-3 leading-relaxed">
                To empower individuals of all backgrounds to conquer their physical and mental frontiers through world-class strength programming, evidence-based nutrition coaching, and an uncompromising standard of accountability.
              </p>
            </Card>

            <Card className="p-8 bg-forge-900 border-forge-800">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white uppercase tracking-wide">
                Our Vision
              </h3>
              <p className="text-sm text-forge-300 mt-3 leading-relaxed">
                To establish the benchmark for commercial fitness excellence worldwide by cultivating a global brotherhood and sisterhood of healthy, resilient, high-performing human beings.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section className="py-16 bg-forge-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black font-heading text-white uppercase">
              The Four Pillars of IRONFORGE
            </h2>
            <p className="text-forge-400 text-sm mt-2">
              Our non-negotiable operational principles that guarantee an elite experience every visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-forge-950 border border-forge-800 text-center">
              <Dumbbell className="w-8 h-8 text-brand-orange mx-auto mb-4" />
              <h4 className="text-base font-bold font-heading text-white uppercase">Modern Equipment</h4>
              <p className="text-xs text-forge-400 mt-2">Eleiko, Hammer Strength, Rogue, and Concept2 machinery.</p>
            </div>
            <div className="p-6 rounded-2xl bg-forge-950 border border-forge-800 text-center">
              <Award className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-base font-bold font-heading text-white uppercase">Expert Trainers</h4>
              <p className="text-xs text-forge-400 mt-2">CSCS and Olympic credentials with verified athlete results.</p>
            </div>
            <div className="p-6 rounded-2xl bg-forge-950 border border-forge-800 text-center">
              <HeartPulse className="w-8 h-8 text-brand-red mx-auto mb-4" />
              <h4 className="text-base font-bold font-heading text-white uppercase">Personalized Workouts</h4>
              <p className="text-xs text-forge-400 mt-2">Periodized training cycles and custom macronutrient profiles.</p>
            </div>
            <div className="p-6 rounded-2xl bg-forge-950 border border-forge-800 text-center">
              <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h4 className="text-base font-bold font-heading text-white uppercase">Clean Environment</h4>
              <p className="text-xs text-forge-400 mt-2">HEPA air purification, sanitized stations, and luxury locker rooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pt-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-3xl font-black font-heading text-white uppercase">
            Experience IRONFORGE Firsthand
          </h3>
          <p className="text-forge-400 text-sm mt-2 mb-6">
            Take a private tour of our facility, meet our master coaches, and test our equipment with a complimentary guest pass.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/membership">
              <Button size="lg" variant="primary">View Memberships</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Book Facility Tour</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
