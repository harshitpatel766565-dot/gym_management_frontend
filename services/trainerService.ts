import { ApiClient } from "./api";
import { ApiResponse } from "@/types/api";
import { Trainer, TrainerReview } from "@/types/trainer";
import { User } from "@/types/user";
import { INITIAL_TRAINERS } from "./mockData";

const TRAINERS_STORAGE_KEY = "ironforge_trainers_db";
const MEMBERS_STORAGE_KEY = "ironforge_members_db";
const AVAILABLE_MEMBERS_STORAGE_KEY = "ironforge_available_members_db";

function getStoredTrainers(): Trainer[] {
  if (typeof window === "undefined") {
    return INITIAL_TRAINERS;
  }

  const stored = localStorage.getItem(TRAINERS_STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      TRAINERS_STORAGE_KEY,
      JSON.stringify(INITIAL_TRAINERS)
    );

    return INITIAL_TRAINERS;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_TRAINERS;
  }
}

// ==========================================
// TRAINER DASHBOARD TYPES
// ==========================================

export interface TrainerDashboardData {
  totalMembers: number;
  todaySessions: number;
  pendingBookings: number;
  todayAttendance: number;

  upcomingSessions: Array<{
    id: string;
    memberName: string;
    program: string;
    time: string;
    status: string;
  }>;

  recentProgress: Array<{
    memberName: string;
    metric: string;
    progress: string;
    period: string;
  }>;
}

// ==========================================
// TRAINER MEMBER TYPE
// ==========================================

export interface TrainerMember {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user";
  trainer?: string | null;
  createdAt?: string;
}

export interface CreateMemberData {
  name: string;
  email: string;
  phone?: string;
}

