import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { authService } from "../../services/auth.service";
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
      const response = await authService.login(data.email, data.password);
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
      authLogin(responseData.user, responseData.token);
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

  const handleGoogleLogin = async (credential: string) => {
    setIsLoading(true);
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
