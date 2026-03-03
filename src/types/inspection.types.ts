// ===== Request DTOs =====

export interface CreateInspectionRequestDto {
  listingId: number;
  note?: string;
}

export interface UploadInspectionReportDto {
  requestId: number;
  frameCheck?: string;
  brakeCheck?: string;
  transmissionCheck?: string;
  inspectorNote?: string;
  finalVerdict?: number; // 1=Pass, 2=Fail, 3=Conditional
  reportUrl?: string;
}

// ===== Response DTOs =====

export interface InspectionRequestDto {
  requestId: number;
  listingId: number;
  listingTitle: string;
  sellerId: number;
  sellerName: string;
  inspectorId?: number;
  inspectorName?: string;
  requestStatus?: number;
  requestStatusLabel: string;
  requestDate?: string;
  hasReport: boolean;
}

export interface InspectionReportDto {
  reportId: number;
  requestId: number;
  listingId: number;
  listingTitle: string;
  requestStatus?: number;
  requestStatusLabel: string;
  frameCheck?: string;
  brakeCheck?: string;
  transmissionCheck?: string;
  inspectorNote?: string;
  finalVerdict?: number;
  finalVerdictLabel: string;
  reportUrl?: string;
  completedAt?: string;
  inspectorName: string;
  bikeTitle: string;
}

// ===== Status constants =====

export const REQUEST_STATUS = {
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

export const REQUEST_STATUS_LABELS: Record<number, string> = {
  [REQUEST_STATUS.PENDING]: "Đang chờ",
  [REQUEST_STATUS.IN_PROGRESS]: "Đang kiểm định",
  [REQUEST_STATUS.COMPLETED]: "Hoàn thành",
  [REQUEST_STATUS.CANCELLED]: "Đã hủy",
};

export const FINAL_VERDICT = {
  PASS: 1,
  FAIL: 2,
  CONDITIONAL: 3,
} as const;

export const FINAL_VERDICT_LABELS: Record<number, string> = {
  [FINAL_VERDICT.PASS]: "Đạt",
  [FINAL_VERDICT.FAIL]: "Không đạt",
  [FINAL_VERDICT.CONDITIONAL]: "Đạt có điều kiện",
};
