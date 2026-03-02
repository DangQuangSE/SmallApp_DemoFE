import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faHeart,
  faHouse,
  faStore,
  faSuitcase,
} from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "../../../constants/routes";
import UserDropdown from "./userDropdown";
import logoImage from "../../../assets/images/Logo.png";
import "./header.css";

import { useAuth } from "../../../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const cartCount = 0; // TODO: Get from CartContext
  const wishlistCount = 0; // TODO: Get from WishlistContext
  const ordersCount = 0; // TODO: Get from OrderContext

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
              {wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
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
              {ordersCount > 0 && <span className="badge">{ordersCount}</span>}
            </Link>
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
