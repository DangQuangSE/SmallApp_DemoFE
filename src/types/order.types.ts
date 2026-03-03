// ===== Request DTOs =====

export interface OrderItemDto {
  listingId: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
}

export interface CreatePaymentUrlDto {
  orderId: number;
  paymentType: "deposit" | "full";
}

// ===== Response DTOs =====

export interface OrderDetailDto {
  orderDetailId: number;
  listingId: number;
  bikeTitle: string;
  bikeImageUrl?: string;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number; // Computed: unitPrice × quantity
}

export interface PaymentDto {
  paymentId: number;
  amount?: number;
  paymentMethod?: string;
  transactionRef?: string;
  paymentDate?: string;
}

export interface OrderDto {
  orderId: number;
  orderStatus?: number; // 1-6
  totalAmount?: number;
  depositAmount?: number;
  remainingAmount?: number;
  depositStatus?: number; // 1=Pending, 2=Confirmed, 3=Cancelled
  orderDate?: string;
  buyerName: string;
  items: OrderDetailDto[];
  payments: PaymentDto[];
}

export interface PaymentUrlResultDto {
  paymentUrl: string;
  orderId: number;
  amount: number;
  paymentType: string;
}
