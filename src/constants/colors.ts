// constants/colors.ts

const COLORS = {
  // Primary - Màu chủ đạo (Đỏ đậm - chuyên nghiệp, năng động)
  primary: {
    main: "#C41E3A", // Đỏ burgundy - buttons, links, highlights
    light: "#E63946", // Đỏ sáng hơn - hover states
    dark: "#8B0000", // Đỏ đậm - pressed states
    50: "#FFE8EB", // Tint nhẹ nhất - backgrounds
    100: "#FFD1D6",
    500: "#C41E3A", // Main
    600: "#A01828",
    900: "#5A0D15",
  },

  // Secondary - Màu phụ (Đen - thanh lịch, chuyên nghiệp)
  secondary: {
    main: "#1A1A1A", // Đen gần như tuyệt đối
    light: "#2D2D2D", // Xám đen nhạt
    dark: "#000000", // Đen tuyệt đối
  },

  // Accent - Màu nhấn (Cam đỏ cho giá, promotions)
  accent: {
    price: "#FF4D4F", // Đỏ cam cho giá tiền
    sale: "#FF6B35", // Cam cho sale tags
    new: "#FF8C42", // Cam sáng cho "NEW" badge
  },

  // Neutral - Màu trung tính
  neutral: {
    white: "#FFFFFF",
    black: "#000000",
    gray: {
      50: "#F9FAFB", // Background nhẹ nhất
      100: "#F3F4F6", // Card backgrounds
      200: "#E5E7EB", // Borders
      300: "#D1D5DB", // Disabled states
      400: "#9CA3AF", // Placeholder text
      500: "#6B7280", // Secondary text
      600: "#4B5563", // Body text
      700: "#374151", // Headings
      800: "#1F2937", // Dark text
      900: "#111827", // Darkest text
    },
  },

  // Status Colors - Màu trạng thái
  status: {
    success: "#10B981", // Xanh lá - Giao dịch thành công
    warning: "#F59E0B", // Vàng - Cảnh báo, chờ xử lý
    error: "#EF4444", // Đỏ - Lỗi, từ chối
    info: "#3B82F6", // Xanh dương - Thông tin
    pending: "#F59E0B", // Đang chờ
    approved: "#10B981", // Đã duyệt
    rejected: "#EF4444", // Từ chối
    verified: "#8B5CF6", // Đã kiểm định - tím
  },

  // Role-specific Colors - Màu theo vai trò
  role: {
    buyer: "#3B82F6", // Xanh dương
    seller: "#10B981", // Xanh lá
    inspector: "#8B5CF6", // Tím
    admin: "#F59E0B", // Vàng cam
  },

  // UI Elements
  background: {
    primary: "#FFFFFF", // Nền chính
    secondary: "#F9FAFB", // Nền phụ (sections)
    dark: "#1A1A1A", // Dark mode background
    overlay: "rgba(0, 0, 0, 0.5)", // Modal overlay
  },

  border: {
    light: "#E5E7EB", // Border nhẹ
    medium: "#D1D5DB", // Border bình thường
    dark: "#9CA3AF", // Border đậm
    focus: "#C41E3A", // Border khi focus (primary)
  },

  text: {
    primary: "#1F2937", // Text chính (đen đậm)
    secondary: "#6B7280", // Text phụ (xám)
    disabled: "#9CA3AF", // Text disabled
    inverse: "#FFFFFF", // Text trên nền tối
    link: "#C41E3A", // Links
    price: "#FF4D4F", // Giá tiền
  },

  // Shadows
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  // Gradients
  gradient: {
    primary: "linear-gradient(135deg, #C41E3A 0%, #E63946 100%)",
    dark: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
    overlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
  },
};

export default COLORS;
