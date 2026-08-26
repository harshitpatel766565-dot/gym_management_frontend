'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QrCode, PlusCircle, CalendarPlus, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { attendanceService } from '@/services/attendanceService';
import Link from 'next/link';

export function QuickActions({ onCheckInSuccess }: { onCheckInSuccess?: () => void }) {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckIn = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const res = await attendanceService.checkInToday(user.id, user.name);
      setIsCheckedIn(true);
      success('Check-In Recorded!', res.message);
      if (onCheckInSuccess) onCheckInSuccess();
    } catch {
      info('Already Logged', 'Attendance already marked for today.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 bg-forge-900 border-forge-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-white font-heading">
          Quick Actions
        </h4>
        <span className="text-xs text-forge-400 font-medium">Instant Member Controls</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Check In Button */}
        <Button
          onClick={handleCheckIn}
          isLoading={isProcessing}
          variant={isCheckedIn ? 'secondary' : 'primary'}
          size="md"
          className="flex-col h-auto py-4 text-xs gap-2"
        >
          {isCheckedIn ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <QrCode className="w-6 h-6" />
          )}
          <span>{isCheckedIn ? 'Checked In' : 'Gym Check-In'}</span>
        </Button>

        {/* Log Metrics */}
        <Link href="/dashboard/progress" className="w-full">
          <Button
            variant="secondary"
            size="md"
            className="w-full flex-col h-auto py-4 text-xs gap-2"
          >
            <PlusCircle className="w-6 h-6 text-blue-400" />
            <span>Log Progress</span>
          </Button>
        </Link>

        {/* Book Session */}
        <Link href="/dashboard/bookings" className="w-full">
          <Button
            variant="secondary"
            size="md"
            className="w-full flex-col h-auto py-4 text-xs gap-2"
          >
            <CalendarPlus className="w-6 h-6 text-emerald-400" />
            <span>Book Coach</span>
          </Button>
        </Link>

        {/* Upgrade Plan */}
        <Link href="/membership" className="w-full">
          <Button
            variant="secondary"
            size="md"
            className="w-full flex-col h-auto py-4 text-xs gap-2"
          >
            <Zap className="w-6 h-6 text-amber-400" />
            <span>Manage Plan</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
