import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";

// ===== DTOs =====
export interface CreateOrderDto {
  listingId: number;
}

export interface OrderDto {
  orderId: number;
  orderStatus?: number; // 1=Pending, 2=Paid, 3=Shipping, 4=Completed, 5=Cancelled, 6=Refunded
  totalAmount?: number;
  orderDate?: string;
  bikeTitle: string;
  bikeImageUrl?: string;
  buyerName: string;
  sellerName: string;
}

export interface ProcessPaymentDto {
  orderId: number;
  amount: number;
  paymentMethod?: string;
}

export const orderService = {
  // Place order (auth)
  createOrder: async (data: CreateOrderDto): Promise<OrderDto> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ORDERS.CREATE,
      data,
    );
    return response.data;
  },

  // Get order detail (auth)
  getOrderDetail: async (id: number): Promise<OrderDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id));
    return response.data;
  },

  // Get my purchases (auth)
  getMyPurchases: async (): Promise<OrderDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MY_PURCHASES);
    return response.data;
  },

  // Cancel order (auth)
  cancelOrder: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ORDERS.CANCEL(id));
  },

  // Confirm delivery (auth)
  confirmDelivery: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ORDERS.CONFIRM_DELIVERY(id));
  },

  // Process payment (auth)
  processPayment: async (data: ProcessPaymentDto): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ORDERS.PAYMENT, data);
  },
};
