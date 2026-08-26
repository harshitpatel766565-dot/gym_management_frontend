import { ApiClient } from "./api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { Trainer } from "@/types/trainer";
import { Booking } from "@/types/booking";
import { Program } from "@/types/workout";

// ==========================================
// ADMIN ANALYTICS TYPE
// ==========================================
export interface AdminAnalyticsSummary {
  totalUsers: number;
  activeMembers: number;
  expiredMembers: number;
  totalRevenue: number;
  totalBookings: number;
  todayAttendance: number;
  newUsersThisMonth: number;
  monthlyRevenueTrend: Array<{ month: string; revenue: number }>;
  popularPrograms: Array<{ name: string; enrolled: number }>;
  attendanceByHour: Array<{ hour: string; count: number }>;
}

// ==========================================
// PAYMENT TRANSACTION TYPE
// ==========================================
export interface PaymentTransaction {
  id: string;
  memberName: string;
  planName: string;
  amount: number;
  status: string;
  date: string;
}

// ==========================================
// ATTENDANCE RECORD TYPE
// ==========================================
export interface AttendanceRecord {
  id: string;
  memberName: string;
  checkInTime: string;
  status: string;
}

// ==========================================
// ADMIN SERVICE DEFINITION
// ==========================================
export const adminService = {
  // ==========================================
  // ANALYTICS SUMMARY
  // ==========================================
  async getAnalyticsSummary(): Promise<ApiResponse<AdminAnalyticsSummary>> {
    return ApiClient.get<AdminAnalyticsSummary>("/api/admin/analytics");
  },

  // ==========================================
  // USER MANAGEMENT
  // ==========================================
  async getUsers(): Promise<ApiResponse<User[]>> {
    return ApiClient.get<User[]>("/api/admin/users");
  },

  async createUser(data: Partial<User> & { password?: string }): Promise<ApiResponse<User>> {
    return ApiClient.post<User>("/api/admin/users", data);
  },

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return ApiClient.put<User>(`/api/admin/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/admin/users/${id}`);
  },

  // ==========================================
  // TRAINER MANAGEMENT
  // ==========================================
  async getTrainers(): Promise<ApiResponse<Trainer[]>> {
    return ApiClient.get<Trainer[]>("/api/admin/trainers");
  },

  async createTrainer(data: any): Promise<ApiResponse<Trainer>> {
    return ApiClient.post<Trainer>("/api/admin/trainers", {
      ...data,
      role: "trainer",
      password: data.password || "Gym@123456", // default password for trainer creation
    });
  },

  async updateTrainer(id: string, data: any): Promise<ApiResponse<Trainer>> {
    return ApiClient.put<Trainer>(`/api/admin/users/${id}`, data);
  },

  async deleteTrainer(id: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/admin/users/${id}`);
  },

  // ==========================================
  // BOOKINGS MANAGEMENT
  // ==========================================
  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    return ApiClient.get<Booking[]>("/api/admin/bookings");
  },

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse<Booking>> {
    return ApiClient.patch<Booking>(`/api/admin/bookings/${id}/status`, { status });
  },

  // ==========================================
  // PAYMENTS & ATTENDANCE
  // ==========================================
  async getAllPayments(): Promise<ApiResponse<PaymentTransaction[]>> {
    return ApiClient.get<PaymentTransaction[]>("/api/admin/payments");
  },

  async getAllAttendance(): Promise<ApiResponse<AttendanceRecord[]>> {
    return ApiClient.get<AttendanceRecord[]>("/api/admin/attendance");
  },

  // ==========================================
  // PROGRAM CRUD INTEGRATION
  // ==========================================
  async getPrograms(): Promise<ApiResponse<Program[]>> {
    return ApiClient.get<Program[]>("/api/programs");
  },

  async createProgram(data: any): Promise<ApiResponse<Program>> {
    return ApiClient.post<Program>("/api/programs", data);
  },

  async updateProgram(id: string, data: any): Promise<ApiResponse<Program>> {
    return ApiClient.put<Program>(`/api/programs/${id}`, data);
  },

  async deleteProgram(id: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/programs/${id}`);
  },
};