// ===== Bike form select options =====

export const BIKE_CONDITIONS = ["New", "Like New", "Used"] as const;

export const FRAME_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const FRAME_MATERIALS = [
  "Aluminum",
  "Carbon",
  "Steel",
  "Titanium",
  "Chromoly",
] as const;

export const WHEEL_SIZES = ["20", "24", "26", "27.5", "29", "700c"] as const;

export const BRAKE_TYPES = [
  "Disc",
  "V-Brake",
  "Rim",
  "Hydraulic Disc",
] as const;

// ===== Image upload constraints =====

export const MAX_IMAGES = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
