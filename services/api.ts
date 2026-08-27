import { ApiResponse, ApiError } from "@/types/api";

const API_BASE_URL = (
  process.env.NEXT_API_URL ||
  "https://gym-management-backend-phi.vercel.app"
).replace(/\/$/, "");

export class ApiClient {
  private static getAuthToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("ironforge_access_token");
  }

  public static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    const url = `${API_BASE_URL}${cleanEndpoint}`;

    console.log("API Request:", url);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message:
            data?.message ||
            data?.detail ||
            `Request failed with status ${response.status}`,
          errors: data?.errors,
          statusCode: response.status,
        };

        throw error;
      }

      return {
        success:
          data?.success !== undefined
            ? data.success
            : true,

        message: data?.message || "Success",

        data: (
          data?.data !== undefined
            ? data.data
            : data
        ) as T,

        statusCode: response.status,
      };
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "success" in err
      ) {
        throw err;
      }

      const apiErr: ApiError = {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Network connection failed. Backend might be offline.",

        statusCode: 500,
      };

      throw apiErr;
    }
  }

  public static get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  public static post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  }

  public static put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  }

  public static patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  }

  public static delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}