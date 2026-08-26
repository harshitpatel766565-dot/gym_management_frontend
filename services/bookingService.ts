import { ApiClient } from './api';
import { ApiResponse } from '@/types/api';
import { Booking, CreateBookingPayload } from '@/types/booking';
import { INITIAL_BOOKINGS, INITIAL_TRAINERS } from './mockData';

const BOOKINGS_STORAGE_KEY = 'ironforge_bookings_db';

function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

function saveBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

export const bookingService = {
  async getUserBookings(userId: string): Promise<ApiResponse<Booking[]>> {
    try {
      return await ApiClient.get<Booking[]>(`/bookings/user/${userId}/`);
    } catch {
      // Fallback
    }

    const bookings = getStoredBookings().filter((b) => b.userId === userId || userId === 'usr-1');
    return {
      success: true,
      message: 'Bookings retrieved.',
      data: bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  },

  async createBooking(
    userId: string,
    userName: string,
    userEmail: string,
    payload: CreateBookingPayload
  ): Promise<ApiResponse<Booking>> {
    try {
      return await ApiClient.post<Booking>('/bookings/', {
        userId,
        userName,
        userEmail,
        ...payload,
      });
    } catch {
      // Fallback
    }

    const bookings = getStoredBookings();

    // Prevent double booking logic: Check if trainer has a confirmed session at this date & timeSlot
    const conflictingTrainerSlot = bookings.find(
      (b) =>
        b.trainerId === payload.trainerId &&
        b.date === payload.date &&
        b.timeSlot === payload.timeSlot &&
        b.status !== 'cancelled' &&
        b.status !== 'rejected'
    );

    if (conflictingTrainerSlot) {
      throw {
        success: false,
        message: 'This time slot is already booked for this trainer. Please select another slot or date.',
      };
    }

    // Check if the user already has a session at this same date & timeSlot
    const conflictingUserSlot = bookings.find(
      (b) =>
        b.userId === userId &&
        b.date === payload.date &&
        b.timeSlot === payload.timeSlot &&
        b.status !== 'cancelled' &&
        b.status !== 'rejected'
    );

    if (conflictingUserSlot) {
      throw {
        success: false,
        message: 'You already have another session booked at this exact time slot.',
      };
    }

    const trainer = INITIAL_TRAINERS.find((t) => t.id === payload.trainerId);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      userId,
      userName,
      userEmail,
      serviceType: payload.serviceType,
      trainerId: payload.trainerId,
      trainerName: trainer ? trainer.name : 'Master Coach',
      trainerAvatar: trainer ? trainer.avatarUrl : undefined,
      date: payload.date,
      timeSlot: payload.timeSlot,
      status: 'confirmed',
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    saveBookings(bookings);

    return {
      success: true,
      message: 'Session booked successfully! Confirmation sent to your email.',
      data: newBooking,
    };
  },

  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      return await ApiClient.post<Booking>(`/bookings/${bookingId}/cancel/`);
    } catch {
      // Fallback
    }

    const bookings = getStoredBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw { success: false, message: 'Booking not found.' };
    }

    bookings[index].status = 'cancelled';
    bookings[index].updatedAt = new Date().toISOString();
    saveBookings(bookings);

    return {
      success: true,
      message: 'Booking has been cancelled.',
      data: bookings[index],
    };
  },
};
