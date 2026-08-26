import { ApiClient } from "./api";
import { ApiResponse } from "@/types/api";
import { AttendanceMonthlySummary, AttendanceRecord } from "@/types/attendance";

export interface CreateAttendancePayload {
  memberId: string;
  bookingId?: string;
  date: string;
  status: "present" | "absent" | "late";
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

export const attendanceService = {
  // ==========================================
  // GET MONTHLY SUMMARY (FOR MEMBER)
  // ==========================================
  async getMonthlySummary(
    userId: string,
    year: number,
    month: number
  ): Promise<ApiResponse<AttendanceMonthlySummary>> {
    return ApiClient.get<AttendanceMonthlySummary>(
      `/attendance/user/${userId}/summary?year=${year}&month=${month}`
    );
  },

  // ==========================================
  // MEMBER INSTANT CHECK-IN
  // ==========================================
  async checkInToday(
    userId: string,
    userName: string
  ): Promise<ApiResponse<any>> {
    return ApiClient.post<any>("/attendance/checkin", {
      userId,
      userName,
    });
  },

  // ==========================================
  // TRAINER: GET ALL ATTENDANCE LOGS
  // ==========================================
  async getTrainerAttendance(): Promise<ApiResponse<any[]>> {
    return ApiClient.get<any[]>("/api/trainer/attendance");
  },

  // ==========================================
  // TRAINER: MARK ATTENDANCE
  // ==========================================
  async markAttendance(
    payload: CreateAttendancePayload
  ): Promise<ApiResponse<any>> {
    return ApiClient.post<any>("/api/trainer/attendance", payload);
  },

  // ==========================================
  // TRAINER: EDIT ATTENDANCE RECORD
  // ==========================================
  async updateAttendance(
    id: string,
    payload: Partial<CreateAttendancePayload>
  ): Promise<ApiResponse<any>> {
    return ApiClient.put<any>(`/api/trainer/attendance/${id}`, payload);
  },

  // ==========================================
  // TRAINER: DELETE ATTENDANCE RECORD
  // ==========================================
  async deleteAttendance(id: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/trainer/attendance/${id}`);
  },

  // ==========================================
  // ADMIN: GET ALL ATTENDANCE LOGS
  // ==========================================
  async getAdminAttendance(): Promise<ApiResponse<any[]>> {
    return ApiClient.get<any[]>("/api/admin/attendance");
  },
};