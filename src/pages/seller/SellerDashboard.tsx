import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { bikeService, type BikePostDto } from "../../services/bike.service";
import { inspectionService } from "../../services/inspection.service";
import type { InspectionRequestDto } from "../../types/inspection.types";
import { ROUTES } from "../../constants/routes";
import "./seller.css";

interface SellerStats {
    totalPosts: number;
    activePosts: number;
    pendingPosts: number;
    soldPosts: number;
    totalInspectionRequests: number;
}

const computeStats = (
    posts: BikePostDto[],
    inspections: InspectionRequestDto[]
): SellerStats => {
    return {
        totalPosts: posts.length,
        activePosts: posts.filter((p) => p.listingStatus === 1).length,
        pendingPosts: posts.filter((p) => p.listingStatus === 2).length,
        soldPosts: posts.filter((p) => p.listingStatus === 3).length,
        totalInspectionRequests: inspections.length,
    };
};

const SellerDashboard: FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<SellerStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || (user.roleName !== "Seller" && user.roleName !== "Admin")) {
            navigate(ROUTES.HOME);
            return;
        }
        const loadStats = async () => {
            try {
                const [posts, inspections] = await Promise.all([
                    bikeService.getMyPosts(),
                    inspectionService.getMyRequests(),
                ]);
                setStats(computeStats(posts, inspections));
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
        <div className="seller-dashboard">
            <h2>🏪 Seller Dashboard</h2>

            {/* Navigation */}
            <nav className="seller-nav">
                <Link to={ROUTES.SELLER_DASHBOARD} className="seller-nav-link active">
                    Dashboard
                </Link>
                <Link to={ROUTES.SELLER_LISTINGS} className="seller-nav-link">
                    Bài đăng
                </Link>
                <Link to={ROUTES.SELLER_CREATE} className="seller-nav-link">
                    Đăng bài mới
                </Link>
                <Link to={ROUTES.SELLER_INSPECTIONS} className="seller-nav-link">
                    Yêu cầu kiểm định
                </Link>
                <Link to={ROUTES.SELLER_ORDERS} className="seller-nav-link">
                    Đơn hàng bán ra
                </Link>
            </nav>

            {/* Stats Grid */}
            {stats && (
                <div className="seller-stats">
                    <div className="seller-stat-card">
                        <div className="seller-stat-icon">📋</div>
                        <div className="seller-stat-value">{stats.totalPosts}</div>
                        <div className="seller-stat-label">Tổng bài đăng</div>
                    </div>
                    <div className="seller-stat-card">
                        <div className="seller-stat-icon">✅</div>
                        <div className="seller-stat-value">{stats.activePosts}</div>
                        <div className="seller-stat-label">Đang hoạt động</div>
                    </div>
                    <div className="seller-stat-card">
                        <div className="seller-stat-icon">⏳</div>
                        <div className="seller-stat-value">{stats.pendingPosts}</div>
                        <div className="seller-stat-label">Chờ duyệt</div>
                    </div>
                    <div className="seller-stat-card">
                        <div className="seller-stat-icon">💰</div>
                        <div className="seller-stat-value">{stats.soldPosts}</div>
                        <div className="seller-stat-label">Đã bán</div>
                    </div>
                    <div className="seller-stat-card">
                        <div className="seller-stat-icon">🔍</div>
                        <div className="seller-stat-value">
                            {stats.totalInspectionRequests}
                        </div>
                        <div className="seller-stat-label">Yêu cầu kiểm định</div>
                    </div>
                </div>
            )}

            {/* Quick Links */}
            <h3>Truy cập nhanh</h3>
            <div className="seller-links">
                <Link to={ROUTES.SELLER_LISTINGS} className="seller-link-card">
                    <h4>📋 Quản lý bài đăng</h4>
                    <p>Xem, sửa, ẩn/hiện hoặc xoá bài đăng của bạn</p>
                </Link>
                <Link to={ROUTES.SELLER_CREATE} className="seller-link-card">
                    <h4>➕ Đăng bài bán xe</h4>
                    <p>Tạo bài đăng mới để bán xe đạp</p>
                </Link>
                <Link to={ROUTES.SELLER_INSPECTIONS} className="seller-link-card">
                    <h4>🔍 Yêu cầu kiểm định</h4>
                    <p>Theo dõi trạng thái các yêu cầu kiểm định xe</p>
                </Link>
                <Link to={ROUTES.SELLER_ORDERS} className="seller-link-card">
                    <h4>📦 Đơn hàng bán ra</h4>
                    <p>Quản lý đơn hàng từ người mua</p>
                </Link>
            </div>
        </div>
    );
};

export default SellerDashboard;
