import { useState, useEffect, type FC } from "react";
import { ratingService } from "../../../services/rating.service";
import StarRatingDisplay from "./StarRatingDisplay";
import type { RatingDto, SellerStatsDto } from "../../../types/rating.types";
import "./rating.css";

interface SellerReputationProps {
  sellerId: number;
}

const SellerReputation: FC<SellerReputationProps> = ({ sellerId }) => {
  const [stats, setStats] = useState<SellerStatsDto | null>(null);
  const [reviews, setReviews] = useState<RatingDto[]>([]);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ratingService
      .getSellerStats(sellerId)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        // ignore — may not have ratings yet
      });
    return () => {
      cancelled = true;
    };
  }, [sellerId]);

  const loadReviews = async () => {
    if (reviews.length === 0) {
      try {
        const data = await ratingService.getBySeller(sellerId);
        setReviews(data);
      } catch {
        // ignore
      }
    }
    setShowReviews(!showReviews);
  };

  if (!stats || stats.totalReviews === 0) return null;

  return (
    <div className="seller-reputation">
      <h3 className="reputation-title">Uy tín người bán</h3>

      <div className="stats-summary">
        <div className="avg-rating">
          <StarRatingDisplay rating={stats.averageRating} size="lg" />
          <span className="avg-text">{stats.averageRating.toFixed(1)} / 5</span>
        </div>
        <span className="total-reviews">{stats.totalReviews} đánh giá</span>
      </div>

      {/* Rating distribution bars */}
      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.ratingDistribution[star.toString()] || 0;
          const percentage =
            stats.totalReviews > 0
              ? Math.round((count / stats.totalReviews) * 100)
              : 0;
          return (
            <div key={star} className="rating-bar-row">
              <span className="bar-label">{star}★</span>
              <div className="bar-container">
                <div className="bar-fill" data-percent={percentage} />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Toggle reviews */}
      <button onClick={loadReviews} className="btn-toggle-reviews">
        {showReviews
          ? "Ẩn đánh giá"
          : `Xem tất cả ${stats.totalReviews} đánh giá`}
      </button>

      {showReviews && (
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="reviews-empty">Chưa có đánh giá nào</p>
          ) : (
            reviews.map((review) => (
              <div key={review.feedbackId} className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">{review.fromUserName}</span>
                  {review.rating != null && (
                    <StarRatingDisplay
                      rating={review.rating}
                      size="sm"
                      showValue={false}
                    />
                  )}
                  <span className="review-date">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("vi-VN")
                      : ""}
                  </span>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SellerReputation;
