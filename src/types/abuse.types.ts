// ===== Request DTOs =====

export interface CreateAbuseRequestDto {
  reportedUserId: number;
  listingId?: number;
  orderId?: number;
  reason: string;
  description: string;
}

export interface ResolveAbuseRequestDto {
  reportId: number;
  resolution: string;
  banUser: boolean;
}

// ===== Response DTOs =====

export interface AbuseReportDto {
  reportId: number;
  reporterName: string;
  reportedUserName: string;
  reportedUserId: number;
  listingId?: number;
  listingTitle?: string;
  orderId?: number;
  reason: string;
  description: string;
  status: number; // 1=Pending, 2=Resolved, 3=Rejected
  resolution?: string;
  createdAt?: string;
  resolvedAt?: string;
}

// ===== Status constants =====
export const ABUSE_STATUS = {
  PENDING: 1,
  RESOLVED: 2,
  REJECTED: 3,
} as const;

export const ABUSE_STATUS_LABELS: Record<number, string> = {
  [ABUSE_STATUS.PENDING]: "Đang chờ",
  [ABUSE_STATUS.RESOLVED]: "Đã xử lý",
  [ABUSE_STATUS.REJECTED]: "Đã từ chối",
};
