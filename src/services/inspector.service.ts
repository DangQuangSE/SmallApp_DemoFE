import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";

// ===== DTOs =====
export interface CreateInspectionDto {
  listingId: number;
  frameCheck?: string;
  brakeCheck?: string;
  transmissionCheck?: string;
  inspectorNote?: string;
  finalVerdict?: number; // byte
  reportUrl?: string;
}

export interface InspectionReportDto {
  reportId: number;
  requestId: number;
  requestStatus?: number; // 1=Pending, 2=In Progress, 3=Completed
  frameCheck?: string;
  brakeCheck?: string;
  transmissionCheck?: string;
  inspectorNote?: string;
  finalVerdict?: number;
  reportUrl?: string;
  completedAt?: string;
  inspectorName: string;
  bikeTitle: string;
}

export const inspectorService = {
  // Create inspection (auth)
  createInspection: async (
    data: CreateInspectionDto,
  ): Promise<InspectionReportDto> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.INSPECTIONS.CREATE,
      data,
    );
    return response.data;
  },

  // Get inspection by listing (public)
  getByListing: async (listingId: number): Promise<InspectionReportDto> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.INSPECTIONS.BY_LISTING(listingId),
    );
    return response.data;
  },

  // Get my reports (auth)
  getMyReports: async (): Promise<InspectionReportDto[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.INSPECTIONS.MY_REPORTS,
    );
    return response.data;
  },

  // Complete inspection (auth)
  completeInspection: async (reportId: number): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.INSPECTIONS.COMPLETE(reportId));
  },
};
