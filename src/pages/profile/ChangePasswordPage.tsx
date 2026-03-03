import { useState, useEffect, type FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../../utils/validators";
import { profileService } from "../../services/profile.service";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import "../../components/features/profile/profile.css";
import "../../components/features/auth/auth.css";

const ChangePasswordPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const currentNewPassword = form.watch("newPassword") || "";
  const passwordRequirements = [
    { label: "Ít nhất 8 ký tự", met: currentNewPassword.length >= 8 },
    { label: "Có chữ hoa", met: /[A-Z]/.test(currentNewPassword) },
    { label: "Có chữ thường", met: /[a-z]/.test(currentNewPassword) },
    { label: "Có số", met: /[0-9]/.test(currentNewPassword) },
    {
      label: "Có ký tự đặc biệt",
      met: /[^a-zA-Z0-9]/.test(currentNewPassword),
    },
  ];

  const handleSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      await profileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setMessage("Đổi mật khẩu thành công!");
      toast.success("Đổi mật khẩu thành công!");
      form.reset();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Đổi mật khẩu thất bại";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-card-header">
          <h2 className="profile-card-title">Đổi mật khẩu</h2>
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
          className="profile-form password-section"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Current Password */}
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Mật khẩu hiện tại
            </label>
            <div className="password-input-wrapper">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                className={`form-input ${form.formState.errors.currentPassword ? "error" : ""}`}
                placeholder="••••••••"
                {...form.register("currentPassword")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={
                  showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                <FontAwesomeIcon
                  icon={showCurrentPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
            {form.formState.errors.currentPassword && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              Mật khẩu mới
            </label>
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                className={`form-input ${form.formState.errors.newPassword ? "error" : ""}`}
                placeholder="••••••••"
                {...form.register("newPassword")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {form.formState.errors.newPassword && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Password requirements */}
          {currentNewPassword && (
            <div className="password-requirements">
              <h4>Yêu cầu mật khẩu:</h4>
              {passwordRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`requirement ${req.met ? "met" : ""}`}
                >
                  <FontAwesomeIcon
                    icon={req.met ? faCircleCheck : faCircleXmark}
                    className="requirement-icon"
                  />
                  {req.label}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="profile-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : "Đổi mật khẩu"}
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

export default ChangePasswordPage;
