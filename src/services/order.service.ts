import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import type {
  OrderDto,
  OrderItemDto,
  PaymentUrlResultDto,
} from "../types/order.types";

// Re-export types for convenience
export type {
  OrderDto,
  OrderDetailDto,
  OrderItemDto,
  PaymentDto,
  PaymentUrlResultDto,
  CreateOrderDto,
  CreatePaymentUrlDto,
} from "../types/order.types";

export const orderService = {
  /** Place order with multiple items */
  placeOrder: async (items: OrderItemDto[]): Promise<OrderDto> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, {
      items,
    });
    return response.data;
  },

  /** Buy single item (convenience helper) */
  buyNow: async (
    listingId: number,
    quantity: number = 1,
  ): Promise<OrderDto> => {
    return orderService.placeOrder([{ listingId, quantity }]);
  },

  /** Get order detail */
  getOrderDetail: async (id: number): Promise<OrderDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id));
    return response.data;
  },

  /** Get my purchases (sorted newest first) */
  getMyPurchases: async (): Promise<OrderDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MY_PURCHASES);
    return response.data;
  },

  /** Cancel order (only Pending or Paid status) */
  cancelOrder: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ORDERS.CANCEL(id));
  },

  /** Confirm delivery (only Shipping status) */
  confirmDelivery: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ORDERS.CONFIRM_DELIVERY(id));
  },

  /**
   * Create VNPay payment URL.
   * IMPORTANT: FE must use window.location.href (NOT navigate())
   * because this redirects to an external VNPay domain.
   */
  createPaymentUrl: async (
    orderId: number,
    paymentType: "deposit" | "full",
  ): Promise<PaymentUrlResultDto> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ORDERS.CREATE_PAYMENT_URL,
      { orderId, paymentType },
    );
    return response.data;
  },
};
