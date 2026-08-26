'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trainerService } from '@/services/trainerService';
import { bookingService } from '@/services/bookingService';
import { Trainer, TrainerReview } from '@/types/trainer';
import { BookingServiceType } from '@/types/booking';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatINR, formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  Star,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Quote,
  ShieldCheck,
  Zap,
  Instagram,
  Twitter,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';

export default function TrainerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [reviews, setReviews] = useState<TrainerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Form State
  const [selectedService, setSelectedService] = useState<BookingServiceType>('Personal Trainer');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-22');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!params.id) return;
      try {
        const trainerRes = await trainerService.getTrainerById(params.id as string);
        setTrainer(trainerRes.data);
        if (trainerRes.data.availableTimeSlots.length > 0) {
          setSelectedTimeSlot(trainerRes.data.availableTimeSlots[0]);
        }
        const reviewsRes = await trainerService.getTrainerReviews(params.id as string);
        setReviews(reviewsRes.data);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <LoadingSpinner label="Loading Coach Profile..." size="lg" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="pt-32 pb-20 max-w-lg mx-auto text-center px-4">
        <h2 className="text-2xl font-bold font-heading text-white">Trainer Not Found</h2>
        <p className="text-forge-400 text-sm mt-2 mb-6">This trainer profile could not be found.</p>
        <Link href="/trainers">
          <Button variant="primary">Return to Trainers</Button>
        </Link>
      </div>
    );
  }

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      error('Login Required', 'Please log in to book a training session with Coach ' + trainer.name);
      router.push('/login');
      return;
    }

    if (!selectedTimeSlot) {
      error('Time Slot Required', 'Please choose an available time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bookingService.createBooking(user.id, user.name, user.email, {
        serviceType: selectedService,
        trainerId: trainer.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: bookingNotes,
      });

      success('Session Confirmed!', res.message);
      router.push('/dashboard/bookings');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Booking failed.';
      error('Booking Conflict', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-forge-950 text-forge-100 min-h-screen">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/trainers"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forge-400 hover:text-white transition-colors mb-6 font-heading"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Coaches
        </Link>

        {/* Coach Header Card */}
        <div className="p-8 rounded-3xl bg-forge-900 border border-forge-800 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
          <img
            src={trainer.avatarUrl}
            alt={trainer.name}
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover border-2 border-brand-red shadow-2xl shrink-0"
          />

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Badge variant="flame">{trainer.specialization}</Badge>
              <span className="flex items-center gap-1 text-xs font-bold text-white bg-forge-950 px-3 py-1 rounded-full border border-forge-800">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {trainer.rating} ({trainer.reviewCount} reviews)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight uppercase">
              {trainer.name}
            </h1>
            <p className="text-sm font-semibold text-brand-orange">{trainer.title}</p>
            <p className="text-xs sm:text-sm text-forge-300 max-w-2xl leading-relaxed">
              {trainer.bio}
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-forge-800 max-w-md mx-auto md:mx-0 text-center">
              <div className="p-2 rounded-xl bg-forge-950 border border-forge-800">
                <span className="text-lg font-bold font-heading text-white">{trainer.experienceYears}+ Yrs</span>
                <span className="text-[10px] text-forge-400 block">Experience</span>
              </div>
              <div className="p-2 rounded-xl bg-forge-950 border border-forge-800">
                <span className="text-lg font-bold font-heading text-white">{trainer.activeClientsCount}</span>
                <span className="text-[10px] text-forge-400 block">Active Clients</span>
              </div>
              <div className="p-2 rounded-xl bg-forge-950 border border-forge-800">
                <span className="text-lg font-bold font-heading text-brand-orange">{formatINR(trainer.hourlyRate)}</span>
                <span className="text-[10px] text-forge-400 block">Hourly Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Credentials & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Certifications & Achievements */}
            <Card className="p-8 bg-forge-900 border-forge-800">
              <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-orange" />
                Certifications &amp; Accreditations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trainer.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="p-3 rounded-xl bg-forge-950 border border-forge-800 flex items-center gap-3 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">{cert}</span>
                  </div>
                ))}
              </div>

              {trainer.achievements && trainer.achievements.length > 0 && (
                <div className="mt-8 pt-6 border-t border-forge-800">
                  <h4 className="text-sm font-bold uppercase font-heading text-forge-300 mb-3">
                    Career Achievements
                  </h4>
                  <ul className="space-y-2 text-xs text-forge-300 list-disc list-inside">
                    {trainer.achievements.map((ach) => (
                      <li key={ach}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Client Reviews */}
            <Card className="p-8 bg-forge-900 border-forge-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2">
                  <Quote className="w-5 h-5 text-brand-red" />
                  Client Testimonials
                </h3>
                <span className="text-xs text-forge-400">{reviews.length} Verified Reviews</span>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-forge-950 border border-forge-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover border border-forge-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white font-heading">{rev.userName}</p>
                          <span className="text-[10px] text-forge-500">{formatDate(rev.date)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-forge-300 italic pt-1">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Col: Interactive Booking Widget */}
          <div>
            <Card className="p-8 bg-forge-900 border-2 border-brand-red/40 shadow-forge-glow sticky top-24">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange font-heading mb-1">
                <Zap className="w-4 h-4" />
                <span>Reserve 1-on-1 Time</span>
              </div>
              <h3 className="text-2xl font-black font-heading text-white uppercase mb-6">
                Book Private Session
              </h3>

              <form onSubmit={handleBookSession} className="space-y-4">
                {/* Service Type */}
                <Select
                  label="Session Category"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value as BookingServiceType)}
                  options={[
                    { value: 'Personal Trainer', label: '1-on-1 Personal Training' },
                    { value: 'CrossFit', label: 'CrossFit Technique & WOD' },
                    { value: 'Yoga', label: 'Mobility & Yoga Flow' },
                    { value: 'Workout Session', label: 'Strength Overload Session' },
                    { value: 'Consultation', label: 'Diet & Metabolic Consultation' },
                  ]}
                />

                {/* Date */}
                <Input
                  label="Desired Date"
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />

                {/* Available Slots */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
                    Available Time Slot
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {trainer.availableTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold font-heading transition-all text-left flex items-center justify-between cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'border-brand-red bg-brand-red/10 text-white'
                            : 'border-forge-800 bg-forge-950 text-forge-400 hover:border-forge-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-brand-orange" />
                          {slot}
                        </span>
                        {selectedTimeSlot === slot && <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forge-300 font-heading mb-1.5">
                    Goals / Focus Notes
                  </label>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Focus on deadlift technique and hip mobility..."
                    className="w-full bg-forge-950 border border-forge-750 rounded-xl p-3 text-xs text-white placeholder-forge-500 focus:outline-none focus:border-brand-red"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  size="lg"
                  variant="primary"
                  className="w-full mt-4 uppercase tracking-wider"
                >
                  Confirm Booking ({formatINR(trainer.hourlyRate)})
                </Button>

                <p className="text-[10px] text-center text-forge-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Pro/Elite members can use complimentary monthly session tokens
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
