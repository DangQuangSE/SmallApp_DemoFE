import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faComment,
  faHeart,
  faHouse,
  faStore,
  faSuitcase,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "../../../constants/routes";
import { cartService } from "../../../services/cart.service";
import { chatService } from "../../../services/chat.service";
import UserDropdown from "./userDropdown";
import logoImage from "../../../assets/images/Logo.png";
import "./header.css";

import { useAuth } from "../../../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch cart count & unread messages when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    cartService
      .getCount()
      .then(setCartCount)
      .catch(() => setCartCount(0));
    chatService
      .getUnreadCount()
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));
  }, [isAuthenticated]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to={ROUTES.HOME} className="logo">
            <img
              src={logoImage}
              alt="SecondBicycle Logo"
              className="logo-image"
            />
          </Link>
          <div className="spacer" />
          <nav className="nav">
            {/* Trang chủ */}
            <Link
              to={ROUTES.HOME}
              className="nav-link home-link"
              data-tooltip="Trang chủ"
            >
              <FontAwesomeIcon icon={faHouse} className="icon" />
            </Link>
            {/* Mua sắm */}
            <Link
              to={ROUTES.STORE}
              className="nav-link home-link"
              data-tooltip="Cửa hàng"
            >
              <FontAwesomeIcon icon={faStore} className="icon" />
            </Link>
            {/* Wishlist */}
            <Link
              to={ROUTES.WISHLIST}
              className="icon-link"
              data-tooltip="Yêu thích"
            >
              <FontAwesomeIcon icon={faHeart} className="icon" />
            </Link>
            {/* Giỏ hàng */}
            <Link
              to={ROUTES.CART}
              className="icon-link"
              data-tooltip="Giỏ hàng"
            >
              <FontAwesomeIcon icon={faCartArrowDown} className="icon" />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
            {/* Đơn hàng */}
            <Link
              to={ROUTES.MY_ORDERS}
              className="icon-link"
              data-tooltip="Đơn hàng"
            >
              <FontAwesomeIcon icon={faSuitcase} className="icon" />
            </Link>
            {/* Tin nhắn */}
            <Link
              to={ROUTES.MESSAGES}
              className="icon-link"
              data-tooltip="Tin nhắn"
            >
              <FontAwesomeIcon icon={faComment} className="icon" />
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </Link>
            {/* Role Dashboard Shortcut */}
            {isAuthenticated && user?.roleName === "Admin" && (
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className="role-dashboard-btn admin-role"
                data-tooltip="Admin Dashboard"
              >
                <FontAwesomeIcon icon={faGaugeHigh} className="icon" />
                <span className="role-btn-label">Admin</span>
              </Link>
            )}
            {isAuthenticated && user?.roleName === "Seller" && (
              <Link
                to={ROUTES.SELLER_DASHBOARD}
                className="role-dashboard-btn seller-role"
                data-tooltip="Seller Dashboard"
              >
                <FontAwesomeIcon icon={faGaugeHigh} className="icon" />
                <span className="role-btn-label">Seller</span>
              </Link>
            )}
            {isAuthenticated && user?.roleName === "Inspector" && (
              <Link
                to={ROUTES.INSPECTOR_DASHBOARD}
                className="role-dashboard-btn inspector-role"
                data-tooltip="Inspector Dashboard"
              >
                <FontAwesomeIcon icon={faGaugeHigh} className="icon" />
                <span className="role-btn-label">Inspector</span>
              </Link>
            )}
            {/* Avatar & Dropdown */}
            {isAuthenticated ? (
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
