/** Format number as Vietnamese Dong currency */
export const formatVND = (amount?: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);

/** Format ISO date string to Vietnamese locale */
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** Format ISO date string with time */
export const formatDateTime = (dateStr?: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
