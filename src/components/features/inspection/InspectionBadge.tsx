import { useState, useEffect, type FC } from "react";
import { inspectionService } from "../../../services/inspection.service";
import type { InspectionReportDto } from "../../../types/inspection.types";
import { FINAL_VERDICT } from "../../../types/inspection.types";
import "../../../pages/inspection/inspection.css";

interface InspectionBadgeProps {
  listingId: number;
}

const VERDICT_CONFIG: Record<
  number,
  { emoji: string; label: string; className: string }
> = {
  [FINAL_VERDICT.PASS]: {
    emoji: "✅",
    label: "Đạt",
    className: "verdict-pass",
  },
  [FINAL_VERDICT.FAIL]: {
    emoji: "❌",
    label: "Không đạt",
    className: "verdict-fail",
  },
  [FINAL_VERDICT.CONDITIONAL]: {
    emoji: "⚠️",
    label: "Đạt có điều kiện",
    className: "verdict-conditional",
  },
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const InspectionBadge: FC<InspectionBadgeProps> = ({ listingId }) => {
  const [report, setReport] = useState<InspectionReportDto | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await inspectionService.getByListing(listingId);
        setReport(data);
      } catch {
        setReport(null);
      }
    };
    loadReport();
  }, [listingId]);

  if (!report) return null;

  const verdict = report.finalVerdict
    ? VERDICT_CONFIG[report.finalVerdict]
    : null;

  return (
    <div className="inspection-section">
      <button
        className="inspection-badge-btn"
        onClick={() => setShowDetail(!showDetail)}
      >
        <span className="inspection-badge-label">
          <span>{verdict?.emoji || "🔍"} Đã kiểm định</span>
          {verdict && (
            <span className={verdict.className}> — {verdict.label}</span>
          )}
        </span>
        <span className="inspection-toggle">{showDetail ? "▲" : "▼"}</span>
      </button>

      {showDetail && (
        <div className="inspection-detail">
          <p>
            <strong>Inspector:</strong> {report.inspectorName}
          </p>
          <p>
            <strong>Ngày kiểm tra:</strong> {formatDate(report.completedAt)}
          </p>

          {report.frameCheck && (
            <div className="check-item">
              <strong>🔧 Khung xe:</strong>
              <p>{report.frameCheck}</p>
            </div>
          )}
          {report.brakeCheck && (
            <div className="check-item">
              <strong>🔧 Phanh:</strong>
              <p>{report.brakeCheck}</p>
            </div>
          )}
          {report.transmissionCheck && (
            <div className="check-item">
              <strong>🔧 Truyền động:</strong>
              <p>{report.transmissionCheck}</p>
            </div>
          )}
          {report.inspectorNote && (
            <div className="check-item">
              <strong>📝 Ghi chú:</strong>
              <p>{report.inspectorNote}</p>
            </div>
          )}
          {report.reportUrl && (
            <a
              href={report.reportUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-download-report"
            >
              📥 Tải báo cáo đầy đủ
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default InspectionBadge;
