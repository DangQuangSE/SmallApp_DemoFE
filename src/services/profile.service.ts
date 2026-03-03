import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
  UserProfileDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from "../types/auth.types";

// Profile Service — only profile concerns
export const profileService = {
  getProfile: async (): Promise<UserProfileDto> => {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE.GET);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<UserProfileDto> => {
    const response = await apiClient.put(API_ENDPOINTS.PROFILE.UPDATE, data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<UserProfileDto> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(
      API_ENDPOINTS.PROFILE.UPLOAD_AVATAR,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  removeAvatar: async (): Promise<UserProfileDto> => {
    const response = await apiClient.delete(
      API_ENDPOINTS.PROFILE.REMOVE_AVATAR,
    );
    return response.data;
  },

  changePassword: async (
    data: ChangePasswordDto,
  ): Promise<{ message: string }> => {
    const response = await apiClient.put(
      API_ENDPOINTS.PROFILE.CHANGE_PASSWORD,
      data,
    );
    return response.data;
  },
};
