import { ApiClient } from "./api";
import { ApiResponse } from "@/types/api";

export interface SystemNotification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<SystemNotification[]>> {
    return ApiClient.get<SystemNotification[]>("/api/notifications");
  },

  async markAsRead(id: string): Promise<ApiResponse<SystemNotification>> {
    return ApiClient.patch<SystemNotification>(`/api/notifications/${id}/read`);
  },

  async deleteNotification(id: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/notifications/${id}`);
  },
};
