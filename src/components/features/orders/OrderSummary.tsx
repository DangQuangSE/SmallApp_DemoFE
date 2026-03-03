import type { FC } from "react";
import type { OrderDto } from "../../../types/order.types";
import { formatVND } from "../../../utils/format";
import { DEPOSIT_STATUS_MAP } from "../../../constants/order";
import "./orders.css";

interface OrderSummaryProps {
  order: OrderDto;
}

const OrderSummary: FC<OrderSummaryProps> = ({ order }) => {
  const totalPaid = order.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="order-summary">
      <h3>Tổng hợp thanh toán</h3>
      <div className="order-summary-rows">
        <div className="order-summary-row">
          <span>Tổng giá trị đơn hàng</span>
          <span className="order-summary-value">
            {formatVND(order.totalAmount)}
          </span>
        </div>
        <div className="order-summary-row">
          <span>Tiền đặt cọc (20%)</span>
          <span className="order-summary-value">
            {formatVND(order.depositAmount)}
          </span>
        </div>
        <div className="order-summary-row">
          <span>Trạng thái cọc</span>
          <span className="order-summary-value">
            {DEPOSIT_STATUS_MAP[order.depositStatus ?? 1] || "Chờ thanh toán"}
          </span>
        </div>
        <div className="order-summary-row">
          <span>Đã thanh toán</span>
          <span className="order-summary-value order-summary-paid">
            {formatVND(totalPaid)}
          </span>
        </div>
        <div className="order-summary-row order-summary-total">
          <span>Còn phải trả</span>
          <span className="order-summary-value order-summary-remaining">
            {formatVND(order.remainingAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
