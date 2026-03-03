import { useState, useEffect, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { inspectionService } from "../../services/inspection.service";
import type { InspectionReportDto } from "../../types/inspection.types";
import { FINAL_VERDICT } from "../../types/inspection.types";
import "./inspection.css";

const getVerdictClass = (verdict?: number): string => {
  switch (verdict) {
    case FINAL_VERDICT.PASS:
      return "pass";
    case FINAL_VERDICT.FAIL:
      return "fail";
    case FINAL_VERDICT.CONDITIONAL:
      return "conditional";
    default:
      return "";
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InspectionReportPage: FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<InspectionReportDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!requestId) return;
    const loadReport = async () => {
      try {
        const data = await inspectionService.getByRequestId(Number(requestId));
        setReport(data);
      } catch {
        setError("Không tìm thấy báo cáo kiểm định.");
      } finally {
        setIsLoading(false);
      }
    };
    loadReport();
  }, [requestId]);

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  if (error || !report) {
    return (
      <div className="report-page">
        <p className="form-error">
          {error || "Không tìm thấy báo cáo kiểm định."}
        </p>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="report-page">
      <button className="btn-secondary" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <h2>📄 Báo cáo Kiểm định</h2>

      <div className="report-detail-card">
        <h3>{report.bikeTitle}</h3>

        <div className="report-meta">
          <span>
            <strong>Inspector:</strong> {report.inspectorName}
          </span>
          <span>
            <strong>Ngày hoàn thành:</strong> {formatDate(report.completedAt)}
          </span>
          <span>
            <strong>Kết luận:</strong>{" "}
            <span
              className={`verdict-badge ${getVerdictClass(report.finalVerdict)}`}
            >
              {report.finalVerdictLabel}
            </span>
          </span>
        </div>

        <div className="report-checks">
          {report.frameCheck && (
            <div className="report-check-item">
              <strong>🔧 Kiểm tra khung xe</strong>
              <p>{report.frameCheck}</p>
            </div>
          )}
          {report.brakeCheck && (
            <div className="report-check-item">
              <strong>🔧 Kiểm tra phanh</strong>
              <p>{report.brakeCheck}</p>
            </div>
          )}
          {report.transmissionCheck && (
            <div className="report-check-item">
              <strong>🔧 Kiểm tra bộ truyền động</strong>
              <p>{report.transmissionCheck}</p>
            </div>
          )}
          {report.inspectorNote && (
            <div className="report-check-item">
              <strong>📝 Ghi chú tổng hợp</strong>
              <p>{report.inspectorNote}</p>
            </div>
          )}
        </div>

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
    </div>
  );
};

export default InspectionReportPage;
