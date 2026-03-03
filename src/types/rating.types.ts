// ===== Request DTOs =====

export interface CreateRatingDto {
  orderId: number;
  rating?: number;
  comment?: string;
}

// ===== Response DTOs =====

export interface RatingDto {
  feedbackId: number;
  orderId: number;
  rating?: number;
  comment?: string;
  fromUserName: string;
  createdAt?: string;
}

export interface SellerStatsDto {
  sellerId: number;
  sellerName: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
}
