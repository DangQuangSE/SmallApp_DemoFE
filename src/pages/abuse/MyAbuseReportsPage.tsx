import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { abuseService } from "../../services/abuse.service";
import type { AbuseReportDto } from "../../types/abuse.types";
import { ABUSE_STATUS, ABUSE_STATUS_LABELS } from "../../types/abuse.types";
import { ROUTES } from "../../constants/routes";
import "../../components/features/abuse/abuse.css";

const getStatusClass = (status: number): string => {
  switch (status) {
    case ABUSE_STATUS.PENDING:
      return "pending";
    case ABUSE_STATUS.RESOLVED:
      return "resolved";
    case ABUSE_STATUS.REJECTED:
      return "rejected";
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
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyAbuseReportsPage: FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<AbuseReportDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    const loadReports = async () => {
      try {
        const data = await abuseService.getMyReports();
        setReports(data);
      } catch {
        toast.error("Không thể tải danh sách báo cáo.");
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="my-reports-page">
      <h2>🚩 Báo cáo vi phạm của tôi</h2>

      {reports.length === 0 ? (
        <p className="my-reports-empty">Bạn chưa có báo cáo vi phạm nào.</p>
      ) : (
        <div className="my-reports-list">
          {reports.map((report) => (
            <div key={report.reportId} className="report-card">
              <div className="report-card-header">
                <span className="report-card-reason">{report.reason}</span>
                <span
                  className={`abuse-status ${getStatusClass(report.status)}`}
                >
                  {ABUSE_STATUS_LABELS[report.status] || "Không rõ"}
                </span>
              </div>

              <div className="report-card-body">{report.description}</div>

              <div className="report-card-meta">
                <span>Người bị báo cáo: {report.reportedUserName}</span>
                {report.listingTitle && (
                  <span> · Bài đăng: {report.listingTitle}</span>
                )}
                {report.orderId && <span> · Đơn hàng #{report.orderId}</span>}
                <span> · {formatDate(report.createdAt)}</span>
              </div>

              {report.resolution && (
                <div className="report-card-resolution">
                  <strong>Kết quả xử lý:</strong> {report.resolution}
                  {report.resolvedAt && (
                    <span> · {formatDate(report.resolvedAt)}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAbuseReportsPage;
