import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import { useRegister } from "../../hooks/auth/useRegister";
import GoogleButton from "../../components/features/auth/GoogleButton";
import { ROUTES } from "../../constants/routes";
import "../../components/features/auth/auth.css";

const Register: FC = () => {
  const { isLoading, registerForm, handleRegisterSubmit, handleGoogleLogin } =
    useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = registerForm;

  const currentPassword = watch("password") || "";
  const passwordRequirements = [
    { label: "Ít nhất 8 ký tự", met: currentPassword.length >= 8 },
    { label: "Có chữ hoa", met: /[A-Z]/.test(currentPassword) },
    { label: "Có chữ thường", met: /[a-z]/.test(currentPassword) },
    { label: "Có số", met: /[0-9]/.test(currentPassword) },
    {
      label: "Có ký tự đặc biệt",
      met: /[^a-zA-Z0-9]/.test(currentPassword),
    },
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Đăng ký tài khoản</h1>
          <p className="auth-subtitle">Điền thông tin để tạo tài khoản mới</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(handleRegisterSubmit)}>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="username"
              type="text"
              className={`form-input ${errors.username ? "error" : ""}`}
              placeholder="john_doe"
              {...register("username")}
            />
            {errors.username && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="example@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Full Name (optional) */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="Nguyễn Văn A"
              {...register("fullName")}
            />
          </div>

          {/* Phone Number (optional) */}
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Số điện thoại
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className="form-input"
              placeholder="0901234567"
              {...register("phoneNumber")}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu <span style={{ color: "red" }}>*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          {currentPassword && (
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu <span style={{ color: "red" }}>*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Hidden roleId field - defaults to 2 (Buyer) */}
          <input
            type="hidden"
            {...register("roleId", { valueAsNumber: true })}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner" /> : "Đăng ký"}
          </button>

          {/* Divider */}
          <div className="divider">hoặc</div>

          {/* Google Login */}
          <GoogleButton onSuccess={handleGoogleLogin} disabled={isLoading} />

          {/* Login Link */}
          <p className="text-center">
            Đã có tài khoản?{" "}
            <Link to={ROUTES.LOGIN} className="auth-link">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
