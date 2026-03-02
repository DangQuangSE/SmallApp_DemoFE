import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import { Bike } from "./bike.service";
import { Order } from "./order.service";

export interface SellerStatistics {
  totalRevenue: number;
  totalOrders: number;
  activeListings: number;
  soldBikes: number;
  recentViews: number;
}

export const sellerService = {
  // Get seller dashboard overview
  getDashboard: async (): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SELLER.DASHBOARD);
    return response.data;
  },

  // Get all bikes listed by the seller
  getMyBikes: async (): Promise<Bike[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SELLER.BIKES);
    return response.data;
  },

  // Get orders related to the seller's bikes
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SELLER.ORDERS);
    return response.data;
  },

  // Update order status (e.g., from 'pending' to 'processing' or 'shipped')
  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await axiosInstance.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), { status });
    return response.data;
  },

  // Get seller statistics and metrics
  getStatistics: async (): Promise<SellerStatistics> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SELLER.STATISTICS);
    return response.data;
  },
};
