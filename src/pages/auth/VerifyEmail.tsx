import { useState, type FC } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import OTPInput from "../../components/features/auth/OTPInput";
import { authService } from "../../services/auth.service";
import { ROUTES } from "../../constants/routes";
import "../../components/features/auth/auth.css";

const VerifyEmail: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleOtpComplete = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleVerify = async () => {
    if (!email || otp.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      await authService.confirmEmail(email, otp);
      // Success → redirect to login with success message
      navigate(ROUTES.LOGIN, {
        state: { message: "Email đã xác nhận thành công! Vui lòng đăng nhập." },
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Xác nhận thất bại";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || !email) return;

    setResendMessage("");
    setError("");

    try {
      await authService.resendConfirmation(email);
      setResendMessage("Mã xác nhận mới đã được gửi!");
      setResendCountdown(60);

      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Không thể gửi lại mã";
      setError(errMsg);
    }
  };

  // If no email in state, show error
  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="verify-icon error">
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>
          <h1 className="auth-title">Không tìm thấy email</h1>
          <p className="verify-description">
            Vui lòng đăng ký lại để nhận mã xác nhận.
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="btn btn-primary"
            style={{ display: "block", textDecoration: "none" }}
          >
            Quay lại Đăng ký
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        {/* Icon */}
        <div className="verify-icon">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>

        {/* Title */}
        <h1 className="auth-title">Xác nhận Email</h1>

        {/* Description */}
        <p className="verify-description">
          Chúng tôi đã gửi mã xác nhận 6 chữ số đến:
          <br />
          <strong className="verify-email-highlight">{email}</strong>
        </p>

        {/* OTP Input */}
        <div className="verify-otp-section">
          <OTPInput
            length={6}
            onComplete={handleOtpComplete}
            hasError={!!error}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="verify-message error">
            <FontAwesomeIcon icon={faCircleXmark} />
            <span>{error}</span>
          </div>
        )}

        {/* Success message (resend) */}
        {resendMessage && (
          <div className="verify-message success">
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>{resendMessage}</span>
          </div>
        )}

        {/* Verify Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleVerify}
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? <span className="spinner" /> : "Xác nhận Email"}
        </button>

        {/* Expiry notice */}
        <p className="verify-expiry">Mã xác nhận hết hạn sau 10 phút.</p>

        {/* Resend */}
        <div className="verify-resend">
          <span className="verify-resend-label">Không nhận được mã?</span>
          <button
            type="button"
            className="verify-resend-btn"
            onClick={handleResend}
            disabled={resendCountdown > 0}
          >
            {resendCountdown > 0
              ? `Gửi lại (${resendCountdown}s)`
              : "Gửi lại mã"}
          </button>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Back to login */}
        <Link to={ROUTES.LOGIN} className="auth-link verify-back-link">
          ← Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
