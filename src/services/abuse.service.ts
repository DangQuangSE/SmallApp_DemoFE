import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
  CreateAbuseRequestDto,
  AbuseRequestDto,
} from "../types/abuse.types";

export const abuseService = {
  // Submit an abuse report (Buyer)
  submit: async (data: CreateAbuseRequestDto): Promise<AbuseRequestDto> => {
    const response = await apiClient.post(API_ENDPOINTS.ABUSE.SUBMIT, data);
    return response.data;
  },

  // Get my abuse requests (Buyer) — returns AbuseRequestDto[]
  getMyReports: async (): Promise<AbuseRequestDto[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ABUSE.MY_REPORTS);
    return response.data;
  },
};
