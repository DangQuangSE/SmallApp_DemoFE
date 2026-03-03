import type { FC } from "react";
import { ORDER_STATUS_MAP } from "../../../constants/order";
import "./orders.css";

interface OrderStatusBadgeProps {
  status?: number;
}

const OrderStatusBadge: FC<OrderStatusBadgeProps> = ({ status }) => {
  const info = ORDER_STATUS_MAP[status ?? 1] || ORDER_STATUS_MAP[1];
  return (
    <span className={`order-status-badge ${info.className}`}>{info.label}</span>
  );
};

export default OrderStatusBadge;
