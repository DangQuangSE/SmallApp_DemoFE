import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { registerSchema, type RegisterFormData } from "../../utils/validators";
import {
  authService,
  type AuthResultDto,
  type RegisterDto,
} from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";

export const useRegister = () => {
  const navigate = useNavigate();
  const { register: registerUser, googleLogin: authGoogleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roleId: 2, // Default: Buyer
    },
  });

  // Submit registration
  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const registerData: RegisterDto = {
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName || undefined,
        phoneNumber: data.phoneNumber || undefined,
        roleId: data.roleId,
      };
      const response: AuthResultDto = await authService.register(registerData);
      if (response.requiresEmailConfirmation) {
        // KHÔNG lưu token (token = null)
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email.");
        navigate(ROUTES.VERIFY_EMAIL, {
          state: { email: data.email },
        });
      } else if (response.succeeded && response.user && response.token) {
        registerUser(response.user, response.token);
        toast.success("Đăng ký thành công!");
        navigate(ROUTES.HOME);
      } else {
        toast.error(response.errorMessage || "Đăng ký thất bại!");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Đăng ký thất bại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
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
    }
  };

  return {
    isLoading,
    registerForm,
    handleRegisterSubmit,
    handleGoogleLogin,
  };
};
