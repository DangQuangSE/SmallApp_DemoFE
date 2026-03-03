import type { FC } from "react";
import "./rating.css";

interface StarRatingDisplayProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const StarRatingDisplay: FC<StarRatingDisplayProps> = ({
  rating,
  size = "sm",
  showValue = true,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className={`star-rating-display star-size-${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="star-display">
          {star <= fullStars
            ? "★"
            : star === fullStars + 1 && hasHalf
              ? "★"
              : "☆"}
        </span>
      ))}
      {showValue && <span className="rating-value">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRatingDisplay;
