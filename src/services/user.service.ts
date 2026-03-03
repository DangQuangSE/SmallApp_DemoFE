import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import type { UserProfileDto, UpdateProfileDto } from "./auth.service";

export const userService = {
  // Get user profile (via auth endpoint)
  getProfile: async (): Promise<UserProfileDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  // Update user profile (via auth endpoint)
  updateProfile: async (data: UpdateProfileDto): Promise<UserProfileDto> => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data,
    );
    return response.data;
  },
};
