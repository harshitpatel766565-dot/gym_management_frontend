import { ApiClient } from './api';
import { ApiResponse } from '@/types/api';
import { User, UserProfile, WorkoutProgress } from '@/types/user';
import { INITIAL_PROGRESS_LOGS, INITIAL_USERS } from './mockData';

const PROGRESS_STORAGE_KEY = 'ironforge_progress_logs';

function getStoredProgress(): WorkoutProgress[] {
  if (typeof window === 'undefined') return INITIAL_PROGRESS_LOGS;
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(INITIAL_PROGRESS_LOGS));
    return INITIAL_PROGRESS_LOGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PROGRESS_LOGS;
  }
}

function saveProgress(logs: WorkoutProgress[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(logs));
}

export const userService = {
  async updateProfile(userId: string, profileData: Partial<UserProfile & { name: string; phone: string }>): Promise<ApiResponse<User>> {
    try {
      return await ApiClient.patch<User>(`/users/${userId}/profile/`, profileData);
    } catch {
      // Local fallback
    }

    const storedUsers = localStorage.getItem('ironforge_users_db');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
    const index = users.findIndex((u) => u.id === userId);

    if (index !== -1) {
      if (profileData.name) users[index].name = profileData.name;
      if (profileData.phone) users[index].phone = profileData.phone;
      users[index].profile = {
        ...users[index].profile,
        ...profileData,
      } as UserProfile;
      users[index].updatedAt = new Date().toISOString();

      localStorage.setItem('ironforge_users_db', JSON.stringify(users));
      localStorage.setItem('ironforge_current_user', JSON.stringify(users[index]));

      return {
        success: true,
        message: 'Profile updated successfully.',
        data: users[index],
      };
    }

    throw { success: false, message: 'User not found.' };
  },

  async getProgressLogs(userId: string): Promise<ApiResponse<WorkoutProgress[]>> {
    try {
      return await ApiClient.get<WorkoutProgress[]>(`/users/${userId}/progress/`);
    } catch {
      // Local fallback
    }

    const logs = getStoredProgress().filter((l) => l.userId === userId || userId === 'usr-1');
    return {
      success: true,
      message: 'Progress logs retrieved.',
      data: logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    };
  },

  async addProgressLog(userId: string, payload: Omit<WorkoutProgress, 'id' | 'userId'>): Promise<ApiResponse<WorkoutProgress>> {
    try {
      return await ApiClient.post<WorkoutProgress>(`/users/${userId}/progress/`, payload);
    } catch {
      // Local fallback
    }

    const logs = getStoredProgress();
    const newLog: WorkoutProgress = {
      id: `log-${Date.now()}`,
      userId,
      ...payload,
    };

    logs.push(newLog);
    saveProgress(logs);

    return {
      success: true,
      message: 'Workout progress logged successfully.',
      data: newLog,
    };
  },
};
