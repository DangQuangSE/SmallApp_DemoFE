import type { FC } from "react";
import { Link } from "react-router-dom";
import type { OrderDto } from "../../../types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatVND, formatDate } from "../../../utils/format";
import { ROUTES } from "../../../constants/routes";
import "./orders.css";

interface OrderCardProps {
  order: OrderDto;
}

const PLACEHOLDER = "/assets/images/placeholder-bike.png";

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const firstItem = order.items[0];
  const detailUrl = ROUTES.ORDER_DETAIL.replace(":id", String(order.orderId));

  return (
    <Link to={detailUrl} className="order-card">
      <div className="order-card-header">
        <span className="order-card-id">Đơn #{order.orderId}</span>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="order-card-body">
        {firstItem && (
          <img
            src={firstItem.bikeImageUrl || PLACEHOLDER}
            alt={firstItem.bikeTitle}
            className="order-card-image"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        )}
        <div className="order-card-info">
          {order.items.length === 1 ? (
            <div className="order-card-title">{firstItem?.bikeTitle}</div>
          ) : (
            <div className="order-card-title">
              {firstItem?.bikeTitle}
              <span className="order-card-more">
                {" "}
                +{order.items.length - 1} sản phẩm khác
              </span>
            </div>
          )}
          <div className="order-card-date">{formatDate(order.orderDate)}</div>
        </div>
        <div className="order-card-amount">{formatVND(order.totalAmount)}</div>
      </div>
    </Link>
  );
};

export default OrderCard;
