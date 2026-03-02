import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";

export interface AdminStatistics {
  totalUsers: number;
  totalBikes: number;
  totalOrders: number;
  revenue: number;
  activeInspectors: number;
  pendingVerifications: number;
}

export const adminService = {
  // Get admin dashboard overview
  getDashboard: async (): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  // Get all users (with optional filtering)
  getUsers: async (role?: string): Promise<any[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS, {
      params: { role },
    });
    return response.data;
  },

  // Get all bikes (with optional filtering)
  getAllBikes: async (status?: string): Promise<any[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.BIKES, {
      params: { status },
    });
    return response.data;
  },

  // Get all orders across the platform
  getAllOrders: async (status?: string): Promise<any[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.ORDERS, {
      params: { status },
    });
    return response.data;
  },

  // Get platform-wide statistics
  getStatistics: async (): Promise<AdminStatistics> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.STATISTICS);
    return response.data;
  },
};
