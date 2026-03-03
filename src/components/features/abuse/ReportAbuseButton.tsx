import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import { abuseService } from "../../../services/abuse.service";
import type { CreateAbuseRequestDto } from "../../../types/abuse.types";
import "./abuse.css";

interface ReportAbuseButtonProps {
  reportedUserId: number;
  listingId?: number;
  orderId?: number;
}

const ABUSE_REASONS = [
  "Hàng giả / Hàng nhái",
  "Lừa đảo",
  "Giá không hợp lý",
  "Mô tả sai sự thật",
  "Spam / Quấy rối",
  "Khác",
];

const ReportAbuseButton: FC<ReportAbuseButtonProps> = ({
  reportedUserId,
  listingId,
  orderId,
}) => {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng chọn lý do.");
      return;
    }
    if (!description.trim()) {
      toast.error("Vui lòng mô tả chi tiết.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateAbuseRequestDto = {
        reportedUserId,
        reason,
        description,
      };
      if (listingId) data.listingId = listingId;
      if (orderId) data.orderId = orderId;

      await abuseService.submit(data);
      toast.success("Báo cáo đã được gửi thành công!");
      setShowForm(false);
      setReason("");
      setDescription("");
    } catch {
      toast.error("Gửi báo cáo thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-abuse">
      {!showForm ? (
        <button className="btn-report-abuse" onClick={() => setShowForm(true)}>
          🚩 Báo cáo vi phạm
        </button>
      ) : (
        <div className="report-abuse-form">
          <h4>Báo cáo vi phạm</h4>

          <label className="report-label">Lý do:</label>
          <select
            className="report-select"
            title="Chọn lý do vi phạm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">-- Chọn lý do --</option>
            {ABUSE_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="report-label">Mô tả chi tiết:</label>
          <textarea
            className="report-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết vi phạm..."
            rows={4}
          />

          <div className="report-actions">
            <button
              className="btn-submit-report"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
            <button
              className="btn-cancel-report"
              onClick={() => {
                setShowForm(false);
                setReason("");
                setDescription("");
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAbuseButton;
