import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { orderService, type OrderDto } from "../../services/order.service";
import { ROUTES } from "../../constants/routes";
import "./seller.css";

const ORDER_STATUS_LABELS: Record<number, string> = {
    0: "Chờ thanh toán",
    1: "Đã thanh toán",
    2: "Đang giao",
    3: "Đã giao",
    4: "Đã hủy",
    5: "Hoàn tiền",
};

const ORDER_STATUS_CLASS: Record<number, string> = {
    0: "pending",
    1: "paid",
    2: "shipping",
    3: "delivered",
    4: "cancelled",
    5: "cancelled",
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const SellerOrdersPage: FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || (user.roleName !== "Seller" && user.roleName !== "Admin")) {
            navigate(ROUTES.HOME);
            return;
        }
        const loadOrders = async () => {
            try {
                const data = await orderService.getMyPurchases();
                setOrders(data);
            } catch {
                toast.error("Không thể tải danh sách đơn hàng.");
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();
    }, [user, navigate]);

    if (isLoading) {
        return <div className="loading-container">Đang tải...</div>;
    }

    return (
        <div className="seller-orders-page">
            <h2>📦 Đơn hàng bán ra</h2>

            {/* Navigation */}
            <nav className="seller-nav">
                <Link to={ROUTES.SELLER_DASHBOARD} className="seller-nav-link">
                    Dashboard
                </Link>
                <Link to={ROUTES.SELLER_LISTINGS} className="seller-nav-link">
                    Bài đăng
                </Link>
                <Link to={ROUTES.SELLER_CREATE} className="seller-nav-link">
                    Đăng bài mới
                </Link>
                <Link to={ROUTES.SELLER_INSPECTIONS} className="seller-nav-link">
                    Yêu cầu kiểm định
                </Link>
                <Link to={ROUTES.SELLER_ORDERS} className="seller-nav-link active">
                    Đơn hàng bán ra
                </Link>
            </nav>

            {orders.length === 0 ? (
                <p className="seller-orders-empty">Chưa có đơn hàng nào.</p>
            ) : (
                <div className="seller-orders-list">
                    {orders.map((order) => (
                        <div key={order.orderId} className="seller-order-card">
                            <div className="seller-order-header">
                                <span className="seller-order-id">
                                    Đơn hàng #{order.orderId}
                                </span>
                                <span
                                    className={`order-status-badge ${ORDER_STATUS_CLASS[order.orderStatus ?? 0] ?? ""}`}
                                >
                                    {ORDER_STATUS_LABELS[order.orderStatus ?? 0] ?? "Không rõ"}
                                </span>
                            </div>
                            <div className="seller-order-info">
                                <p>
                                    <strong>Người mua:</strong>{" "}
                                    {order.buyerName ?? "Không rõ"}
                                </p>
                                <p>
                                    <strong>Tổng tiền:</strong> {formatPrice(order.totalAmount)}
                                </p>
                                <p>
                                    <strong>Ngày đặt:</strong> {formatDate(order.orderDate)}
                                </p>
                            </div>
                            <div className="seller-order-actions">
                                <Link
                                    to={ROUTES.ORDER_DETAIL.replace(
                                        ":id",
                                        String(order.orderId)
                                    )}
                                    className="seller-nav-link"
                                >
                                    📄 Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage;
