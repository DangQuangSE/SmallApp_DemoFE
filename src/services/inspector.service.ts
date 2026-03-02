import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import { Bike } from "./bike.service";

export interface InspectionRequest {
  id: string;
  bikeId: string;
  bike: Bike;
  sellerId: string;
  status: "pending" | "in_progress" | "approved" | "rejected";
  requestedAt: string;
  scheduledAt?: string;
  inspectorId?: string;
  report?: InspectionReport;
}

export interface InspectionReport {
  overallCondition: "excellent" | "good" | "fair" | "poor";
  frameStatus: string;
  wheelsStatus: string;
  brakesStatus: string;
  drivetrainStatus: string;
  notes: string;
  images: string[];
}

export const inspectorService = {
  // Get inspector dashboard overview
  getDashboard: async (): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.INSPECTOR.DASHBOARD);
    return response.data;
  },

  // Get list of assigned inspection requests
  getInspections: async (status?: string): Promise<InspectionRequest[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.INSPECTOR.INSPECTIONS, {
      params: { status },
    });
    return response.data;
  },

  // Get details of a specific inspection request
  getInspectionDetail: async (id: string): Promise<InspectionRequest> => {
    const response = await axiosInstance.get(API_ENDPOINTS.INSPECTOR.DETAIL(id));
    return response.data;
  },

  // Submit an inspection report for a bike
  submitReport: async (id: string, reportData: InspectionReport, decision: "approve" | "reject"): Promise<InspectionRequest> => {
    const response = await axiosInstance.post(API_ENDPOINTS.INSPECTOR.SUBMIT_REPORT(id), {
      report: reportData,
      decision,
    });
    return response.data;
  },
};
