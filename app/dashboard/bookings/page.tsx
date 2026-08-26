'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { bookingService } from '@/services/bookingService';
import { trainerService } from '@/services/trainerService';
import { Booking, BookingServiceType } from '@/types/booking';
import { Trainer } from '@/types/trainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import {
  CalendarCheck,
  PlusCircle,
  Clock,
  User,
  Calendar,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function BookingsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Booking Form State
  const [serviceType, setServiceType] = useState<BookingServiceType>('Personal Trainer');
  const [trainerId, setTrainerId] = useState('');
  const [date, setDate] = useState('2026-08-25');
  const [timeSlot, setTimeSlot] = useState('07:30 AM - 08:30 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      const [bRes, tRes] = await Promise.all([
        bookingService.getUserBookings(user.id),
        trainerService.getAllTrainers(),
      ]);
      setBookings(bRes.data);
      setTrainers(tRes.data);
      if (tRes.data.length > 0) {
        setTrainerId(tRes.data[0].id);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const res = await bookingService.createBooking(user.id, user.name, user.email, {
        serviceType,
        trainerId,
        date,
        timeSlot,
        notes,
      });
      success('Session Booked!', res.message);
      setIsModalOpen(false);
      setNotes('');
      loadData();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Booking conflict.';
      error('Cannot Book', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      success('Booking Cancelled', 'The session slot has been released.');
      loadData();
    } catch {
      error('Error', 'Unable to cancel booking.');
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed');
  const pastBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
            Class &amp; Coach Bookings
          </h2>
          <p className="text-xs text-forge-400 mt-0.5">
            Schedule 1-on-1 personal coaching, CrossFit team WODs, and diet consultations.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Book New Session
        </Button>
      </div>

      {/* Upcoming Bookings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-brand-orange" />
          Confirmed &amp; Upcoming Sessions ({upcomingBookings.length})
        </h3>

        {upcomingBookings.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-forge-800 rounded-3xl bg-forge-900/30 text-forge-400">
            <Calendar className="w-10 h-10 mx-auto text-forge-600 mb-2" />
            <p className="text-sm font-semibold text-white">No Upcoming Sessions Scheduled</p>
            <p className="text-xs text-forge-500 mt-1">Book your next training slot with a coach.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingBookings.map((b) => (
              <Card key={b.id} className="p-6 bg-forge-900 border-forge-800 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'}>
                        {b.status}
                      </Badge>
                      <h4 className="text-xl font-bold font-heading text-white mt-2">
                        {b.serviceType}
                      </h4>
                    </div>

                    {b.trainerAvatar && (
                      <img
                        src={b.trainerAvatar}
                        alt={b.trainerName}
                        className="w-12 h-12 rounded-full object-cover border border-brand-red/40"
                      />
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-forge-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-orange shrink-0" />
                      <span>Coach: <strong className="text-white font-heading">{b.trainerName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Date: {formatDate(b.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Time: {b.timeSlot}</span>
                    </div>
                    {b.notes && (
                      <p className="text-[11px] text-forge-400 italic pt-1 border-t border-forge-850">
                        &ldquo;{b.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-forge-800 flex justify-between items-center">
                  <span className="text-[10px] text-forge-500 font-mono">Ref: {b.id}</span>
                  <Button
                    onClick={() => handleCancel(b.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/40 text-xs"
                  >
                    Cancel Session
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past / Cancelled History */}
      {pastBookings.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold font-heading text-forge-400 uppercase tracking-wide">
            Past &amp; Cancelled History ({pastBookings.length})
          </h3>

          <div className="overflow-x-auto rounded-2xl bg-forge-900 border border-forge-800">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-forge-800 text-forge-400 font-heading uppercase">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Trainer</th>
                  <th className="py-3 px-4">Date &amp; Slot</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-850">
                {pastBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3.5 px-4 font-semibold text-white">{b.serviceType}</td>
                    <td className="py-3.5 px-4 text-forge-300">{b.trainerName}</td>
                    <td className="py-3.5 px-4 text-forge-400">{formatDate(b.date)} • {b.timeSlot}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={b.status === 'completed' ? 'success' : 'outline'}>
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule a Session"
        description="Select your desired workout category, master coach, and available time slot."
        maxWidth="md"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <Select
            label="Service / Class Type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as BookingServiceType)}
            options={[
              { value: 'Personal Trainer', label: '1-on-1 Personal Trainer' },
              { value: 'CrossFit', label: 'CrossFit Squad WOD' },
              { value: 'Yoga', label: 'Mobility & Yoga Flow' },
              { value: 'Workout Session', label: 'General Strength Workout' },
              { value: 'Consultation', label: 'Diet & Nutrition Consultation' },
            ]}
          />

          <Select
            label="Assigned Coach"
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
            options={trainers.map((t) => ({
              value: t.id,
              label: `${t.name} (${t.specialization})`,
            }))}
          />

          <Input
            label="Session Date"
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Select
            label="Time Slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            options={[
              { value: '06:00 AM - 07:00 AM', label: '06:00 AM – 07:00 AM (Early Bird)' },
              { value: '07:30 AM - 08:30 AM', label: '07:30 AM – 08:30 AM (Peak Morning)' },
              { value: '09:00 AM - 10:00 AM', label: '09:00 AM – 10:00 AM' },
              { value: '05:00 PM - 06:00 PM', label: '05:00 PM – 06:00 PM (Evening Rush)' },
              { value: '06:30 PM - 07:30 PM', label: '06:30 PM – 07:30 PM' },
              { value: '08:00 PM - 09:00 PM', label: '08:00 PM – 09:00 PM (Night Owls)' },
            ]}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
              Specific Goals / Notes for Coach
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Focus on squat depth and hip mobility..."
              className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            size="lg"
            variant="primary"
            className="w-full uppercase font-heading tracking-wider mt-4"
          >
            Confirm &amp; Lock Slot
          </Button>
        </form>
      </Modal>
    </div>
  );
}
