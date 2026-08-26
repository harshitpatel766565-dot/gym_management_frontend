'use client';

import React from 'react';
import { Dumbbell, ShieldCheck, Flame, HeartPulse, Sparkles, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: <Dumbbell className="w-6 h-6 text-brand-orange" />,
    title: 'Olympic-Grade Equipment',
    description: 'Eleiko calibrated barbells, Rogue power racks, Hammer Strength plate-loaded machines, and air assault bikes maintained to highest standards.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    title: 'Certified Master Coaches',
    description: 'Every coach holds CSCS, ISSA, or CrossFit Level 3 certifications with verified experience training top-tier athletes.',
  },
  {
    icon: <HeartPulse className="w-6 h-6 text-brand-red" />,
    title: 'Personalized Regimens',
    description: 'Custom progressive overload cycles, InBody body fat analysis, and periodized sports nutrition tailored to your specific metabolism.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    title: 'Ultra-Clean Luxury Facility',
    description: 'Hospital-grade HEPA air filtration, continuous sanitation cycles, private showers, infrared saunas, and towel service.',
  },
  {
    icon: <Smartphone className="w-6 h-6 text-blue-400" />,
    title: 'Smart Member App',
    description: 'Log weights, track body measurements with interactive charts, scan QR attendance, and book 1-on-1 sessions seamlessly.',
  },
  {
    icon: <Flame className="w-6 h-6 text-purple-400" />,
    title: 'High-Voltage Community',
    description: 'Train alongside disciplined, goal-driven individuals in an electric environment that demands and inspires consistency.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-forge-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-2">
            <Sparkles className="w-4 h-4" />
            <span>The Ironforge Difference</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
            WHY TRAIN AT <span className="text-brand-red">IRONFORGE</span>
          </h2>
          <p className="text-forge-400 text-sm sm:text-base mt-2">
            We eliminated standard gym compromises to engineer the ultimate training sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-forge-950/70 border border-forge-800 hover:border-brand-red/40 transition-all duration-300 shadow-xl group hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-forge-900 border border-forge-750 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading text-white tracking-wide group-hover:text-brand-orange transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-forge-400 mt-2.5 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
