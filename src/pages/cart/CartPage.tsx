import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { cartService } from "../../services/cart.service";
import { orderService } from "../../services/order.service";
import type { BikePostDto } from "../../types/bike.types";
import { ROUTES } from "../../constants/routes";
import { formatVND } from "../../utils/format";
import BikeCard from "../../components/features/bikes/BikeCard";
import "./cart.css";

const CartPage: FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<BikePostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng.");
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch cart
  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await cartService.getCart();
        setItems(data);
      } catch {
        toast.error("Không thể tải giỏ hàng.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  const handleRemove = async (listingId: number) => {
    try {
      await cartService.removeFromCart(listingId);
      setItems((prev) => prev.filter((item) => item.listingId !== listingId));
      toast.success("Đã bỏ khỏi giỏ hàng.");
    } catch {
      toast.error("Không thể xoá khỏi giỏ hàng.");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Bạn có chắc muốn xoá toàn bộ giỏ hàng?")) return;
    try {
      await cartService.clearCart();
      setItems([]);
      toast.success("Đã xoá toàn bộ giỏ hàng.");
    } catch {
      toast.error("Không thể xoá giỏ hàng.");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const orderItems = items.map((item) => ({
        listingId: item.listingId,
        quantity: 1,
      }));
      const order = await orderService.placeOrder(orderItems);
      toast.success("Đặt hàng thành công!");
      // Clear cart after successful order
      await cartService.clearCart();
      navigate(ROUTES.ORDER_DETAIL.replace(":id", String(order.orderId)));
    } catch {
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  if (authLoading) {
    return <div className="cart-loading">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Giỏ hàng ({items.length})</h1>
        {items.length > 0 && (
          <button className="cart-clear-btn" onClick={handleClearAll}>
            🗑️ Xoá tất cả
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="cart-loading">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="cart-grid">
            {items.map((item) => (
              <div key={item.listingId} className="cart-item">
                <BikeCard bike={item} />
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemove(item.listingId)}
                >
                  ✕ Xoá
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Tổng ({items.length} sản phẩm)</span>
              <strong>{formatVND(totalPrice)}</strong>
            </div>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Đang xử lý..." : "Tiến hành đặt hàng"}
            </button>
          </div>
        </>
      ) : (
        <div className="cart-empty">
          <span className="cart-empty-icon">🛒</span>
          <p>Giỏ hàng trống.</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
