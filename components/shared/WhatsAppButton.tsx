'use client';

import React from 'react';
import { BRAND } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WhatsAppButton() {
  const message = encodeURIComponent('Hi IRONFORGE Team! I would like to inquire about gym memberships, training programs, and booking a trial pass.');
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all border border-emerald-400/40 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline font-heading uppercase tracking-wider text-xs">Chat with Us</span>
    </motion.a>
  );
}
