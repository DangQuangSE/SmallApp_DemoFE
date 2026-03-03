export const ROUTES = {
  // Public routes
  HOME: "/",
  STORE: "/store",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",

  // Buyer routes
  BIKES: "/bikes",
  BIKE_DETAIL: "/bikes/:id",
  CART: "/cart",
  WISHLIST: "/wishlist",
  MY_ORDERS: "/my-orders",

  // Seller routes
  SELLER_DASHBOARD: "/seller/dashboard",
  SELLER_LISTINGS: "/seller/posts",
  SELLER_CREATE: "/seller/posts/create",
  SELLER_EDIT: "/seller/posts/:id/edit",
  SELLER_ORDERS: "/seller/orders",

  // Inspector routes
  INSPECTOR_DASHBOARD: "/inspector/dashboard",
  INSPECTOR_REQUESTS: "/inspector/requests",

  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_LISTINGS: "/admin/listings",

  // Shared
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_CHANGE_PASSWORD: "/profile/change-password",
  SETTINGS: "/settings",
} as const;
