import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import "./header.css";

import { useAuth } from "../../../contexts/AuthContext";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayUser = user || {
    fullName: "Guest",
    username: "guest",
    email: "",
    avatarUrl: "",
    roleName: "Buyer",
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        className="avatar-btn"
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <span className="avatar">
          {displayUser.avatarUrl ? (
            <img
              src={displayUser.avatarUrl}
              alt="avatar"
              style={{ width: 28, height: 28, borderRadius: "50%" }}
            />
          ) : (
            "👤"
          )}
        </span>
        <span className="user-name">
          {displayUser.fullName || displayUser.username}
        </span>
        <span className="dropdown-icon">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          {/* User Info */}
          <div className="user-info">
            <div className="avatar-large">
              {displayUser.avatarUrl ? (
                <img
                  src={displayUser.avatarUrl}
                  alt="avatar"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              ) : (
                "👤"
              )}
            </div>
            <div className="user-details">
              <p className="user-name-large">
                {displayUser.fullName || displayUser.username}
              </p>
              <p className="user-email">{displayUser.email}</p>
            </div>
          </div>

          <div className="divider" />

          {/* Menu Items */}
          <Link
            to={ROUTES.PROFILE}
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="menu-icon">👤</span>
            <span>Trang cá nhân</span>
          </Link>

          <Link
            to={ROUTES.SETTINGS}
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="menu-icon">⚙️</span>
            <span>Cài đặt</span>
          </Link>

          {/* Role-specific menu */}
          {displayUser.roleName === "Seller" && (
            <>
              <Link
                to={ROUTES.SELLER_LISTINGS}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">📋</span>
                <span>Bài đăng của tôi</span>
              </Link>
              <Link
                to={ROUTES.SELLER_CREATE}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">➕</span>
                <span>Đăng bài bán xe</span>
              </Link>
              <Link
                to={ROUTES.SELLER_INSPECTIONS}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">🔍</span>
                <span>Yêu cầu kiểm định</span>
              </Link>
            </>
          )}

          {displayUser.roleName === "Inspector" && (
            <>
              <Link
                to={ROUTES.INSPECTOR_PENDING}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">📋</span>
                <span>Yêu cầu chờ nhận</span>
              </Link>
              <Link
                to={ROUTES.INSPECTOR_ASSIGNED}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">📝</span>
                <span>Yêu cầu đã nhận</span>
              </Link>
              <Link
                to={ROUTES.INSPECTOR_MY_REPORTS}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">📄</span>
                <span>Báo cáo đã upload</span>
              </Link>
            </>
          )}

          {displayUser.roleName === "Admin" && (
            <>
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">📊</span>
                <span>Admin Dashboard</span>
              </Link>
              <Link
                to={ROUTES.ADMIN_MODERATION}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">📋</span>
                <span>Duyệt bài đăng</span>
              </Link>
              <Link
                to={ROUTES.ADMIN_USERS}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">👥</span>
                <span>Quản lý người dùng</span>
              </Link>
              <Link
                to={ROUTES.ADMIN_ABUSE}
                className="menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">🚩</span>
                <span>Báo cáo vi phạm</span>
              </Link>
            </>
          )}

          {/* Buyer reports link */}
          <Link
            to={ROUTES.MY_REPORTS}
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="menu-icon">🚩</span>
            <span>Báo cáo của tôi</span>
          </Link>

          <div className="divider" />

          {/* Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
