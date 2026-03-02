import { type FC } from "react";

import { useRegister } from "../../hooks/auth/useRegister";
import EmailStep from "../../components/features/auth/register-steps/EmailStep";
import OTPStep from "../../components/features/auth/register-steps/OTPStep";
import PasswordStep from "../../components/features/auth/register-steps/PasswordStep";
import "../../components/features/auth/auth.css";

const Register: FC = () => {
  const {
    step,
    setStep,
    isLoading,
    resendCooldown,
    emailForm,
    otpForm,
    passwordForm,
    handleEmailSubmit,
    handleOTPSubmit,
    handlePasswordSubmit,
    handleResendOTP,
    handleGoogleLogin,
  } = useRegister();

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
          <EmailStep
            form={emailForm}
            onSubmit={handleEmailSubmit}
            onGoogleLogin={handleGoogleLogin}
            isLoading={isLoading}
          />
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <OTPStep
            form={otpForm}
            onSubmit={handleOTPSubmit}
            onResendOTP={handleResendOTP}
            onBack={() => setStep("email")}
            resendCooldown={resendCooldown}
            isLoading={isLoading}
          />
        )}

        {/* Step 3: Password Setup */}
        {step === "password" && (
          <PasswordStep
            form={passwordForm}
            onSubmit={handlePasswordSubmit}
            onBack={() => setStep("otp")}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Register;
