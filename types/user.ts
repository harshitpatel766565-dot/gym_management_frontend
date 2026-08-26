export type UserRole = 'user' | 'trainer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;

  avatarUrl?: string;

  createdAt?: string;
  updatedAt?: string;

  isActive?: boolean;

  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  targetWeight?: number;
  fitnessGoal?: 'muscle_gain' | 'weight_loss' | 'strength' | 'endurance' | 'general_fitness';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
  bmi?: number;
  bodyFatPercentage?: number;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string;
}

export interface WorkoutProgress {
  id: string;
  userId: string;
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  chest?: number; // in cm
  waist?: number; // in cm
  arms?: number;  // in cm
  legs?: number;  // in cm
  workoutDurationMinutes: number;
  caloriesBurned: number;
  notes?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponseData {
  user: User;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
}
