import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import type { BikePostDto } from "../types/bike.types";

export const cartService = {
  /** Get user's cart items (auth) */
  getCart: async (): Promise<BikePostDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  /** Add listing to cart (auth) */
  addToCart: async (listingId: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.CART.ADD(listingId));
  },

  /** Remove listing from cart (auth) */
  removeFromCart: async (listingId: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(listingId));
  },

  /** Clear entire cart (auth) */
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
  },

  /** Check if listing is in cart (auth) */
  checkCart: async (listingId: number): Promise<boolean> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.CART.CHECK(listingId),
    );
    return response.data;
  },

  /** Get cart item count (auth) */
  getCount: async (): Promise<number> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.COUNT);
    return response.data;
  },
};
