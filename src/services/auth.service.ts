import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
  RegisterDto,
  AuthResultDto,
  UserProfileDto,
} from "../types/auth.types";

// Re-export types for backward compatibility
export type {
  RegisterDto,
  LoginDto,
  AuthResultDto,
  UserProfileDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from "../types/auth.types";

// Re-export apiClient as axiosInstance for backward compatibility
export { apiClient as axiosInstance } from "./api.client";

// Auth Service — only authentication concerns
export const authService = {
  register: async (data: RegisterDto): Promise<AuthResultDto> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResultDto> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  googleLogin: async (idToken: string): Promise<AuthResultDto> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      idToken,
    });
    return response.data;
  },

  confirmEmail: async (
    email: string,
    otp: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CONFIRM_EMAIL, {
      email,
      otp,
    });
    return response.data;
  },

  resendConfirmation: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.RESEND_CONFIRMATION,
      { email },
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): UserProfileDto | null => {
    const userStr = localStorage.getItem("user");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  },

  saveUserData: (user: UserProfileDto, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", token);
  },
};
