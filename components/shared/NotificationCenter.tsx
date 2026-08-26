'use client';

import React, { useState } from 'react';
import { Bell, Check, Sparkles, X } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '@/services/mockData';
import { Notification } from '@/types/notification';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-forge-750 bg-forge-900/80 hover:bg-forge-800 text-forge-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-forge-900 border border-forge-750 shadow-2xl p-4 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-forge-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  <span className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-red/20 text-brand-red border border-brand-red/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-forge-400 hover:text-brand-orange transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-forge-800/60 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-forge-400 text-xs">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`p-3 transition-colors rounded-xl cursor-pointer hover:bg-forge-800/50 ${
                        !item.isRead ? 'bg-brand-red/5 border-l-2 border-brand-red' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-white font-heading">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-forge-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-forge-400 mt-1">{item.message}</p>
                      {item.actionUrl && (
                        <Link
                          href={item.actionUrl}
                          onClick={() => setIsOpen(false)}
                          className="inline-block text-[11px] text-brand-orange hover:underline font-semibold mt-2"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
