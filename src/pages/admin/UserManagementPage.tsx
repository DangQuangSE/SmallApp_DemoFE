import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { adminService } from "../../services/admin.service";
import type { AdminUserDto } from "../../services/admin.service";
import { ROUTES } from "../../constants/routes";
import "./admin.css";

const ROLE_FILTERS: { label: string; value?: number }[] = [
  { label: "Tất cả" },
  { label: "Buyer", value: 2 },
  { label: "Seller", value: 3 },
  { label: "Inspector", value: 4 },
];

const UserManagementPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.roleName !== "Admin") {
      navigate(ROUTES.HOME);
      return;
    }
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getUsers(roleFilter);
        setUsers(data);
      } catch {
        toast.error("Không thể tải danh sách người dùng.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate, roleFilter]);

  const handleToggleStatus = async (
    targetUserId: number,
    currentStatus: number | undefined,
  ) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const action = newStatus === 0 ? "cấm" : "mở khóa";

    if (!window.confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) {
      return;
    }

    setProcessingId(targetUserId);
    try {
      await adminService.updateUserStatus(targetUserId, newStatus);
      toast.success(`Đã ${action} người dùng thành công!`);
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === targetUserId ? { ...u, status: newStatus } : u,
        ),
      );
    } catch {
      toast.error(`${action} người dùng thất bại.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="admin-page">
      <h2>👥 Quản lý người dùng</h2>

      {/* Navigation */}
      <nav className="admin-nav">
        <Link to={ROUTES.ADMIN_DASHBOARD} className="admin-nav-link">
          Dashboard
        </Link>
        <Link to={ROUTES.ADMIN_MODERATION} className="admin-nav-link">
          Duyệt bài đăng
        </Link>
        <Link to={ROUTES.ADMIN_USERS} className="admin-nav-link active">
          Quản lý người dùng
        </Link>
        <Link to={ROUTES.ADMIN_ABUSE} className="admin-nav-link">
          Báo cáo vi phạm
        </Link>
      </nav>

      {/* Filter */}
      <div className="admin-filter-bar">
        <label>Vai trò:</label>
        <select
          className="admin-filter-select"
          title="Lọc theo vai trò"
          value={roleFilter ?? ""}
          onChange={(e) =>
            setRoleFilter(e.target.value ? Number(e.target.value) : undefined)
          }
        >
          {ROLE_FILTERS.map((rf) => (
            <option key={rf.label} value={rf.value ?? ""}>
              {rf.label}
            </option>
          ))}
        </select>
      </div>

      {users.length === 0 ? (
        <p className="admin-table-empty">Không có người dùng nào.</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Bài đăng</th>
                <th>Đơn hàng</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.roleName}</td>
                  <td>
                    <span
                      className={`user-status-badge ${u.status === 1 ? "active" : "banned"}`}
                    >
                      {u.status === 1 ? "Hoạt động" : "Bị cấm"}
                    </span>
                  </td>
                  <td>{u.totalListings}</td>
                  <td>{u.totalOrders}</td>
                  <td>
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td>
                    <button
                      className={`btn-admin ${u.status === 1 ? "btn-ban" : "btn-unban"}`}
                      onClick={() => handleToggleStatus(u.userId, u.status)}
                      disabled={processingId === u.userId}
                    >
                      {u.status === 1 ? "🚫 Cấm" : "✅ Mở khóa"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
