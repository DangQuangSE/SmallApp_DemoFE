import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { inspectionService } from "../../services/inspection.service";
import type { InspectionRequestDto } from "../../types/inspection.types";
import { ROUTES } from "../../constants/routes";
import "../inspection/inspection.css";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PendingInspectionsPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<InspectionRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.roleName !== "Inspector") {
      navigate(ROUTES.HOME);
      return;
    }
    const loadPending = async () => {
      try {
        const data = await inspectionService.getPendingRequests();
        setRequests(data);
      } catch {
        toast.error("Không thể tải danh sách yêu cầu.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPending();
  }, [user, navigate]);

  const handleAccept = async (requestId: number) => {
    setAcceptingId(requestId);
    try {
      await inspectionService.acceptRequest(requestId);
      toast.success("Đã nhận yêu cầu kiểm định!");
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch {
      toast.error("Nhận yêu cầu thất bại.");
    } finally {
      setAcceptingId(null);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="inspection-page">
      <h2>📋 Yêu cầu kiểm định chờ nhận ({requests.length})</h2>

      {requests.length === 0 ? (
        <p className="inspection-empty">Không có yêu cầu nào chờ xử lý.</p>
      ) : (
        <div className="inspection-list">
          {requests.map((req) => (
            <div key={req.requestId} className="inspection-card">
              <div className="inspection-card-info">
                <h3 className="inspection-card-title">{req.listingTitle}</h3>
                <p>
                  <strong>Seller:</strong> {req.sellerName}
                </p>
                <p>
                  <strong>Ngày yêu cầu:</strong> {formatDate(req.requestDate)}
                </p>
              </div>

              <div className="inspection-card-actions">
                <button
                  className="btn-accept"
                  onClick={() => handleAccept(req.requestId)}
                  disabled={acceptingId === req.requestId}
                >
                  {acceptingId === req.requestId
                    ? "Đang nhận..."
                    : "✅ Nhận kiểm định"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingInspectionsPage;
