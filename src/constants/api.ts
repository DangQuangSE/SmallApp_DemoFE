// API Configuration
// TODO: Update VITE_API_BASE_URL with actual backend URL when available

export const API_CONFIG = {
  // Base URL - will use environment variable or fallback to localhost
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7258/api",

  // Localhost for development
  LOCAL_URL: "https://localhost:7258/api",

  // Production URL (to be updated when backend is deployed)
  PRODUCTION_URL: "", // TODO: Add production backend URL here

  // Timeout
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google",
    LOGOUT: "/auth/logout",
    CONFIRM_EMAIL: "/auth/confirm-email",
    RESEND_CONFIRMATION: "/auth/resend-confirmation",
  },

  // Profile endpoints
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    UPLOAD_AVATAR: "/profile/avatar",
    REMOVE_AVATAR: "/profile/avatar",
    CHANGE_PASSWORD: "/profile/change-password",
  },

  // Bike endpoints
  BIKES: {
    LIST: "/bikes",
    DETAIL: (id: number) => `/bikes/${id}`,
    CREATE: "/bikes",
    UPDATE: "/bikes",
    DELETE: (id: number) => `/bikes/${id}`,
    VISIBILITY: (id: number) => `/bikes/${id}/visibility`,
    MY_POSTS: "/bikes/my-posts",
    BRANDS: "/bikes/brands",
    TYPES: "/bikes/types",
  },

  // Wishlist endpoints
  WISHLIST: {
    GET: "/wishlist",
    ADD: (listingId: number) => `/wishlist/${listingId}`,
    REMOVE: (listingId: number) => `/wishlist/${listingId}`,
    CHECK: (listingId: number) => `/wishlist/${listingId}/check`,
  },

  // Cart endpoints
  CART: {
    GET: "/cart",
    ADD: (listingId: number) => `/cart/${listingId}`,
    REMOVE: (listingId: number) => `/cart/${listingId}`,
    CLEAR: "/cart",
    CHECK: (listingId: number) => `/cart/${listingId}/check`,
    COUNT: "/cart/count",
  },

  // Order endpoints
  ORDERS: {
    CREATE: "/orders",
    DETAIL: (id: number) => `/orders/${id}`,
    MY_PURCHASES: "/orders/my-purchases",
    CANCEL: (id: number) => `/orders/${id}/cancel`,
    CONFIRM_DELIVERY: (id: number) => `/orders/${id}/confirm-delivery`,
    CREATE_PAYMENT_URL: "/orders/create-payment-url",
  },

  // Message endpoints
  MESSAGES: {
    SEND: "/messages",
    CONVERSATIONS: "/messages/conversations",
    CONVERSATION_DETAIL: (otherUserId: number) =>
      `/messages/conversations/${otherUserId}`,
    MARK_READ: (otherUserId: number) =>
      `/messages/conversations/${otherUserId}/read`,
    UNREAD_COUNT: "/messages/unread-count",
  },

  // Rating endpoints
  RATINGS: {
    CREATE: "/ratings",
    BY_SELLER: (sellerId: number) => `/ratings/seller/${sellerId}`,
    SELLER_STATS: (sellerId: number) => `/ratings/seller/${sellerId}/stats`,
    CHECK: (orderId: number) => `/ratings/order/${orderId}/check`,
  },

  // Inspection endpoints
  INSPECTIONS: {
    CREATE: "/inspections",
    BY_LISTING: (listingId: number) => `/inspections/listing/${listingId}`,
    MY_REPORTS: "/inspections/my-reports",
    COMPLETE: (reportId: number) => `/inspections/${reportId}/complete`,
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PENDING_POSTS: "/admin/posts/pending",
    MODERATE_POST: "/admin/posts/moderate",
    USERS: "/admin/users",
    USER_STATUS: (userId: number) => `/admin/users/${userId}/status`,
    RESOLVE_DISPUTE: "/admin/disputes/resolve",
  },
};

// Helper function to get full URL
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
