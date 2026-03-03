import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faKey,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendar,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import AvatarUpload from "../../components/features/profile/AvatarUpload";
import { profileService } from "../../services/profile.service";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import type { UserProfileDto } from "../../types/auth.types";
import "../../components/features/profile/profile.css";

const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
        updateUser(data);
      } catch {
        toast.error("Không thể tải thông tin cá nhân");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, updateUser]);

  const handleAvatarUpload = async (file: File) => {
    const updated = await profileService.uploadAvatar(file);
    setProfile(updated);
    updateUser(updated);
    toast.success("Cập nhật ảnh đại diện thành công!");
  };

  const handleAvatarRemove = async () => {
    const updated = await profileService.removeAvatar();
    setProfile(updated);
    updateUser(updated);
    toast.success("Đã xoá ảnh đại diện");
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div
          className="profile-card"
          style={{ textAlign: "center", padding: "4rem" }}
        >
          <span className="spinner" />
          <p style={{ color: "#6b7280", marginTop: "1rem" }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  const displayProfile = profile || user;
  if (!displayProfile) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Top section — Avatar + Name */}
        <div className="profile-top">
          <AvatarUpload
            avatarUrl={displayProfile.avatarUrl}
            fullName={displayProfile.fullName}
            onUpload={handleAvatarUpload}
            onRemove={handleAvatarRemove}
          />
          <div className="profile-info-primary">
            <h1 className="profile-name">
              {displayProfile.fullName || displayProfile.username}
            </h1>
            <p className="profile-username">@{displayProfile.username}</p>
            <span className="profile-role-badge">
              {displayProfile.roleName}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="profile-details">
          <div className="profile-field">
            <span className="profile-field-label">
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </span>
            <span className="profile-field-value">{displayProfile.email}</span>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              <FontAwesomeIcon icon={faPhone} /> Số điện thoại
            </span>
            <span
              className={`profile-field-value ${!displayProfile.phoneNumber ? "profile-field-empty" : ""}`}
            >
              {displayProfile.phoneNumber || "Chưa cập nhật"}
            </span>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ
            </span>
            <span
              className={`profile-field-value ${!displayProfile.address ? "profile-field-empty" : ""}`}
            >
              {displayProfile.address || "Chưa cập nhật"}
            </span>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              <FontAwesomeIcon icon={faCalendar} /> Ngày tạo
            </span>
            <span className="profile-field-value">
              {formatDate(displayProfile.createdAt)}
            </span>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              <FontAwesomeIcon icon={faShieldAlt} /> Trạng thái
            </span>
            <span className="profile-field-value">
              {displayProfile.isVerified
                ? "✅ Đã xác minh"
                : "⏳ Chưa xác minh"}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="profile-actions">
          <Link to={ROUTES.PROFILE_EDIT} className="btn-outline">
            <FontAwesomeIcon icon={faEdit} />
            Chỉnh sửa hồ sơ
          </Link>
          <Link to={ROUTES.PROFILE_CHANGE_PASSWORD} className="btn-secondary">
            <FontAwesomeIcon icon={faKey} />
            Đổi mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
