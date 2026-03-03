import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import { type BikePostDto } from "./bike.service";

export const wishlistService = {
  // Get user's wishlist (auth) - returns BikePostDto[]
  getWishlist: async (): Promise<BikePostDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WISHLIST.GET);
    return response.data;
  },

  // Add a listing to the wishlist (auth)
  addToWishlist: async (listingId: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.WISHLIST.ADD(listingId));
  },

  // Remove a listing from the wishlist (auth)
  removeFromWishlist: async (listingId: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.WISHLIST.REMOVE(listingId));
  },

  // Check if a listing is in wishlist (auth)
  checkWishlist: async (listingId: number): Promise<boolean> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.WISHLIST.CHECK(listingId),
    );
    return response.data;
  },
};
