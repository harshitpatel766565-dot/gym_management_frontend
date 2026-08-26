'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Flame, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-24 bg-forge-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-10 sm:p-16 overflow-hidden bg-gradient-to-r from-forge-900 via-brand-darkRed/40 to-forge-900 border-2 border-brand-red/40 shadow-forge-glow-lg text-center"
        >
          {/* Background grid / glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/15 blur-[120px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-brand-red/50 text-xs font-extrabold uppercase tracking-widest text-brand-orange font-heading">
              <Zap className="w-4 h-4 fill-brand-orange" />
              <span>Limited Availability Passes</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading text-white tracking-tight uppercase leading-none">
              READY TO FORGE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-orange to-amber-400">
                YOUR BEST PHYSIQUE?
              </span>
            </h2>

            <p className="text-forge-300 text-sm sm:text-lg max-w-xl mx-auto">
              Join today and get immediate access to customized workout regimens, elite facilities, and expert coach guidance.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/membership" className="w-full sm:w-auto">
                <Button size="xl" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Claim Your Membership
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="xl" variant="outline">
                  Book Free 1-Day Trial Pass
                </Button>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-forge-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                No Long-Term Lock-in
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-brand-orange" />
                Instant App Access
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Free Fitness Assessment
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
