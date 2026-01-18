import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../constants/api";

// Axios instance
const axiosInstance = axios.create({
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

// Auth Service
export const authService = {
  // Send OTP to email
  sendOTP: async (email: string) => {
    // TODO: Replace with real API call
    // const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SEND_OTP, { email });
    // return response.data;

    // Mock response for now
    console.log("Sending OTP to:", email);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "OTP đã được gửi đến email của bạn",
        });
      }, 1000);
    });
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string) => {
    // TODO: Replace with real API call
    // const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
    // return response.data;

    // Mock response for now
    console.log("Verifying OTP:", { email, otp });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock: accept OTP "123456"
        if (otp === "123456") {
          resolve({ success: true, token: "temp-token-12345" });
        } else {
          reject({ message: "OTP không chính xác" });
        }
      }, 1000);
    });
  },

  // Complete registration with password
  register: async (email: string, password: string, otpToken: string) => {
    // TODO: Replace with real API call
    // const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
    //   email,
    //   password,
    //   otpToken,
    // });
    // return response.data;

    // Mock response for now
    console.log("Registering user:", { email, password: "***", otpToken });
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: "1",
          email,
          name: "User",
          role: "buyer",
        };
        const mockToken = "mock-access-token-" + Date.now();

        resolve({
          success: true,
          user: mockUser,
          accessToken: mockToken,
        });
      }, 1000);
    });
  },

  // Login
  login: async (email: string, password: string) => {
    // TODO: Replace with real API call
    // const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    // return response.data;

    // Mock response for now
    console.log("Logging in:", { email, password: "***" });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock: accept any email with password "12345678"
        if (password === "12345678") {
          const mockUser = {
            id: "1",
            email,
            name: "User",
            role: "buyer",
          };
          const mockToken = "mock-access-token-" + Date.now();

          resolve({
            success: true,
            user: mockUser,
            accessToken: mockToken,
          });
        } else {
          reject({ message: "Email hoặc mật khẩu không chính xác" });
        }
      }, 1000);
    });
  },

  // Google OAuth login
  googleLogin: async (googleToken: string) => {
    // TODO: Replace with real API call
    // const response = await axiosInstance.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { token: googleToken });
    // return response.data;

    // Mock response for now
    console.log("Google login with token:", googleToken);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: "2",
          email: "user@gmail.com",
          name: "Google User",
          role: "buyer",
        };
        const mockToken = "mock-google-token-" + Date.now();

        resolve({
          success: true,
          user: mockUser,
          accessToken: mockToken,
        });
      }, 1000);
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
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