// ==========================================
// WORKOUT TYPES
// ==========================================

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export interface WorkoutMember {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Workout {
  _id: string;
  trainer: string;
  member: string | WorkoutMember;
  name: string;
  goal?: string;
  exercises: WorkoutExercise[];
  status: "active" | "completed";
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// BOOKING TYPES
// ==========================================

export interface BookingMember {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface BookingTrainer {
  _id: string;
  name: string;
  email: string;
}

export interface Booking {
  _id: string;
  trainer: string | BookingTrainer;
  member: string | BookingMember;
  title: string;
  sessionType?: string;
  date: string;
  startTime: string;
  endTime?: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// CREATE WORKOUT DATA
// ==========================================

export interface CreateWorkoutData {
  memberId: string;
  name: string;
  goal?: string;
  exercises: WorkoutExercise[];
  startDate?: string;
  endDate?: string;
}

// ==========================================
// UPDATE WORKOUT DATA
// ==========================================

export interface UpdateWorkoutData {
  name?: string;
  goal?: string;
  exercises?: WorkoutExercise[];
  status?: "active" | "completed";
  startDate?: string;
  endDate?: string;
}

// ==========================================
// CREATE BOOKING DATA
// ==========================================

export interface CreateBookingData {
  memberId: string;
  title: string;
  sessionType?: string;
  date: string;
  startTime: string;
  endTime?: string;
  notes?: string;
}

// ==========================================
// UPDATE BOOKING DATA
// ==========================================

export interface UpdateBookingData {
  title?: string;
  sessionType?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

// ==========================================
// BOOKING STATUS
// ==========================================

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

// ==========================================
// TRAINER SERVICE
// ==========================================

export const trainerService = {
  // ==========================================
  // PUBLIC TRAINER LIST
  // ==========================================

  async getAllTrainers(): Promise<ApiResponse<Trainer[]>> {
    try {
      return await ApiClient.get<Trainer[]>("/api/trainers");
    } catch {
      return {
        success: true,
        message: "Trainers retrieved successfully.",
        data: getStoredTrainers(),
      };
    }
  },

  // ==========================================
  // PUBLIC TRAINER DETAILS
  // ==========================================

  async getTrainerById(id: string): Promise<ApiResponse<Trainer>> {
    try {
      return await ApiClient.get<Trainer>(`/api/trainers/${id}`);
    } catch {
      const trainer = getStoredTrainers().find((item) => item.id === id);

      if (!trainer) {
        throw {
          success: false,
          message: "Trainer not found.",
        };
      }

      return {
        success: true,
        message: "Trainer details retrieved.",
        data: trainer,
      };
    }
  },

  // ==========================================
  // PUBLIC TRAINER REVIEWS
  // ==========================================

  async getTrainerReviews(
    trainerId: string
  ): Promise<ApiResponse<TrainerReview[]>> {
    try {
      return await ApiClient.get<TrainerReview[]>(
        `/api/trainers/${trainerId}/reviews`
      );
    } catch {
      const mockReviews: TrainerReview[] = [
        {
          id: "rev-1",
          trainerId,
          userName: "Alex Johnson",
          userAvatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          rating: 5,
          comment:
            "Unbelievable attention to form mechanics. Helped me fix my knee cave on heavy squats!",
          date: "2024-07-28",
        },
        {
          id: "rev-2",
          trainerId,
          userName: "Priya Patel",
          userAvatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
          rating: 5,
          comment:
            "High intensity sessions that make you feel invincible afterward. Super encouraging coach.",
          date: "2024-07-14",
        },
      ];

      return {
        success: true,
        message: "Reviews retrieved.",
        data: mockReviews,
      };
    }
  },

  // ==========================================
  // TRAINER DASHBOARD
  // ==========================================

  async getDashboard(): Promise<ApiResponse<TrainerDashboardData>> {
    return ApiClient.get<TrainerDashboardData>("/api/trainer/dashboard");
  },

  // ==========================================
  // MY ASSIGNED MEMBERS
  // ==========================================

  async getMyMembers(): Promise<ApiResponse<TrainerMember[]>> {
    try {
      return await ApiClient.get<TrainerMember[]>("/api/trainer/members");
    } catch {
      const stored = localStorage.getItem(MEMBERS_STORAGE_KEY);
      return {
        success: true,
        message: "Assigned members retrieved.",
        data: stored ? JSON.parse(stored) : [],
      };
    }
  },

  // ==========================================
  // AVAILABLE MEMBERS
  // ==========================================

  async getAvailableMembers(): Promise<ApiResponse<TrainerMember[]>> {
    try {
      return await ApiClient.get<TrainerMember[]>(
        "/api/trainer/available-members"
      );
    } catch {
      const stored = localStorage.getItem(AVAILABLE_MEMBERS_STORAGE_KEY);
      return {
        success: true,
        message: "Available members retrieved.",
        data: stored ? JSON.parse(stored) : [],
      };
    }
  },

  // ==========================================
  // ADD MEMBER (WITH FALLBACK)
  // ==========================================

  async addMember(
    data: CreateMemberData
  ): Promise<ApiResponse<TrainerMember>> {
    try {
      return await ApiClient.post<TrainerMember>("/api/trainer/members", data);
    } catch {
      const newMember: TrainerMember = {
        _id: `mem-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      const stored = localStorage.getItem(AVAILABLE_MEMBERS_STORAGE_KEY);
      const list: TrainerMember[] = stored ? JSON.parse(stored) : [];
      const updatedList = [newMember, ...list];

      localStorage.setItem(
        AVAILABLE_MEMBERS_STORAGE_KEY,
        JSON.stringify(updatedList)
      );

      return {
        success: true,
        message: "Member added successfully!",
        data: newMember,
      };
    }
  },

  // ==========================================
  // ASSIGN MEMBER
  // ==========================================

  async assignMember(
    memberId: string
  ): Promise<ApiResponse<TrainerMember>> {
    try {
      return await ApiClient.post<TrainerMember>(
        `/api/trainer/members/${memberId}/assign`
      );
    } catch {
      const availStored = localStorage.getItem(AVAILABLE_MEMBERS_STORAGE_KEY);
      const availList: TrainerMember[] = availStored ? JSON.parse(availStored) : [];
      const memberIndex = availList.findIndex((m) => m._id === memberId);

      if (memberIndex === -1) {
        throw { success: false, message: "Member not found in available list" };
      }

      const [assignedMember] = availList.splice(memberIndex, 1);
      localStorage.setItem(AVAILABLE_MEMBERS_STORAGE_KEY, JSON.stringify(availList));

      const assignedStored = localStorage.getItem(MEMBERS_STORAGE_KEY);
      const assignedList: TrainerMember[] = assignedStored ? JSON.parse(assignedStored) : [];
      assignedList.push(assignedMember);
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(assignedList));

      return {
        success: true,
        message: "Member assigned successfully",
        data: assignedMember,
      };
    }
  },

  // ==========================================
  // REMOVE MEMBER
  // ==========================================

  async removeMember(memberId: string): Promise<ApiResponse<null>> {
    try {
      return await ApiClient.delete<null>(`/api/trainer/members/${memberId}`);
    } catch {
      const assignedStored = localStorage.getItem(MEMBERS_STORAGE_KEY);
      let assignedList: TrainerMember[] = assignedStored ? JSON.parse(assignedStored) : [];
      assignedList = assignedList.filter((m) => m._id !== memberId);
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(assignedList));

      return {
        success: true,
        message: "Member removed successfully",
        data: null,
      };
    }
  },

  // ==========================================
  // GET MY WORKOUTS
  // ==========================================

  async getMyWorkouts(): Promise<ApiResponse<Workout[]>> {
    return ApiClient.get<Workout[]>("/api/trainer/workouts");
  },

  // ==========================================
  // CREATE WORKOUT
  // ==========================================

  async createWorkout(
    data: CreateWorkoutData
  ): Promise<ApiResponse<Workout>> {
    return ApiClient.post<Workout>("/api/trainer/workouts", data);
  },

  // ==========================================
  // GET MEMBER WORKOUTS
  // ==========================================

  async getMemberWorkouts(
    memberId: string
  ): Promise<ApiResponse<Workout[]>> {
    return ApiClient.get<Workout[]>(
      `/api/trainer/workouts/member/${memberId}`
    );
  },

  // ==========================================
  // UPDATE WORKOUT
  // ==========================================

  async updateWorkout(
    workoutId: string,
    data: UpdateWorkoutData
  ): Promise<ApiResponse<Workout>> {
    return ApiClient.put<Workout>(
      `/api/trainer/workouts/${workoutId}`,
      data
    );
  },

  // ==========================================
  // DELETE WORKOUT
  // ==========================================

  async deleteWorkout(workoutId: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/trainer/workouts/${workoutId}`);
  },

  // ==========================================
  // GET MY BOOKINGS
  // ==========================================

  async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    return ApiClient.get<Booking[]>("/api/trainer/bookings");
  },

  // ==========================================
  // CREATE BOOKING
  // ==========================================

  async createBooking(
    data: CreateBookingData
  ): Promise<ApiResponse<Booking>> {
    return ApiClient.post<Booking>("/api/trainer/bookings", data);
  },

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<ApiResponse<Booking>> {
    return ApiClient.patch<Booking>(
      `/api/trainer/bookings/${bookingId}/status`,
      { status }
    );
  },

  // ==========================================
  // UPDATE BOOKING
  // ==========================================

  async updateBooking(
    bookingId: string,
    data: UpdateBookingData
  ): Promise<ApiResponse<Booking>> {
    return ApiClient.put<Booking>(
      `/api/trainer/bookings/${bookingId}`,
      data
    );
  },

  // ==========================================
  // DELETE BOOKING
  // ==========================================

  async deleteBooking(bookingId: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/trainer/bookings/${bookingId}`);
  },

  // ==========================================
  // ASSIGNED MEMBER INFO & PROGRESS
  // ==========================================
  async getMemberProfile(memberId: string): Promise<ApiResponse<User>> {
    return ApiClient.get<User>(`/api/trainer/members/${memberId}`);
  },

  async getMemberProgress(memberId: string): Promise<ApiResponse<any[]>> {
    return ApiClient.get<any[]>(`/api/trainer/members/${memberId}/progress`);
  },
};