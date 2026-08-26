export type MuscleGroup = 
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Arms'
  | 'Shoulders'
  | 'Abs'
  | 'Full Body'
  | 'Cardio';

export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles?: string[];
  difficulty: ExerciseDifficulty;
  sets: number;
  reps: string; // e.g. "8-12" or "To Failure"
  restTimeSeconds: number;
  caloriesBurnedEstimate: number; // per 3 sets
  imageUrl: string;
  videoUrl?: string;
  instructions: string[];
  equipmentNeeded: string;
  tips?: string[];
}

export type ProgramCategory = 
  | 'Weight Training'
  | 'Muscle Building'
  | 'Weight Loss'
  | 'CrossFit'
  | 'HIIT'
  | 'Cardio'
  | 'Strength Training'
  | 'Functional Training'
  | 'Yoga'
  | 'Personal Training';

export interface Program {
  id: string;
  _id?: string;
  title: ProgramCategory | string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  difficulty: ExerciseDifficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  estimatedCaloriesPerSession: number;
  trainerName: string;
  trainerAvatar: string;
  trainerId: string;
  enrolledCount: number;
  rating: number;
  equipment: string[];
  scheduleOverview: {
    day: string;
    focus: string;
    duration: string;
  }[];
  exercises: Exercise[];
}

export interface WorkoutLogEntry {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  setsCompleted: number;
  repsCompleted: number[];
  weightUsedKg: number[];
  notes?: string;
}
