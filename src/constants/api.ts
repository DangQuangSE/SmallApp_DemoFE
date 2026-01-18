// API Configuration
// TODO: Update VITE_API_BASE_URL with actual backend URL when available

export const API_CONFIG = {
  // Base URL - will use environment variable or fallback to localhost
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",

  // Localhost for development
  LOCAL_URL: "http://localhost:5000/api",

  // Production URL (to be updated when backend is deployed)
  PRODUCTION_URL: "", // TODO: Add production backend URL here

  // Timeout
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // User endpoints
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile/update",
    CHANGE_PASSWORD: "/user/change-password",
    UPLOAD_AVATAR: "/user/avatar",
  },

  // Bike endpoints
  BIKES: {
    LIST: "/bikes",
    DETAIL: (id: string) => `/bikes/${id}`,
    CREATE: "/bikes",
    UPDATE: (id: string) => `/bikes/${id}`,
    DELETE: (id: string) => `/bikes/${id}`,
    SEARCH: "/bikes/search",
    FILTER: "/bikes/filter",
  },

  // Cart endpoints
  CART: {
    GET: "/cart",
    ADD: "/cart/add",
    UPDATE: (itemId: string) => `/cart/${itemId}`,
    REMOVE: (itemId: string) => `/cart/${itemId}`,
    CLEAR: "/cart/clear",
  },

  // Wishlist endpoints
  WISHLIST: {
    GET: "/wishlist",
    ADD: "/wishlist/add",
    REMOVE: (itemId: string) => `/wishlist/${itemId}`,
  },

  // Order endpoints
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },

  // Seller endpoints
  SELLER: {
    DASHBOARD: "/seller/dashboard",
    BIKES: "/seller/bikes",
    ORDERS: "/seller/orders",
    STATISTICS: "/seller/statistics",
  },

  // Inspector endpoints
  INSPECTOR: {
    DASHBOARD: "/inspector/dashboard",
    INSPECTIONS: "/inspector/inspections",
    DETAIL: (id: string) => `/inspector/inspections/${id}`,
    SUBMIT_REPORT: (id: string) => `/inspector/inspections/${id}/report`,
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    BIKES: "/admin/bikes",
    ORDERS: "/admin/orders",
    STATISTICS: "/admin/statistics",
  },
};

// Helper function to get full URL
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
