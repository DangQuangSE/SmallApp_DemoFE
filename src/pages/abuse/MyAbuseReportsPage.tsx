import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { abuseService } from "../../services/abuse.service";
import type { AbuseRequestDto } from "../../types/abuse.types";
import { ROUTES } from "../../constants/routes";
import "../../components/features/abuse/abuse.css";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
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
  const [reports, setReports] = useState<AbuseRequestDto[]>([]);
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
        toast.error("Failed to load reports.");
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="my-reports-page">
      <h2>🚩 My Abuse Reports</h2>

      {reports.length === 0 ? (
        <p className="my-reports-empty">You have not submitted any reports.</p>
      ) : (
        <div className="my-reports-list">
          {reports.map((report) => (
            <div key={report.requestAbuseId} className="report-card">
              <div className="report-card-header">
                <span className="report-card-reason">{report.reason}</span>
                <span
                  className={`abuse-status ${report.isResolved ? "resolved" : "pending"}`}
                >
                  {report.isResolved ? "Resolved" : "Pending"}
                </span>
              </div>

              <div className="report-card-meta">
                {report.targetUserName && (
                  <span>Reported user: {report.targetUserName}</span>
                )}
                {report.targetListingTitle && (
                  <span> · Listing: {report.targetListingTitle}</span>
                )}
                <span> · {formatDate(report.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAbuseReportsPage;
