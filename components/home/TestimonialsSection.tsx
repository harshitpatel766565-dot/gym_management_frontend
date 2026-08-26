'use client';

import React from 'react';
import { TESTIMONIALS } from '@/lib/constants';
import { Star, Quote, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-forge-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange font-heading mb-2">
            <Award className="w-4 h-4" />
            <span>Member Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
            PROVEN BY <span className="text-brand-red">OUR ATHLETES</span>
          </h2>
          <p className="text-forge-400 text-sm sm:text-base mt-2">
            Real stories, real numbers, and life-altering transformations forged in our facility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-forge-900/60 border border-forge-800 hover:border-brand-red/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Quote icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-forge-700" />
                </div>

                <p className="text-sm text-forge-200 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>

                {item.achievement && (
                  <div className="mt-4 px-3 py-1.5 rounded-xl bg-brand-red/10 border border-brand-red/30 text-brand-orange text-xs font-bold font-heading">
                    {item.achievement}
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex items-center gap-3.5 mt-8 pt-4 border-t border-forge-800">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-brand-red/50"
                />
                <div>
                  <h4 className="text-sm font-bold font-heading text-white">{item.name}</h4>
                  <p className="text-xs text-forge-400">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
