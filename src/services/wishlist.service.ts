import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import { type Bike } from "./bike.service";

export interface WishlistItem {
  id: string;
  bikeId: string;
  bike: Bike;
  addedAt: string;
}

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WISHLIST.GET);
    return response.data;
  },

  // Add a bike to the wishlist
  addToWishlist: async (bikeId: string): Promise<WishlistItem> => {
    const response = await axiosInstance.post(API_ENDPOINTS.WISHLIST.ADD, {
      bikeId,
    });
    return response.data;
  },

  // Remove a bike from the wishlist
  removeFromWishlist: async (itemId: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.WISHLIST.REMOVE(itemId));
  },
};
