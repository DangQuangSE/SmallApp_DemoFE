import axios from "axios";
import { API_CONFIG } from "../constants/api";
import { handleApiError } from "../utils/api-error";

// Shared Axios instance — used by all services
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = handleApiError(error);
    return Promise.reject(new Error(message));
  },
);
