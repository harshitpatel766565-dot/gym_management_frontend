export type BookingServiceType = 
  | 'Personal Trainer'
  | 'Yoga'
  | 'CrossFit'
  | 'Workout Session'
  | 'Consultation';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceType: BookingServiceType;
  trainerId: string;
  trainerName: string;
  trainerAvatar?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM - 10:00 AM"
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  serviceType: BookingServiceType;
  trainerId: string;
  date: string;
  timeSlot: string;
  notes?: string;
}
