import { useState, type FC } from "react";
import "./rating.css";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

const StarRatingInput: FC<StarRatingInputProps> = ({
  value,
  onChange,
  size = "md",
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={`star-rating-input star-size-${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? "active" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onChange(star)}
        >
          {star <= (hovered || value) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default StarRatingInput;
