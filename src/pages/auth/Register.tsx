import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import {
  emailSchema,
  otpSchema,
  passwordSchema,
  type EmailFormData,
  type OTPFormData,
  type PasswordFormData,
} from "../../utils/validators";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import OTPInput from "../../components/features/auth/OTPInput";
import GoogleButton from "../../components/features/auth/GoogleButton";
import { ROUTES } from "../../constants/routes";
import "../../components/features/auth/auth.css";

type RegisterStep = "email" | "otp" | "password";

const Register: FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, googleLogin } = useAuth();
  const [step, setStep] = useState<RegisterStep>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Form for email step
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Form for OTP step
  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Form for password step
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Step 1: Send OTP to email
  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await authService.sendOTP(data.email);
      setEmail(data.email);
      setStep("otp");
      toast.success("OTP đã được gửi đến email của bạn!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gửi OTP thất bại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      await authService.verifyOTP(email, data.otp);
      setStep("password");
      toast.success("Xác minh OTP thành công!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "OTP không hợp lệ!";
      toast.error(message);
      otpForm.reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set password and complete registration
  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(
        email,
        data.password,
        "mock-otp-token",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response as any;
      registerUser(responseData.user, responseData.token);
      toast.success("Đăng ký thành công!");
      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Đăng ký thất bại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      await authService.sendOTP(email);
      toast.success("OTP mới đã được gửi!");
      setResendCooldown(60);

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gửi lại OTP thất bại!";
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

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    const requirements = [
      { label: "Ít nhất 8 ký tự", met: password.length >= 8 },
      { label: "Có chữ hoa", met: /[A-Z]/.test(password) },
      { label: "Có chữ thường", met: /[a-z]/.test(password) },
      { label: "Có số", met: /[0-9]/.test(password) },
    ];
    return requirements;
  };

  const currentPassword = passwordForm.watch("password") || "";
  const passwordRequirements = getPasswordStrength(currentPassword);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Đăng ký tài khoản</h1>
          <p className="auth-subtitle">
            {step === "email" && "Nhập email để bắt đầu"}
            {step === "otp" && "Nhập mã OTP đã gửi đến email"}
            {step === "password" && "Tạo mật khẩu cho tài khoản"}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === "email" && (
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${emailForm.formState.errors.email ? "error" : ""}`}
                placeholder="example@email.com"
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <p className="error-message">
                  <FontAwesomeIcon icon={faCircleXmark} />
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : "Tiếp theo"}
            </button>

            <div className="divider">hoặc</div>

            <GoogleButton onClick={handleGoogleLogin} disabled={isLoading} />

            <p className="text-center">
              Đã có tài khoản?{" "}
              <Link to={ROUTES.LOGIN} className="auth-link">
                Đăng nhập
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)}>
            <div className="otp-input-container">
              <OTPInput
                length={6}
                onComplete={(value: string) => otpForm.setValue("otp", value)}
                hasError={!!otpForm.formState.errors.otp}
              />
              {otpForm.formState.errors.otp && (
                <p className="error-message">
                  <FontAwesomeIcon icon={faCircleXmark} />
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : "Xác minh"}
            </button>

            <div className="resend-otp">
              Không nhận được mã?{" "}
              <button
                type="button"
                className="resend-button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isLoading}
              >
                {resendCooldown > 0
                  ? `Gửi lại (${resendCooldown}s)`
                  : "Gửi lại"}
              </button>
            </div>

            <p className="text-center">
              <button
                type="button"
                className="back-button"
                onClick={() => setStep("email")}
                aria-label="Quay lại bước nhập email"
              >
                ← Quay lại
              </button>
            </p>
          </form>
        )}

        {/* Step 3: Password Setup */}
        {step === "password" && (
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${passwordForm.formState.errors.password ? "error" : ""}`}
                  placeholder="••••••••"
                  {...passwordForm.register("password")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {passwordForm.formState.errors.password && (
                <p className="error-message">
                  <FontAwesomeIcon icon={faCircleXmark} />
                  {passwordForm.formState.errors.password.message}
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Xác nhận mật khẩu
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-input ${passwordForm.formState.errors.confirmPassword ? "error" : ""}`}
                  placeholder="••••••••"
                  {...passwordForm.register("confirmPassword")}
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
              {passwordForm.formState.errors.confirmPassword && (
                <p className="error-message">
                  <FontAwesomeIcon icon={faCircleXmark} />
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : "Hoàn tất đăng ký"}
            </button>

            <p className="text-center">
              <button
                type="button"
                className="back-button"
                onClick={() => setStep("otp")}
                aria-label="Quay lại bước xác minh OTP"
              >
                ← Quay lại
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
