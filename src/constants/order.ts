// ===== Order Status =====

export const ORDER_STATUS = {
  PENDING: 1,
  PAID: 2,
  SHIPPING: 3,
  COMPLETED: 4,
  CANCELLED: 5,
  REFUNDED: 6,
} as const;

export const ORDER_STATUS_MAP: Record<
  number,
  { label: string; className: string }
> = {
  1: { label: "Chờ đặt cọc", className: "order-status-pending" },
  2: { label: "Đã đặt cọc", className: "order-status-paid" },
  3: { label: "Đang giao hàng", className: "order-status-shipping" },
  4: { label: "Hoàn thành", className: "order-status-completed" },
  5: { label: "Đã huỷ", className: "order-status-cancelled" },
  6: { label: "Đã hoàn tiền", className: "order-status-refunded" },
};

// ===== Deposit Status =====

export const DEPOSIT_STATUS = {
  PENDING: 1,
  CONFIRMED: 2,
  CANCELLED: 3,
} as const;

export const DEPOSIT_STATUS_MAP: Record<number, string> = {
  1: "Chờ thanh toán",
  2: "Đã xác nhận",
  3: "Đã huỷ",
};

// ===== Status filter options for MyOrdersPage =====

export const ORDER_FILTER_OPTIONS = [
  { value: 0, label: "Tất cả" },
  { value: ORDER_STATUS.PENDING, label: "Chờ đặt cọc" },
  { value: ORDER_STATUS.PAID, label: "Đã đặt cọc" },
  { value: ORDER_STATUS.SHIPPING, label: "Đang giao" },
  { value: ORDER_STATUS.COMPLETED, label: "Hoàn thành" },
  { value: ORDER_STATUS.CANCELLED, label: "Đã huỷ" },
] as const;
