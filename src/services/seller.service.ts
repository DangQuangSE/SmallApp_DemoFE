import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import { type BikePostDto } from "./bike.service";
import { type OrderDto } from "./order.service";

// Seller-specific service
// Note: In the new BE, seller gets their listings via /api/bikes/my-posts
// and orders via /api/orders/my-purchases (buyer side).
// The seller-specific dashboard/statistics endpoints are removed in the new BE.

export const sellerService = {
  // Get seller's own bike listings (via bikes endpoint)
  getMyBikes: async (): Promise<BikePostDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.MY_POSTS);
    return response.data;
  },

  // Get buyer's purchases (kept for now, seller orders removed in new BE)
  getMyPurchases: async (): Promise<OrderDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MY_PURCHASES);
    return response.data;
  },
};
