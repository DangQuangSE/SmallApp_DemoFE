import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";

export interface Bike {
  id: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  condition: "new" | "used";
  description: string;
  images: string[];
  sellerId: string;
  status: "available" | "pending" | "sold";
  createdAt: string;
}

export interface BikeFilters {
  brand?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: "new" | "used";
  sortBy?: "price_asc" | "price_desc" | "newest";
}

export const bikeService = {
  // Get all bikes
  getBikes: async (filters?: BikeFilters): Promise<Bike[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.LIST, {
      params: filters,
    });
    return response.data;
  },

  // Get bike detail
  getBikeDetail: async (id: string): Promise<Bike> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.DETAIL(id));
    return response.data;
  },

  // Search bikes
  searchBikes: async (query: string): Promise<Bike[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.SEARCH, {
      params: { q: query },
    });
    return response.data;
  },

  // Create bike listing
  createBike: async (data: Partial<Bike>): Promise<Bike> => {
    const response = await axiosInstance.post(API_ENDPOINTS.BIKES.CREATE, data);
    return response.data;
  },

  // Update bike listing
  updateBike: async (id: string, data: Partial<Bike>): Promise<Bike> => {
    const response = await axiosInstance.put(API_ENDPOINTS.BIKES.UPDATE(id), data);
    return response.data;
  },

  // Delete bike listing
  deleteBike: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.BIKES.DELETE(id));
  },
};
