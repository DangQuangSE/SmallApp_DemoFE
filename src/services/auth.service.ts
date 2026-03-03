import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../constants/api";
import { handleApiError } from "../utils/api-error";

// ===== DTOs =====
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  roleId: number; // 1=Admin, 2=Buyer, 3=Seller, 4=Inspector
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResultDto {
  succeeded: boolean;
  token?: string;
  user?: UserProfileDto;
  errorMessage?: string;
  requiresEmailConfirmation: boolean;
}

export interface UserProfileDto {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  address?: string;
  roleName: string;
  status?: number; // 0=Banned, 1=Active
  isVerified?: boolean;
  createdAt?: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  address?: string;
}

// Axios instance
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = handleApiError(error);
    return Promise.reject(new Error(message));
  },
);

// Auth Service
export const authService = {
  // Register
  register: async (data: RegisterDto): Promise<AuthResultDto> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );
    return response.data;
  },

  // Login
  login: async (email: string, password: string): Promise<AuthResultDto> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (idToken: string): Promise<AuthResultDto> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      idToken,
    });
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfileDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileDto): Promise<UserProfileDto> => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data,
    );
    return response.data;
  },

  // Confirm email with OTP
  confirmEmail: async (
    email: string,
    otp: string,
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.CONFIRM_EMAIL,
      { email, otp },
    );
    return response.data;
  },

  // Resend confirmation email
  resendConfirmation: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.RESEND_CONFIRMATION,
      { email },
    );
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  // Get current user from local storage
  getCurrentUser: (): UserProfileDto | null => {
    const userStr = localStorage.getItem("user");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  },

  // Save user data
  saveUserData: (user: UserProfileDto, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", token);
  },
};
