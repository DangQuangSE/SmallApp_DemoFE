import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";

export interface OrderItem {
  bikeId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: { bikeId: string; quantity: number }[];
  shippingAddress: string;
  paymentMethod: string;
}

export const orderService = {
  // Get all orders for the current user
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.LIST);
    return response.data;
  },

  // Get details of a specific order
  getOrderDetail: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id));
    return response.data;
  },

  // Create a new order
  createOrder: async (data: CreateOrderPayload): Promise<Order> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, data);
    return response.data;
  },

  // Cancel an order (if allowed)
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
    return response.data;
  },
};
