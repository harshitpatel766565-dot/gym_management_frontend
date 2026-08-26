import { ApiClient } from "./api";
import { ApiResponse } from "@/types/api";

export interface Product {
  _id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  discountPrice?: number;
  brand?: string;
  stock: number;
  sku?: string;
  images: string[];
  features?: string[];
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const productService = {
  // ==========================================
  // GET ALL PRODUCTS
  // ==========================================
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return ApiClient.get<Product[]>("/api/products");
  },

  // ==========================================
  // GET SINGLE PRODUCT DETAILS
  // ==========================================
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return ApiClient.get<Product>(`/api/products/${id}`);
  },

  // ==========================================
  // ADMIN: ADD PRODUCT
  // ==========================================
  async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return ApiClient.post<Product>("/api/products", data);
  },

  // ==========================================
  // ADMIN: EDIT PRODUCT
  // ==========================================
  async updateProduct(
    id: string,
    data: Partial<Product>
  ): Promise<ApiResponse<Product>> {
    return ApiClient.put<Product>(`/api/products/${id}`, data);
  },

  // ==========================================
  // ADMIN: DELETE PRODUCT
  // ==========================================
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return ApiClient.delete<null>(`/api/products/${id}`);
  },
};
