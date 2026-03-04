// ===== Request DTOs (match BE exactly) =====

export interface CreateAbuseRequestDto {
  targetListingId?: number;
  targetUserId?: number;
  reason: string;
}

export interface ResolveAbuseRequestDto {
  requestAbuseId: number;
  resolution: string;
  status: number; // 2=Resolved, 3=Rejected
  banTargetUser: boolean;
  hideTargetListing: boolean;
}

// ===== Response DTOs (match BE exactly) =====

export interface AbuseRequestDto {
  requestAbuseId: number;
  reporterId: number;
  reporterName: string;
  targetListingId?: number;
  targetListingTitle?: string;
  targetUserId?: number;
  targetUserName?: string;
  reason: string;
  createdAt?: string;
  isResolved: boolean;
}

export interface AbuseReportDto {
  reportAbuseId: number;
  requestAbuseId: number;
  adminName: string;
  resolution?: string;
  status?: number; // 2=Resolved, 3=Rejected
  resolvedAt?: string;
  request: AbuseRequestDto;
}

// ===== Status constants =====
export const ABUSE_STATUS = {
  PENDING: 1,
  RESOLVED: 2,
  REJECTED: 3,
} as const;

export const ABUSE_STATUS_LABELS: Record<number, string> = {
  [ABUSE_STATUS.PENDING]: "Pending",
  [ABUSE_STATUS.RESOLVED]: "Resolved",
  [ABUSE_STATUS.REJECTED]: "Rejected",
};
