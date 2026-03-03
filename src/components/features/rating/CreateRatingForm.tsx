import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { ratingService } from "../../../services/rating.service";
import StarRatingInput from "./StarRatingInput";
import type { RatingDto } from "../../../types/rating.types";
import "./rating.css";

interface CreateRatingFormProps {
  orderId: number;
  onSuccess: (rating: RatingDto) => void;
}

const CreateRatingForm: FC<CreateRatingFormProps> = ({
  orderId,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao");
      return;
    }

    setLoading(true);
    try {
      const result = await ratingService.create({
        orderId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Đánh giá thành công!");
      onSuccess(result);
    } catch {
      toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rating-form">
      <h3 className="rating-form-title">⭐ Đánh giá người bán</h3>

      <div className="rating-stars-row">
        <label>Số sao:</label>
        <StarRatingInput value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="rating-comment-field">
        <label>Nhận xét (không bắt buộc):</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          maxLength={1000}
          rows={3}
          className="rating-textarea"
        />
        <span className="rating-char-count">{comment.length}/1000</span>
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="btn-submit-rating"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
};

export default CreateRatingForm;
