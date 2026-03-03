import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { adminService } from "../../services/admin.service";
import type {
  AbuseReportDto,
  ResolveAbuseRequestDto,
} from "../../types/abuse.types";
import { ABUSE_STATUS, ABUSE_STATUS_LABELS } from "../../types/abuse.types";
import { ROUTES } from "../../constants/routes";
import "./admin.css";

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

interface ResolveModalProps {
  report: AbuseReportDto;
  onClose: () => void;
  onResolved: (reportId: number) => void;
}

const ResolveModal: FC<ResolveModalProps> = ({
  report,
  onClose,
  onResolved,
}) => {
  const [resolution, setResolution] = useState("");
  const [banUser, setBanUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!resolution.trim()) {
      toast.error("Vui lòng nhập kết quả xử lý.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: ResolveAbuseRequestDto = {
        reportId: report.reportId,
        resolution,
        banUser,
      };
      await adminService.resolveAbuse(data);
      toast.success("Đã xử lý báo cáo thành công!");
      onResolved(report.reportId);
    } catch {
      toast.error("Xử lý báo cáo thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="resolve-modal-overlay" onClick={onClose}>
      <div className="resolve-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Xử lý báo cáo #{report.reportId}</h3>

        <p>
          <strong>Lý do:</strong> {report.reason}
        </p>
        <p>
          <strong>Mô tả:</strong> {report.description}
        </p>
        <p>
          <strong>Người bị báo cáo:</strong> {report.reportedUserName}
        </p>

        <label>Kết quả xử lý:</label>
        <textarea
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="Nhập kết quả xử lý..."
          rows={4}
        />

        <label className="resolve-modal-checkbox">
          <input
            type="checkbox"
            checked={banUser}
            onChange={(e) => setBanUser(e.target.checked)}
          />
          Cấm người dùng bị báo cáo
        </label>

        <div className="resolve-modal-actions">
          <button
            className="btn-admin btn-resolve"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận xử lý"}
          </button>
          <button className="btn-admin btn-reject" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

const AbuseManagementPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<AbuseReportDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    ABUSE_STATUS.PENDING,
  );
  const [resolvingReport, setResolvingReport] = useState<AbuseReportDto | null>(
    null,
  );

  useEffect(() => {
    if (!user || user.roleName !== "Admin") {
      navigate(ROUTES.HOME);
      return;
    }
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAbuseReports(statusFilter);
        setReports(data);
      } catch {
        toast.error("Không thể tải danh sách báo cáo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [user, navigate, statusFilter]);

  const handleResolved = (reportId: number) => {
    setResolvingReport(null);
    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportId ? { ...r, status: ABUSE_STATUS.RESOLVED } : r,
      ),
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <h2>🚩 Quản lý báo cáo vi phạm</h2>

      {/* Navigation */}
      <nav className="admin-nav">
        <Link to={ROUTES.ADMIN_DASHBOARD} className="admin-nav-link">
          Dashboard
        </Link>
        <Link to={ROUTES.ADMIN_MODERATION} className="admin-nav-link">
          Duyệt bài đăng
        </Link>
        <Link to={ROUTES.ADMIN_USERS} className="admin-nav-link">
          Quản lý người dùng
        </Link>
        <Link to={ROUTES.ADMIN_ABUSE} className="admin-nav-link active">
          Báo cáo vi phạm
        </Link>
      </nav>

      {/* Filter */}
      <div className="admin-filter-bar">
        <label>Trạng thái:</label>
        <select
          className="admin-filter-select"
          title="Lọc theo trạng thái"
          value={statusFilter ?? ""}
          onChange={(e) =>
            setStatusFilter(e.target.value ? Number(e.target.value) : undefined)
          }
        >
          <option value="">Tất cả</option>
          <option value={ABUSE_STATUS.PENDING}>Đang chờ</option>
          <option value={ABUSE_STATUS.RESOLVED}>Đã xử lý</option>
          <option value={ABUSE_STATUS.REJECTED}>Đã từ chối</option>
        </select>
      </div>

      {reports.length === 0 ? (
        <p className="admin-table-empty">Không có báo cáo nào.</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người báo cáo</th>
                <th>Người bị báo cáo</th>
                <th>Lý do</th>
                <th>Bài đăng</th>
                <th>Đơn hàng</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.reportId}>
                  <td>{report.reportId}</td>
                  <td>{report.reporterName}</td>
                  <td>{report.reportedUserName}</td>
                  <td>{report.reason}</td>
                  <td>
                    {report.listingId ? (
                      <Link to={`/bikes/${report.listingId}`}>
                        {report.listingTitle || `#${report.listingId}`}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {report.orderId ? (
                      <Link to={`/orders/${report.orderId}`}>
                        #{report.orderId}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <span
                      className={`abuse-status ${getStatusClass(report.status)}`}
                    >
                      {ABUSE_STATUS_LABELS[report.status] || "Không rõ"}
                    </span>
                  </td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    {report.status === ABUSE_STATUS.PENDING ? (
                      <button
                        className="btn-admin btn-resolve"
                        onClick={() => setResolvingReport(report)}
                      >
                        🔧 Xử lý
                      </button>
                    ) : (
                      <span>{report.resolution || "-"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resolve Modal */}
      {resolvingReport && (
        <ResolveModal
          report={resolvingReport}
          onClose={() => setResolvingReport(null)}
          onResolved={handleResolved}
        />
      )}
    </div>
  );
};

export default AbuseManagementPage;
