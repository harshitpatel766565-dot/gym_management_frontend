'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Booking, BookingStatus } from '@/types/booking';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function AdminBookingsPage() {
  const { success, error } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadBookings = async () => {
    try {
      const res = await adminService.getAllBookings();
      setBookings(res.data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await adminService.updateBookingStatus(id, newStatus);
      success('Booking Updated', `Status changed to ${newStatus}.`);
      loadBookings();
    } catch {
      error('Error', 'Unable to update booking status.');
    }
  };

  const filtered = bookings.filter(
    (b) =>
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Class &amp; Coach Booking Moderation
          </h1>
          <p className="text-xs text-forge-400 mt-0.5">
            Approve requests, prevent scheduling overlaps, and moderate athlete bookings.
          </p>
        </div>

        <Input
          placeholder="Filter by athlete or coach..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <Card className="p-0 bg-forge-900 border-forge-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase bg-forge-950/60">
                <th className="py-4 px-5 font-bold">Athlete</th>
                <th className="py-4 px-4 font-bold">Coach</th>
                <th className="py-4 px-4 font-bold">Category</th>
                <th className="py-4 px-4 font-bold">Date &amp; Slot</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-5 font-bold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-850">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-forge-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-bold text-white font-heading text-sm">{b.userName}</p>
                    <span className="text-[10px] text-forge-400">{b.userEmail}</span>
                  </td>
                  <td className="py-4 px-4 text-forge-200 font-semibold">{b.trainerName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-forge-800 text-forge-300 font-semibold">
                      {b.serviceType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-forge-300">
                    <p>{formatDate(b.date)}</p>
                    <span className="text-[10px] text-forge-400">{b.timeSlot}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900 text-emerald-400 font-bold text-[10px] uppercase font-heading transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'cancelled')}
                          className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 font-bold text-[10px] uppercase font-heading transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
