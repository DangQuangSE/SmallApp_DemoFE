import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import { loginSchema, type LoginFormData } from "../../utils/validators";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import GoogleButton from "../../components/features/auth/GoogleButton";
import { ROUTES } from "../../constants/routes";
import "../../components/features/auth/auth.css";

const Login: FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Login with email and password
  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response as any;
      login(responseData.user, responseData.token);
      toast.success("Đăng nhập thành công!");
      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập thất bại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google OAuth flow
      const mockCredential = "mock-google-credential";
      const response = await authService.googleLogin(mockCredential);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response as any;
      googleLogin(responseData.user, responseData.token);
      toast.success("Đăng nhập Google thành công!");
      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập Google thất bại!";
      toast.error(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Đăng nhập</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
          <GoogleButton onClick={handleGoogleLogin} disabled={isLoading} />

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
