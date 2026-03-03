import { useState, useEffect, type FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "../../utils/validators";
import { profileService } from "../../services/profile.service";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import "../../components/features/profile/profile.css";
import "../../components/features/auth/auth.css";

const EditProfilePage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        form.reset({
          fullName: profile.fullName || "",
          phoneNumber: profile.phoneNumber || "",
          address: profile.address || "",
        });
      } catch {
        toast.error("Không thể tải thông tin cá nhân");
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, form]);

  const handleSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const updated = await profileService.updateProfile({
        fullName: data.fullName || undefined,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
      });
      updateUser(updated);
      setMessage("Cập nhật hồ sơ thành công!");
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Cập nhật thất bại";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
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

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-card-header">
          <h2 className="profile-card-title">Chỉnh sửa hồ sơ</h2>
        </div>

        {/* Messages */}
        {message && (
          <div className="profile-message success">
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="profile-message error">
            <FontAwesomeIcon icon={faCircleXmark} />
            <span>{error}</span>
          </div>
        )}

        <form
          className="profile-form"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              className={`form-input ${form.formState.errors.fullName ? "error" : ""}`}
              placeholder="Nguyễn Văn A"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Số điện thoại
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className={`form-input ${form.formState.errors.phoneNumber ? "error" : ""}`}
              placeholder="0901234567"
              {...form.register("phoneNumber")}
            />
            {form.formState.errors.phoneNumber && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Địa chỉ
            </label>
            <input
              id="address"
              type="text"
              className={`form-input ${form.formState.errors.address ? "error" : ""}`}
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              {...form.register("address")}
            />
            {form.formState.errors.address && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="profile-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : "Lưu thay đổi"}
            </button>
            <Link to={ROUTES.PROFILE} className="btn-secondary">
              Huỷ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
