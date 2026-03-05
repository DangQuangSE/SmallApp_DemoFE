import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { inspectionService } from "../../services/inspection.service";
import type {
    InspectionRequestDto,
    InspectionReportDto,
} from "../../types/inspection.types";
import { ROUTES } from "../../constants/routes";
import "./inspector.css";

interface InspectorStats {
    pendingRequests: number;
    assignedRequests: number;
    completedReports: number;
}

const InspectorDashboard: FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<InspectorStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || user.roleName !== "Inspector") {
            navigate(ROUTES.HOME);
            return;
        }
        const loadStats = async () => {
            try {
                const [pending, assigned, reports]: [
                    InspectionRequestDto[],
                    InspectionRequestDto[],
                    InspectionReportDto[],
                ] = await Promise.all([
                    inspectionService.getPendingRequests(),
                    inspectionService.getAssignedRequests(),
                    inspectionService.getMyReports(),
                ]);
                setStats({
                    pendingRequests: pending.length,
                    assignedRequests: assigned.length,
                    completedReports: reports.length,
                });
            } catch {
                toast.error("Không thể tải dữ liệu dashboard.");
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, [user, navigate]);

    if (isLoading) {
        return <div className="loading-container">Đang tải...</div>;
    }

    return (
        <div className="inspector-dashboard">
            <h2>🔍 Inspector Dashboard</h2>

            {/* Navigation */}
            <nav className="inspector-nav">
                <Link
                    to={ROUTES.INSPECTOR_DASHBOARD}
                    className="inspector-nav-link active"
                >
                    Dashboard
                </Link>
                <Link to={ROUTES.INSPECTOR_PENDING} className="inspector-nav-link">
                    Chờ nhận
                </Link>
                <Link to={ROUTES.INSPECTOR_ASSIGNED} className="inspector-nav-link">
                    Đã nhận
                </Link>
                <Link to={ROUTES.INSPECTOR_MY_REPORTS} className="inspector-nav-link">
                    Báo cáo
                </Link>
            </nav>

            {/* Stats Grid */}
            {stats && (
                <div className="inspector-stats">
                    <div className="inspector-stat-card">
                        <div className="inspector-stat-icon">📋</div>
                        <div className="inspector-stat-value">{stats.pendingRequests}</div>
                        <div className="inspector-stat-label">Yêu cầu chờ nhận</div>
                    </div>
                    <div className="inspector-stat-card">
                        <div className="inspector-stat-icon">📝</div>
                        <div className="inspector-stat-value">{stats.assignedRequests}</div>
                        <div className="inspector-stat-label">Đã nhận kiểm định</div>
                    </div>
                    <div className="inspector-stat-card">
                        <div className="inspector-stat-icon">📄</div>
                        <div className="inspector-stat-value">{stats.completedReports}</div>
                        <div className="inspector-stat-label">Báo cáo đã upload</div>
                    </div>
                </div>
            )}

            {/* Quick Links */}
            <h3>Truy cập nhanh</h3>
            <div className="inspector-links">
                <Link to={ROUTES.INSPECTOR_PENDING} className="inspector-link-card">
                    <h4>📋 Yêu cầu chờ nhận</h4>
                    <p>Xem và nhận các yêu cầu kiểm định mới từ người bán</p>
                </Link>
                <Link to={ROUTES.INSPECTOR_ASSIGNED} className="inspector-link-card">
                    <h4>📝 Yêu cầu đã nhận</h4>
                    <p>Quản lý các yêu cầu kiểm định bạn đã nhận</p>
                </Link>
                <Link to={ROUTES.INSPECTOR_MY_REPORTS} className="inspector-link-card">
                    <h4>📄 Báo cáo kiểm định</h4>
                    <p>Xem danh sách các báo cáo kiểm định đã hoàn thành</p>
                </Link>
            </div>
        </div>
    );
};

export default InspectorDashboard;
