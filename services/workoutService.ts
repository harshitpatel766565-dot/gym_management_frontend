import { ApiClient } from './api';
import { ApiResponse } from '@/types/api';
import { Program, Exercise, MuscleGroup, ExerciseDifficulty } from '@/types/workout';
import { INITIAL_PROGRAMS, INITIAL_EXERCISES } from './mockData';

const PROGRAMS_STORAGE_KEY = 'ironforge_programs_db';
const EXERCISES_STORAGE_KEY = 'ironforge_exercises_db';

function getStoredPrograms(): Program[] {
  if (typeof window === 'undefined') return INITIAL_PROGRAMS;
  const stored = localStorage.getItem(PROGRAMS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(INITIAL_PROGRAMS));
    return INITIAL_PROGRAMS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PROGRAMS;
  }
}

function getStoredExercises(): Exercise[] {
  if (typeof window === 'undefined') return INITIAL_EXERCISES;
  const stored = localStorage.getItem(EXERCISES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(INITIAL_EXERCISES));
    return INITIAL_EXERCISES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_EXERCISES;
  }
}

export const workoutService = {
  async getPrograms(category?: string, difficulty?: ExerciseDifficulty): Promise<ApiResponse<Program[]>> {
    try {
      return await ApiClient.get<Program[]>('/api/programs');
    } catch {
      // Fallback
    }

    let programs = getStoredPrograms();
    if (category && category !== 'All') {
      programs = programs.filter((p) => p.title.toLowerCase().includes(category.toLowerCase()));
    }
    if (difficulty && difficulty !== ('All' as unknown as ExerciseDifficulty)) {
      programs = programs.filter((p) => p.difficulty === difficulty);
    }

    return {
      success: true,
      message: 'Programs retrieved.',
      data: programs,
    };
  },

  async getProgramByIdOrSlug(identifier: string): Promise<ApiResponse<Program>> {
    try {
      const res = await ApiClient.get<Program>(`/api/programs/${identifier}`);
      if (res.success && res.data) {
        const progData = res.data;
        const mockMatch = INITIAL_PROGRAMS.find(
          (p) => p.slug === progData.slug || p.title.toLowerCase() === progData.title.toLowerCase()
        );
        if (mockMatch) {
          if (!progData.scheduleOverview || progData.scheduleOverview.length === 0) {
            progData.scheduleOverview = mockMatch.scheduleOverview;
          }
          if (!progData.exercises || progData.exercises.length === 0) {
            progData.exercises = mockMatch.exercises;
          }
        }
        if (!progData.scheduleOverview) {
          progData.scheduleOverview = [
            { day: 'Day 1', focus: 'Push Foundation', duration: '60 mins' },
            { day: 'Day 2', focus: 'Pull Mechanics', duration: '60 mins' },
            { day: 'Day 3', focus: 'Active Recovery', duration: '45 mins' },
            { day: 'Day 4', focus: 'Legs / Core', duration: '60 mins' }
          ];
        }
        if (!progData.exercises) {
          progData.exercises = [];
        }
      }
      return res;
    } catch {
      // Fallback
    }

    const programs = getStoredPrograms();
    const program = programs.find((p) => p.id === identifier || p.slug === identifier);
    if (!program) {
      throw { success: false, message: 'Program not found.' };
    }

    return {
      success: true,
      message: 'Program retrieved.',
      data: program,
    };
  },

  async getExercises(muscleGroup?: MuscleGroup | 'All', difficulty?: ExerciseDifficulty | 'All'): Promise<ApiResponse<Exercise[]>> {
    try {
      return await ApiClient.get<Exercise[]>('/workouts/exercises/');
    } catch {
      // Fallback
    }

    let exercises = getStoredExercises();
    if (muscleGroup && muscleGroup !== 'All') {
      exercises = exercises.filter((e) => e.targetMuscle === muscleGroup);
    }
    if (difficulty && difficulty !== 'All') {
      exercises = exercises.filter((e) => e.difficulty === difficulty);
    }

    return {
      success: true,
      message: 'Exercises retrieved.',
      data: exercises,
    };
  },

  async getExerciseById(id: string): Promise<ApiResponse<Exercise>> {
    try {
      return await ApiClient.get<Exercise>(`/workouts/exercises/${id}/`);
    } catch {
      // Fallback
    }

    const exercises = getStoredExercises();
    const exercise = exercises.find((e) => e.id === id);
    if (!exercise) {
      throw { success: false, message: 'Exercise not found.' };
    }

    return {
      success: true,
      message: 'Exercise details retrieved.',
      data: exercise,
    };
  },

  async createExercise(data: Omit<Exercise, 'id'>): Promise<ApiResponse<Exercise>> {
    try {
      return await ApiClient.post<Exercise>('/workouts/exercises/', data);
    } catch {
      // Fallback
    }

    const newExercise: Exercise = {
      ...data,
      id: `ex-${Date.now()}`,
    };

    const stored = getStoredExercises();
    const updated = [newExercise, ...stored];
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(updated));

    return {
      success: true,
      message: 'Exercise created successfully.',
      data: newExercise,
    };
  },

  async deleteExercise(id: string): Promise<ApiResponse<null>> {
    try {
      return await ApiClient.delete<null>(`/workouts/exercises/${id}/`);
    } catch {
      // Fallback
    }

    const stored = getStoredExercises();
    const updated = stored.filter((e) => e.id !== id);
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(updated));

    return {
      success: true,
      message: 'Exercise deleted successfully.',
      data: null,
    };
  },
};
