export type TrainerSpecialization = 
  | 'Strength Coach'
  | 'Nutrition Coach'
  | 'CrossFit Coach'
  | 'Weight Loss Coach'
  | 'Yoga Instructor'
  | 'HIIT Specialist'
  | 'Bodybuilding Pro'
  | 'Master Coach';

export interface Trainer {
  id: string;
  userId?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatarUrl: string;
  specialization: TrainerSpecialization;
  secondarySpecializations?: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  bio: string;
  certifications: string[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  achievements?: string[];
  hourlyRate: number; // in INR
  activeClientsCount: number;
  availableDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
  availableTimeSlots: string[];
  isFeatured?: boolean;
}

export interface TrainerReview {
  id: string;
  trainerId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}
