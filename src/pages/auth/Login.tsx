import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import { loginSchema, type LoginFormData } from "../../utils/validators";
import { useLogin } from "../../hooks/auth/useLogin";
import GoogleButton from "../../components/features/auth/GoogleButton";
import { ROUTES } from "../../constants/routes";
import "../../components/features/auth/auth.css";

const Login: FC = () => {
  const { isLoading, handleLogin, handleGoogleLogin } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const successMessage = (location.state as { message?: string })?.message;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Đăng nhập</h1>
        </div>

        {/* Success message from email verification */}
        {successMessage && (
          <div
            className="verify-message success"
            style={{ marginBottom: "1.5rem" }}
          >
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={form.handleSubmit(handleLogin)}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${form.formState.errors.email ? "error" : ""}`}
              placeholder="example@email.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${form.formState.errors.password ? "error" : ""}`}
                placeholder="••••••••"
                {...form.register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} />
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner" /> : "Đăng nhập"}
          </button>

          {/* Divider */}
          <div className="divider">hoặc</div>

          {/* Google Login */}
          <GoogleButton onSuccess={handleGoogleLogin} disabled={isLoading} />

          {/* Register Link */}
          <p className="text-center">
            Chưa có tài khoản?{" "}
            <Link to={ROUTES.REGISTER} className="auth-link">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
