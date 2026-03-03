import type { FC } from "react";
import type { OrderDetailDto } from "../../../types/order.types";
import { formatVND } from "../../../utils/format";
import "./orders.css";

interface OrderItemsListProps {
  items: OrderDetailDto[];
}

const PLACEHOLDER = "/assets/images/placeholder-bike.png";

const OrderItemsList: FC<OrderItemsListProps> = ({ items }) => (
  <div className="order-items">
    <h3>Sản phẩm ({items.length})</h3>
    <div className="order-items-list">
      {items.map((item) => (
        <div key={item.orderDetailId} className="order-item-row">
          <img
            src={item.bikeImageUrl || PLACEHOLDER}
            alt={item.bikeTitle}
            className="order-item-image"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
          <div className="order-item-info">
            <div className="order-item-title">{item.bikeTitle}</div>
            <div className="order-item-seller">
              Người bán: {item.sellerName}
            </div>
          </div>
          <div className="order-item-qty">x{item.quantity}</div>
          <div className="order-item-price">
            <div className="order-item-unit">{formatVND(item.unitPrice)}</div>
            <div className="order-item-subtotal">
              {formatVND(item.subtotal)}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default OrderItemsList;
