import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { authService, type AuthResultDto } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import { type LoginFormData } from "../../utils/validators";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: authLogin, googleLogin: authGoogleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response: AuthResultDto = await authService.login(
        data.email,
        data.password,
      );
      if (response.requiresEmailConfirmation) {
        // Email chưa xác nhận → redirect sang trang check-email
        toast.error(
          response.errorMessage ||
            "Vui lòng xác nhận email trước khi đăng nhập.",
        );
        navigate(ROUTES.VERIFY_EMAIL, {
          state: { email: data.email },
        });
      } else if (response.succeeded && response.user && response.token) {
        authLogin(response.user, response.token);
        toast.success("Đăng nhập thành công!");
        navigate(ROUTES.HOME);
      } else {
        toast.error(response.errorMessage || "Đăng nhập thất bại!");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập thất bại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setIsLoading(true);
    try {
      const response: AuthResultDto = await authService.googleLogin(credential);
      if (response.succeeded && response.user && response.token) {
        authGoogleLogin(response.user, response.token);
        toast.success("Đăng nhập Google thành công!");
        navigate(ROUTES.HOME);
      } else {
        toast.error(response.errorMessage || "Đăng nhập Google thất bại!");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập Google thất bại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
    handleGoogleLogin,
  };
};
