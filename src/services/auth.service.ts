import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../constants/api";

import { handleApiError } from "../utils/api-error";

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
  }
);

// Auth Service
export const authService = {
  // Send OTP to email
  sendOTP: async (email: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SEND_OTP, { email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
    return response.data;
  },

  // Complete registration with password
  register: async (email: string, password: string, otpToken: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      otpToken,
    });
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (googleToken: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { token: googleToken });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (password: string, resetToken: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      password,
      token: resetToken,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      token: refreshToken,
    });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  // Get current user from local storage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  },

  // Save user data
  saveUserData: (
    user: { id: string; email: string; name: string; role: string },
    token: string,
  ) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", token);
  },
};
