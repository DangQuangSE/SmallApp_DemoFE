import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
  CreateAbuseRequestDto,
  AbuseReportDto,
} from "../types/abuse.types";

export const abuseService = {
  // Submit an abuse report (Buyer)
  submit: async (data: CreateAbuseRequestDto): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ABUSE.SUBMIT, data);
  },

  // Get my abuse reports (Buyer)
  getMyReports: async (): Promise<AbuseReportDto[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ABUSE.MY_REPORTS);
    return response.data;
  },
};
