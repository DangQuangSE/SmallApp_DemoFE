import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    return data?.message || error.message || "Đã xảy ra lỗi không xác định";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "Đã xảy ra lỗi không xác định";
};

export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 422;
  }
  return false;
};
