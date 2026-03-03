import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
  CreateInspectionRequestDto,
  InspectionRequestDto,
  UploadInspectionReportDto,
  InspectionReportDto,
} from "../types/inspection.types";

export const inspectionService = {
  // ===== Seller =====

  // Create inspection request
  createRequest: async (
    data: CreateInspectionRequestDto,
  ): Promise<InspectionRequestDto> => {
    const response = await apiClient.post(
      API_ENDPOINTS.INSPECTIONS.CREATE_REQUEST,
      data,
    );
    return response.data;
  },

  // Get my requests (seller)
  getMyRequests: async (): Promise<InspectionRequestDto[]> => {
    const response = await apiClient.get(API_ENDPOINTS.INSPECTIONS.MY_REQUESTS);
    return response.data;
  },

  // Cancel request (seller, only Pending)
  cancelRequest: async (requestId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.INSPECTIONS.CANCEL_REQUEST(requestId));
  },

  // ===== Inspector =====

  // Get pending requests
  getPendingRequests: async (): Promise<InspectionRequestDto[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.INSPECTIONS.PENDING_REQUESTS,
    );
    return response.data;
  },

  // Get assigned requests
  getAssignedRequests: async (): Promise<InspectionRequestDto[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.INSPECTIONS.ASSIGNED_REQUESTS,
    );
    return response.data;
  },

  // Accept request
  acceptRequest: async (requestId: number): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.INSPECTIONS.ACCEPT_REQUEST(requestId));
  },

  // Upload report
  uploadReport: async (
    data: UploadInspectionReportDto,
  ): Promise<InspectionReportDto> => {
    const response = await apiClient.post(
      API_ENDPOINTS.INSPECTIONS.UPLOAD_REPORT,
      data,
    );
    return response.data;
  },

  // Get my reports (inspector)
  getMyReports: async (): Promise<InspectionReportDto[]> => {
    const response = await apiClient.get(API_ENDPOINTS.INSPECTIONS.MY_REPORTS);
    return response.data;
  },

  // ===== Public =====

  // Get report by listing
  getByListing: async (listingId: number): Promise<InspectionReportDto> => {
    const response = await apiClient.get(
      API_ENDPOINTS.INSPECTIONS.BY_LISTING(listingId),
    );
    return response.data;
  },

  // Get report by requestId
  getByRequestId: async (requestId: number): Promise<InspectionReportDto> => {
    const response = await apiClient.get(
      API_ENDPOINTS.INSPECTIONS.BY_REQUEST(requestId),
    );
    return response.data;
  },
};
