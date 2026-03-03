import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type { UserProfileDto, UpdateProfileDto } from "../types/auth.types";

export const userService = {
  getProfile: async (): Promise<UserProfileDto> => {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE.GET);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<UserProfileDto> => {
    const response = await apiClient.put(API_ENDPOINTS.PROFILE.UPDATE, data);
    return response.data;
  },
};
