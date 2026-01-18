import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import UserDropdown from "./userDropdown";
import "./header.css";

const Header = () => {
  const isLoggedIn = true; // Test data
  const cartCount = 3; // Test data
  const wishlistCount = 5; // Test data
  const ordersCount = 2; // Test data

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to={ROUTES.HOME} className="logo">
            <span className="logo-icon">🚲</span>
            <span className="logo-text">SecondBicycle</span>
          </Link>
          <div className="spacer" />
          <nav
            className="
          
          nav"
          >
            {/* Trang chủ */}
            <Link to={ROUTES.HOME} className="nav-link">
              Trang chủ
            </Link>
            {/* Giỏ hàng */}
            <Link to={ROUTES.CART} className="icon-link">
              <span className="icon">🛒</span>
              <span className="label">Giỏ hàng</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
            {/* Wishlist */}
            <Link to={ROUTES.WISHLIST} className="icon-link">
              <span className="icon">❤️</span>
              <span className="label">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
            </Link>
            {/* Đơn hàng */}
            <Link to={ROUTES.MY_ORDERS} className="icon-link">
              <span className="icon">📦</span>
              <span className="label">Đơn hàng</span>
              {ordersCount > 0 && <span className="badge">{ordersCount}</span>}
            </Link>
            {/* Avatar & Dropdown */}
            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <Link to={ROUTES.LOGIN} className="login-btn">
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
