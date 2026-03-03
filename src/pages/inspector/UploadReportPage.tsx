import { useState, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { inspectionService } from "../../services/inspection.service";
import { ROUTES } from "../../constants/routes";
import { FINAL_VERDICT } from "../../types/inspection.types";
import "../inspection/inspection.css";

const VERDICT_OPTIONS = [
  { value: FINAL_VERDICT.PASS, label: "✅ Pass — Xe đạt tiêu chuẩn" },
  { value: FINAL_VERDICT.FAIL, label: "❌ Fail — Xe không đạt" },
  {
    value: FINAL_VERDICT.CONDITIONAL,
    label: "⚠️ Conditional — Đạt có điều kiện",
  },
];

const UploadReportPage: FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [frameCheck, setFrameCheck] = useState("");
  const [brakeCheck, setBrakeCheck] = useState("");
  const [transmissionCheck, setTransmissionCheck] = useState("");
  const [inspectorNote, setInspectorNote] = useState("");
  const [finalVerdict, setFinalVerdict] = useState(0);
  const [reportUrl, setReportUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.roleName !== "Inspector") {
    navigate(ROUTES.HOME);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (finalVerdict === 0) {
      toast.error("Vui lòng chọn kết luận.");
      return;
    }

    setIsSubmitting(true);
    try {
      await inspectionService.uploadReport({
        requestId: Number(requestId),
        frameCheck: frameCheck || undefined,
        brakeCheck: brakeCheck || undefined,
        transmissionCheck: transmissionCheck || undefined,
        inspectorNote: inspectorNote || undefined,
        finalVerdict,
        reportUrl: reportUrl || undefined,
      });
      toast.success("Upload báo cáo thành công!");
      navigate(ROUTES.INSPECTOR_MY_REPORTS);
    } catch {
      toast.error("Upload thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-report-page">
      <h2>📝 Upload Báo cáo Kiểm định</h2>

      <form className="upload-report-form" onSubmit={handleSubmit}>
        <div className="report-form-group">
          <label>🔧 Kiểm tra khung xe</label>
          <textarea
            value={frameCheck}
            onChange={(e) => setFrameCheck(e.target.value)}
            placeholder="Tình trạng khung, mối hàn, cong vênh..."
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="report-form-group">
          <label>🔧 Kiểm tra phanh</label>
          <textarea
            value={brakeCheck}
            onChange={(e) => setBrakeCheck(e.target.value)}
            placeholder="Loại phanh, hoạt động, má phanh..."
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="report-form-group">
          <label>🔧 Kiểm tra bộ truyền động</label>
          <textarea
            value={transmissionCheck}
            onChange={(e) => setTransmissionCheck(e.target.value)}
            placeholder="Hệ bộ đề, xích, líp, pedal..."
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="report-form-group">
          <label>📝 Ghi chú tổng hợp</label>
          <textarea
            value={inspectorNote}
            onChange={(e) => setInspectorNote(e.target.value)}
            placeholder="Nhận xét tổng thể, khuyến nghị..."
            maxLength={2000}
            rows={5}
          />
        </div>

        <div className="report-form-group">
          <label>Kết luận *</label>
          <div className="verdict-options">
            {VERDICT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`verdict-option ${finalVerdict === opt.value ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="verdict"
                  value={opt.value}
                  checked={finalVerdict === opt.value}
                  onChange={() => setFinalVerdict(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="report-form-group">
          <label>URL Báo cáo (PDF/Image)</label>
          <input
            type="url"
            value={reportUrl}
            onChange={(e) => setReportUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          className="btn-submit-report"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang upload..." : "📤 Upload Báo cáo"}
        </button>
      </form>
    </div>
  );
};

export default UploadReportPage;
