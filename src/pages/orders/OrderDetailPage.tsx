import { useState, useEffect, useCallback, type FC } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { orderService, type OrderDto } from "../../services/order.service";
import { ratingService } from "../../services/rating.service";
import { ROUTES } from "../../constants/routes";
import { ORDER_STATUS } from "../../constants/order";
import OrderStatusBadge from "../../components/features/orders/OrderStatusBadge";
import OrderItemsList from "../../components/features/orders/OrderItemsList";
import OrderSummary from "../../components/features/orders/OrderSummary";
import PaymentHistory from "../../components/features/orders/PaymentHistory";
import OrderActions from "../../components/features/orders/OrderActions";
import CreateRatingForm from "../../components/features/rating/CreateRatingForm";
import { formatDateTime } from "../../utils/format";
import "../../components/features/orders/orders.css";

const OrderDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasRated, setHasRated] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng.");
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch order detail
  const loadOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await orderService.getOrderDetail(Number(id));
      setOrder(data);
    } catch {
      setError("Không thể tải thông tin đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) loadOrder();
  }, [isAuthenticated, loadOrder]);

  // Handle VNPay return query params
  useEffect(() => {
    const paymentResult = searchParams.get("payment");
    if (!paymentResult) return;

    if (paymentResult === "success") {
      toast.success("Thanh toán thành công!");
      loadOrder(); // Reload to get updated status
    } else if (paymentResult === "failed") {
      toast.error("Thanh toán thất bại. Vui lòng thử lại.");
    }

    // Clean URL by removing the payment param
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, loadOrder]);

  // Check if order has been rated (only for completed orders)
  useEffect(() => {
    if (!order || order.orderStatus !== ORDER_STATUS.COMPLETED) return;

    let cancelled = false;
    ratingService
      .hasRatedOrder(order.orderId)
      .then((rated) => {
        if (!cancelled) setHasRated(rated);
      })
      .catch(() => {
        // ignore
      });

    return () => {
      cancelled = true;
    };
  }, [order]);

  if (authLoading) {
    return <div className="orders-loading">Đang kiểm tra đăng nhập...</div>;
  }

  if (isLoading) {
    return (
      <div className="order-detail-page">
        <div className="orders-loading">Đang tải đơn hàng...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <p className="order-detail-error">
          {error || "Không tìm thấy đơn hàng."}
        </p>
        <button
          className="btn-secondary"
          onClick={() => navigate(ROUTES.MY_ORDERS)}
        >
          ← Quay lại đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <button
        className="order-detail-back"
        onClick={() => navigate(ROUTES.MY_ORDERS)}
      >
        ← Đơn hàng của tôi
      </button>

      {/* Header */}
      <div className="order-detail-header">
        <div>
          <h1 className="order-detail-title">Đơn hàng #{order.orderId}</h1>
          {order.orderDate && (
            <p className="order-detail-date">
              Đặt ngày: {formatDateTime(order.orderDate)}
            </p>
          )}
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      {/* Content grid */}
      <div className="order-detail-grid">
        {/* Left column */}
        <div className="order-detail-left">
          <OrderItemsList items={order.items} />
          {order.payments.length > 0 && (
            <PaymentHistory payments={order.payments} />
          )}
        </div>

        {/* Right column */}
        <div className="order-detail-right">
          <OrderSummary order={order} />
          <OrderActions order={order} onReload={loadOrder} />

          {/* Rating section — only for completed orders */}
          {order.orderStatus === ORDER_STATUS.COMPLETED &&
            (hasRated ? (
              <div className="rated-badge">✅ Đã đánh giá</div>
            ) : (
              <CreateRatingForm
                orderId={order.orderId}
                onSuccess={() => setHasRated(true)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
