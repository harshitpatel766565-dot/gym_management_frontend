import { ApiClient } from "./api";
import { ApiResponse } from "@/types/api";
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponseData,
} from "@/types/user";

const CURRENT_USER_KEY = "ironforge_current_user";
const ACCESS_TOKEN_KEY = "ironforge_access_token";
const REFRESH_TOKEN_KEY = "ironforge_refresh_token";

export const authService = {
  // ==========================================
  // LOGIN
  // ==========================================

  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponseData>> => {
    try {
      const response = await ApiClient.post<AuthResponseData>(
        "/api/auth/login",
        credentials
      );

      if (
        !response.success ||
        !response.data ||
        !response.data.user ||
        !response.data.tokens?.access
      ) {
        throw new Error(response.message || "Login failed");
      }

      const { user, tokens } = response.data;

      authService.setSession(tokens.access, tokens.refresh || "", user);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // ==========================================
  // REGISTER
  // ==========================================

  register: async (
    data: RegisterData
  ): Promise<ApiResponse<AuthResponseData>> => {
    try {
      const response = await ApiClient.post<AuthResponseData>(
        "/api/auth/register",
        data
      );

      if (
        !response.success ||
        !response.data ||
        !response.data.user ||
        !response.data.tokens?.access
      ) {
        throw new Error(response.message || "Registration failed");
      }

      const { user, tokens } = response.data;

      authService.setSession(tokens.access, tokens.refresh || "", user);

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // ==========================================
  // CURRENT USER
  // ==========================================

  getCurrentUser: async (): Promise<User | null> => {
    if (typeof window === "undefined") {
      return null;
    }

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      return null;
    }

    try {
      const response = await ApiClient.get<User>("/api/auth/profile");

      if (response.success && response.data) {
        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify(response.data)
        );

        return response.data;
      }
    } catch (error) {
      console.error("Failed to get current user:", error);
    }

    const storedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  },

  // ==========================================
  // SAVE SESSION
  // ==========================================

  setSession: (access: string, refresh: string, user: User): void => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, access);

    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  // ==========================================
  // LOGOUT
  // ==========================================

  logout: (): void => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // ==========================================
  // FORGOT PASSWORD (STEP 1)
  // ==========================================

  forgotPassword: async (
    email: string
  ): Promise<ApiResponse<{ sent: boolean }>> => {
    return ApiClient.post<{ sent: boolean }>("/api/auth/forgot-password", {
      email: email.trim().toLowerCase(),
    });
  },

  // ==========================================
  // VERIFY RESET OTP (STEP 2)
  // Backend Route: /verify-reset-otp
  // ==========================================

  verifyResetOtp: async (
    email: string,
    otp: string
  ): Promise<ApiResponse<{ verified: boolean }>> => {
    return ApiClient.post<{ verified: boolean }>(
      "/api/auth/verify-reset-otp",
      { email: email.trim().toLowerCase(), otp }
    );
  },

  // ==========================================
  // RESET PASSWORD (STEP 3)
  // Backend Route: /reset-password
  // ==========================================

  resetPassword: async (
    email: string,
    newPassword: string
  ): Promise<ApiResponse<{ updated: boolean }>> => {
    return ApiClient.post<{ updated: boolean }>(
      "/api/auth/reset-password",
      {
        email: email.trim().toLowerCase(),
        newPassword: newPassword,
      }
    );
  },
};