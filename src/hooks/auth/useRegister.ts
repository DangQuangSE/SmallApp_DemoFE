import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ROUTES } from "../../constants/routes";

export type RegisterStep = "email" | "otp" | "password";

export const useRegister = () => {
  const navigate = useNavigate();
  const { register: registerUser, googleLogin: authGoogleLogin } = useAuth();
  const [step, setStep] = useState<RegisterStep>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Step 1: Send OTP
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

  // Step 3: Complete registration
  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(
        email,
        data.password,
        "mock-otp-token",
      );
      const responseData = response as {
        user: {
          id: string;
          email: string;
          fullName: string;
          role: string;
          avatarUrl?: string;
        };
        token: string;
      };
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

  // Resend OTP logic
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

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await authService.googleLogin(credential);
      const responseData = response as {
        user: {
          id: string;
          email: string;
          fullName: string;
          role: string;
          avatarUrl?: string;
        };
        token: string;
      };
      authGoogleLogin(responseData.user, responseData.token);
      toast.success("Đăng nhập Google thành công!");
      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập Google thất bại!";
      toast.error(message);
    }
  };

  return {
    step,
    setStep,
    email,
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
  };
};
