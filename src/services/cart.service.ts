import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";

export interface CartItem {
  id: string;
  bikeId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export const cartService = {
  // Get cart
  getCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  // Add to cart
  addToCart: async (bikeId: string, quantity: number = 1): Promise<Cart> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
      bikeId,
      quantity,
    });
    return response.data;
  },

  // Update cart item quantity
  updateQuantity: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE(itemId), {
      quantity,
    });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(itemId));
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
  },
};
