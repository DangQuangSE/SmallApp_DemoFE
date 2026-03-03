import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { inspectionService } from "../../services/inspection.service";
import type { InspectionRequestDto } from "../../types/inspection.types";
import { REQUEST_STATUS } from "../../types/inspection.types";
import { ROUTES } from "../../constants/routes";
import "../inspection/inspection.css";

const getStatusClass = (status?: number): string => {
  switch (status) {
    case REQUEST_STATUS.PENDING:
      return "pending";
    case REQUEST_STATUS.IN_PROGRESS:
      return "in-progress";
    case REQUEST_STATUS.COMPLETED:
      return "completed";
    case REQUEST_STATUS.CANCELLED:
      return "cancelled";
    default:
      return "";
  }
};

const AssignedInspectionsPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<InspectionRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.roleName !== "Inspector") {
      navigate(ROUTES.HOME);
      return;
    }
    const loadAssigned = async () => {
      try {
        const data = await inspectionService.getAssignedRequests();
        setRequests(data);
      } catch {
        toast.error("Không thể tải danh sách yêu cầu.");
      } finally {
        setIsLoading(false);
      }
    };
    loadAssigned();
  }, [user, navigate]);

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="inspection-page">
      <h2>📋 Yêu cầu kiểm định đã nhận</h2>

      {requests.length === 0 ? (
        <p className="inspection-empty">Chưa nhận yêu cầu nào.</p>
      ) : (
        <div className="inspection-list">
          {requests.map((req) => (
            <div key={req.requestId} className="inspection-card">
              <div className="inspection-card-header">
                <span className="inspection-card-title">
                  {req.listingTitle}
                </span>
                <span
                  className={`request-status ${getStatusClass(req.requestStatus)}`}
                >
                  {req.requestStatusLabel}
                </span>
              </div>

              <div className="inspection-card-info">
                <p>
                  <strong>Seller:</strong> {req.sellerName}
                </p>
              </div>

              <div className="inspection-card-actions">
                {req.requestStatus === REQUEST_STATUS.IN_PROGRESS &&
                  !req.hasReport && (
                    <Link
                      to={ROUTES.INSPECTOR_UPLOAD_REPORT.replace(
                        ":requestId",
                        String(req.requestId),
                      )}
                      className="btn-upload-report"
                    >
                      📝 Upload Báo cáo
                    </Link>
                  )}
                {req.hasReport && (
                  <Link
                    to={ROUTES.INSPECTION_REPORT.replace(
                      ":requestId",
                      String(req.requestId),
                    )}
                    className="btn-view-report"
                  >
                    📄 Xem Báo cáo
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedInspectionsPage;
