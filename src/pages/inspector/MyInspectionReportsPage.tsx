import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { inspectionService } from "../../services/inspection.service";
import type { InspectionReportDto } from "../../types/inspection.types";
import { FINAL_VERDICT } from "../../types/inspection.types";
import { ROUTES } from "../../constants/routes";
import "../inspection/inspection.css";

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
    month: "short",
    day: "numeric",
  });
};

const MyInspectionReportsPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<InspectionReportDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.roleName !== "Inspector") {
      navigate(ROUTES.HOME);
      return;
    }
    const loadReports = async () => {
      try {
        const data = await inspectionService.getMyReports();
        setReports(data);
      } catch {
        toast.error("Không thể tải danh sách báo cáo.");
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, [user, navigate]);

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="inspection-page">
      <h2>📄 Báo cáo kiểm định đã upload</h2>

      {reports.length === 0 ? (
        <p className="inspection-empty">Chưa có báo cáo nào.</p>
      ) : (
        <div className="inspection-list">
          {reports.map((report) => (
            <div key={report.reportId} className="inspection-card">
              <div className="inspection-card-header">
                <span className="inspection-card-title">
                  {report.bikeTitle}
                </span>
                <span
                  className={`verdict-badge ${getVerdictClass(report.finalVerdict)}`}
                >
                  {report.finalVerdictLabel}
                </span>
              </div>

              <div className="inspection-card-info">
                <p>
                  <strong>Ngày hoàn thành:</strong>{" "}
                  {formatDate(report.completedAt)}
                </p>
              </div>

              <div className="inspection-card-actions">
                <Link
                  to={ROUTES.INSPECTION_REPORT.replace(
                    ":requestId",
                    String(report.requestId),
                  )}
                  className="btn-view-report"
                >
                  📄 Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInspectionReportsPage;
