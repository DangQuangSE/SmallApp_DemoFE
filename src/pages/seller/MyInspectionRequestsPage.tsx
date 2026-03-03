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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MyInspectionRequestsPage: FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<InspectionRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    const loadRequests = async () => {
      try {
        const data = await inspectionService.getMyRequests();
        setRequests(data);
      } catch {
        toast.error("Không thể tải danh sách yêu cầu.");
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, [isAuthenticated, navigate]);

  const handleCancel = async (requestId: number) => {
    if (!window.confirm("Bạn có chắc muốn hủy yêu cầu kiểm định này?")) return;

    try {
      await inspectionService.cancelRequest(requestId);
      toast.success("Đã hủy yêu cầu!");
      setRequests((prev) =>
        prev.map((r) =>
          r.requestId === requestId
            ? {
                ...r,
                requestStatus: REQUEST_STATUS.CANCELLED,
                requestStatusLabel: "Cancelled",
              }
            : r,
        ),
      );
    } catch {
      toast.error("Hủy yêu cầu thất bại.");
    }
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="inspection-page">
      <h2>🔍 Yêu cầu kiểm định của tôi</h2>

      {requests.length === 0 ? (
        <p className="inspection-empty">Chưa có yêu cầu kiểm định nào.</p>
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
                {req.inspectorName && (
                  <p>
                    <strong>Inspector:</strong> {req.inspectorName}
                  </p>
                )}
                <p>
                  <strong>Ngày gửi:</strong> {formatDate(req.requestDate)}
                </p>
              </div>

              <div className="inspection-card-actions">
                {req.requestStatus === REQUEST_STATUS.PENDING && (
                  <button
                    className="btn-cancel-request"
                    onClick={() => handleCancel(req.requestId)}
                  >
                    ✖ Hủy yêu cầu
                  </button>
                )}
                {req.hasReport && (
                  <Link
                    to={ROUTES.INSPECTION_REPORT.replace(
                      ":requestId",
                      String(req.requestId),
                    )}
                    className="btn-view-report"
                  >
                    📄 Xem báo cáo
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

export default MyInspectionRequestsPage;
