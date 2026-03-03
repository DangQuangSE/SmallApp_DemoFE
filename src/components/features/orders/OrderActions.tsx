import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { orderService } from "../../../services/order.service";
import { ORDER_STATUS } from "../../../constants/order";
import { formatVND } from "../../../utils/format";
import type { OrderDto } from "../../../types/order.types";
import "./orders.css";

interface OrderActionsProps {
  order: OrderDto;
  onReload: () => void;
}

const OrderActions: FC<OrderActionsProps> = ({ order, onReload }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayDeposit = async () => {
    try {
      setIsLoading(true);
      const result = await orderService.createPaymentUrl(
        order.orderId,
        "deposit",
      );
      // CRITICAL: use window.location.href, NOT navigate()
      window.location.href = result.paymentUrl;
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Không thể tạo link thanh toán";
      toast.error(errMsg);
      setIsLoading(false);
    }
  };

  const handlePayRemaining = async () => {
    try {
      setIsLoading(true);
      const result = await orderService.createPaymentUrl(order.orderId, "full");
      window.location.href = result.paymentUrl;
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Không thể tạo link thanh toán";
      toast.error(errMsg);
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn huỷ đơn hàng?\n⚠️ Nếu đã đặt cọc, tiền cọc có thể không được hoàn tự động.",
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await orderService.cancelOrder(order.orderId);
      toast.success("Đơn hàng đã được huỷ");
      onReload();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Huỷ đơn thất bại";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    const confirmed = window.confirm(
      "Xác nhận đã nhận hàng?\nSau khi xác nhận, đơn hàng sẽ hoàn thành.",
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await orderService.confirmDelivery(order.orderId);
      toast.success("Đã xác nhận nhận hàng thành công!");
      onReload();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Xác nhận thất bại";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const status = order.orderStatus ?? 1;

  return (
    <div className="order-actions">
      {/* Pending → deposit */}
      {status === ORDER_STATUS.PENDING && (
        <button
          className="btn-primary"
          onClick={handlePayDeposit}
          disabled={isLoading}
        >
          {isLoading
            ? "Đang xử lý..."
            : `💳 Đặt cọc ${formatVND(order.depositAmount)}`}
        </button>
      )}

      {/* Paid → pay remaining */}
      {status === ORDER_STATUS.PAID && (
        <button
          className="btn-primary"
          onClick={handlePayRemaining}
          disabled={isLoading}
        >
          {isLoading
            ? "Đang xử lý..."
            : `💳 Thanh toán ${formatVND(order.remainingAmount)}`}
        </button>
      )}

      {/* Pending or Paid → cancel */}
      {(status === ORDER_STATUS.PENDING || status === ORDER_STATUS.PAID) && (
        <button
          className="btn-danger"
          onClick={handleCancel}
          disabled={isLoading}
        >
          ✕ Huỷ đơn
        </button>
      )}

      {/* Shipping → confirm delivery */}
      {status === ORDER_STATUS.SHIPPING && (
        <button
          className="btn-primary"
          onClick={handleConfirmDelivery}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "✓ Xác nhận nhận hàng"}
        </button>
      )}
    </div>
  );
};

export default OrderActions;
