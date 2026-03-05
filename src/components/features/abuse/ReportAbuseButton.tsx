import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import { abuseService } from "../../../services/abuse.service";
import type { CreateAbuseRequestDto } from "../../../types/abuse.types";
import "./abuse.css";

interface ReportAbuseButtonProps {
  targetUserId: number;
  targetListingId?: number;
}

const ABUSE_REASONS = [
  "Counterfeit / Fake product",
  "Scam / Fraud",
  "Unreasonable price",
  "False description",
  "Spam / Harassment",
  "Other",
];

const ReportAbuseButton: FC<ReportAbuseButtonProps> = ({
  targetUserId,
  targetListingId,
}) => {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) return null;
  if (submitted) {
    return (
      <div className="report-abuse">
        <span className="report-submitted">✅ Report submitted</span>
      </div>
    );
  }

  const handleSubmit = async () => {
    const finalReason = reason === "Other" ? customReason.trim() : reason;
    if (!finalReason) {
      toast.error("Please select or enter a reason.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateAbuseRequestDto = {
        targetUserId,
        reason: finalReason,
      };
      if (targetListingId) data.targetListingId = targetListingId;

      await abuseService.submit(data);
      toast.success("Report submitted successfully!");
      setSubmitted(true);
      setShowForm(false);
      setReason("");
      setCustomReason("");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: string } })?.response?.data ||
        "Failed to submit report. Please try again.";
      toast.error(String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-abuse">
      {!showForm ? (
        <button className="btn-report-abuse" onClick={() => setShowForm(true)}>
          🚩 Report Abuse
        </button>
      ) : (
        <div className="report-abuse-form">
          <h4>Report Abuse</h4>

          <label className="report-label">Reason:</label>
          <select
            className="report-select"
            title="Select abuse reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">-- Select reason --</option>
            {ABUSE_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {reason === "Other" && (
            <>
              <label className="report-label">Describe the issue:</label>
              <textarea
                className="report-textarea"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the violation..."
                rows={3}
                maxLength={1000}
              />
            </>
          )}

          <div className="report-actions">
            <button
              className="btn-submit-report"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
            <button
              className="btn-cancel-report"
              onClick={() => {
                setShowForm(false);
                setReason("");
                setCustomReason("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAbuseButton;
