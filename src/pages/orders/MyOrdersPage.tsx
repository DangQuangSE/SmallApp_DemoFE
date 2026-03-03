import { useState, useEffect, useMemo, type FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { orderService, type OrderDto } from "../../services/order.service";
import { ORDER_FILTER_OPTIONS } from "../../constants/order";
import { ROUTES } from "../../constants/routes";
import OrderCard from "../../components/features/orders/OrderCard";
import "../../components/features/orders/orders.css";

const MyOrdersPage: FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(0);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng.");
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch orders
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await orderService.getMyPurchases();
        setOrders(data);
      } catch {
        toast.error("Không thể tải danh sách đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  // Client-side filter
  const filteredOrders = useMemo(
    () =>
      statusFilter === 0
        ? orders
        : orders.filter((o) => o.orderStatus === statusFilter),
    [orders, statusFilter],
  );

  if (authLoading) {
    return <div className="orders-loading">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="orders-page">
      <h1 className="orders-page-title">Đơn hàng của tôi</h1>

      {/* Filter tabs */}
      <div className="order-filter-tabs">
        {ORDER_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`order-filter-tab ${statusFilter === opt.value ? "active" : ""}`}
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="orders-loading">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-order-card" />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      ) : (
        <div className="orders-empty">
          <span className="orders-empty-icon">📦</span>
          <p className="orders-empty-text">
            {statusFilter === 0
              ? "Bạn chưa có đơn hàng nào."
              : "Không có đơn hàng nào ở trạng thái này."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
