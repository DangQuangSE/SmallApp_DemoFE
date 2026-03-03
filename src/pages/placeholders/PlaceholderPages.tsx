import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const PlaceholderPage: FC<{ title: string; icon: string }> = ({
  title,
  icon,
}) => (
  <div
    style={{
      padding: "4rem 2rem",
      textAlign: "center",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    }}
  >
    <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>{icon}</div>
    <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#1f2937" }}>
      {title}
    </h1>
    <p style={{ fontSize: "1.1rem", color: "#6b7280", marginBottom: "2.5rem" }}>
      Tính năng này đang được phát triển. Vui lòng quay lại sau!
    </p>
    <Link
      to={ROUTES.HOME}
      style={{
        display: "inline-block",
        padding: "0.75rem 2rem",
        backgroundColor: "#c41e3a",
        color: "white",
        fontWeight: "600",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "background-color 0.2s",
      }}
    >
      Quay về trang chủ
    </Link>
  </div>
);

export const CartPage = () => (
  <PlaceholderPage title="Giỏ hàng của bạn" icon="🛒" />
);
export const WishlistPage = () => (
  <PlaceholderPage title="Danh sách yêu thích" icon="❤️" />
);
export const MyOrdersPage = () => (
  <PlaceholderPage title="Đơn hàng của tôi" icon="📦" />
);
