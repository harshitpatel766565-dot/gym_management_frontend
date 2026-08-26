'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HERO_STATS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Flame, Shield, Play, Trophy, Users, Dumbbell } from 'lucide-react';
import { homepageService, HomepageContent } from '@/services/homepageService';

export function HeroSection() {
  const [content, setContent] = useState<HomepageContent>({
    heroTitle: 'BUILD YOUR<br />STRONGEST SELF',
    heroSubtitle: 'Train harder. Live stronger. Become unstoppable.',
    heroBadgeText: 'New Summer Transformation Protocols Live',
    heroBackgroundImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&auto=format&fit=crop&q=85',
  });

  useEffect(() => {
    async function loadHeroContent() {
      try {
        const res = await homepageService.getHomepageContent();
        if (res.success && res.data) {
          // If title has no html, we can format it nicely
          let title = res.data.heroTitle;
          if (title === "BUILD YOUR STRONGEST SELF") {
            title = 'BUILD YOUR <br class="hidden sm:inline" /> <span class="bg-gradient-to-r from-brand-red via-brand-orange to-amber-400 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(225,29,72,0.3)]">STRONGEST SELF</span>';
          }
          setContent({
            ...res.data,
            heroTitle: title,
          });
        }
      } catch (err) {
        console.error('Failed to load dynamic hero content:', err);
      }
    }
    loadHeroContent();
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Dark & Gradient Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 animate-pulse-slow"
        style={{
          backgroundImage: `url('${content.heroBackgroundImage}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forge-950 via-forge-950/80 to-black/75 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/15 via-transparent to-transparent z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        {/* Floating Top Badge */}
        {content.heroBadgeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-900/80 border border-brand-red/40 backdrop-blur-md shadow-lg shadow-brand-red/10 mb-8"
          >
            <Flame className="w-4 h-4 text-brand-orange animate-bounce" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-forge-200 font-heading">
              {content.heroBadgeText}
            </span>
          </motion.div>
        )}

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight text-white uppercase leading-[0.95] max-w-5xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content.heroTitle }}
        />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-forge-300 font-normal max-w-2xl mx-auto font-sans leading-relaxed tracking-wide"
        >
          {content.heroSubtitle}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link href="/membership" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-forge-glow-lg text-base"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Join Now
            </Button>
          </Link>

          <Link href="/programs" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base backdrop-blur-md bg-forge-950/40"
              leftIcon={<Dumbbell className="w-5 h-5 text-brand-orange" />}
            >
              Explore Programs
            </Button>
          </Link>
        </motion.div>

        {/* Animated Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {HERO_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="p-5 sm:p-6 rounded-2xl bg-forge-900/60 backdrop-blur-xl border border-forge-800/80 shadow-2xl hover:border-brand-red/50 hover:bg-forge-900/90 transition-all group"
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight group-hover:text-brand-orange transition-colors">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-forge-400 font-heading mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
