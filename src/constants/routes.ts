export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Buyer routes
  BIKES: "/bikes",
  BIKE_DETAIL: "/bikes/:id",
  CART: "/cart",
  WISHLIST: "/wishlist",
  MY_ORDERS: "/my-orders",

  // Seller routes
  SELLER_DASHBOARD: "/seller/dashboard",
  SELLER_LISTINGS: "/seller/listings",
  SELLER_CREATE: "/seller/create-listing",
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
  SETTINGS: "/settings",
} as const;
