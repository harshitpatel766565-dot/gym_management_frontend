import { ApiClient } from "./api";
import { ApiResponse } from "@/types/api";

export interface HomepageContent {
  _id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroBackgroundImage: string;
  createdAt?: string;
  updatedAt?: string;
}

export const homepageService = {
  // Get current homepage content
  async getHomepageContent(): Promise<ApiResponse<HomepageContent>> {
    return ApiClient.get<HomepageContent>("/api/homepage");
  },

  // Update homepage content
  async updateHomepageContent(data: Partial<HomepageContent>): Promise<ApiResponse<HomepageContent>> {
    return ApiClient.put<HomepageContent>("/api/homepage", data);
  },
};
