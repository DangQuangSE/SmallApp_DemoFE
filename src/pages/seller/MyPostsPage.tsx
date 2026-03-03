import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { bikeService, type BikePostDto } from "../../services/bike.service";
import StatusBadge from "../../components/features/bikes/StatusBadge";
import RequestInspectionButton from "../../components/features/inspection/RequestInspectionButton";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import "../../components/features/bikes/bikes.css";

const MyPostsPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [myPosts, setMyPosts] = useState<BikePostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const loadMyPosts = async () => {
    try {
      setIsLoading(true);
      const data = await bikeService.getMyPosts();
      setMyPosts(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getThumbnail = (post: BikePostDto): string => {
    const thumb = post.images?.find((img) => img.isThumbnail);
    return (
      thumb?.mediaUrl ||
      post.images?.[0]?.mediaUrl ||
      "/assets/images/placeholder-bike.png"
    );
  };

  const handleDelete = async (listingId: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xoá bài đăng này?\nẢnh trên Cloudinary cũng sẽ bị xoá vĩnh viễn.",
    );
    if (!confirmed) return;

    try {
      await bikeService.deleteBike(listingId);
      setMyPosts((prev) => prev.filter((p) => p.listingId !== listingId));
      toast.success("Đã xoá bài đăng");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Xoá thất bại");
    }
  };

  const handleToggleVisibility = async (listingId: number) => {
    try {
      await bikeService.toggleVisibility(listingId);
      setMyPosts((prev) =>
        prev.map((p) =>
          p.listingId === listingId
            ? { ...p, listingStatus: p.listingStatus === 1 ? 0 : 1 }
            : p,
        ),
      );
    } catch (err: unknown) {
      console.error(err);
      toast.error("Thao tác thất bại");
    }
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="seller-page">
      <div className="seller-page-header">
        <h1>Bài đăng của tôi</h1>
        <Link to={ROUTES.SELLER_CREATE} className="btn-primary">
          + Đăng bài mới
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có bài đăng nào.</p>
          <Link to={ROUTES.SELLER_CREATE} className="btn-primary">
            Đăng bài đầu tiên
          </Link>
        </div>
      ) : (
        <div className="my-posts-grid">
          {myPosts.map((post) => (
            <div key={post.listingId} className="my-post-card">
              <img
                src={getThumbnail(post)}
                alt={post.title}
                className="my-post-image"
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/placeholder-bike.png";
                }}
              />
              <div className="my-post-info">
                <div className="my-post-title">{post.title}</div>
                <div className="my-post-price">{formatPrice(post.price)}</div>
                <div className="my-post-date">
                  <StatusBadge status={post.listingStatus} />
                  <span> · {formatDate(post.postedDate)}</span>
                </div>
                <div className="my-post-actions">
                  <Link
                    to={ROUTES.SELLER_EDIT.replace(
                      ":id",
                      String(post.listingId),
                    )}
                    className="btn-secondary"
                  >
                    ✏️ Sửa
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={() => handleToggleVisibility(post.listingId)}
                  >
                    {post.listingStatus === 1 ? "👁 Ẩn bài" : "👁‍🗨 Hiện bài"}
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(post.listingId)}
                  >
                    🗑 Xoá
                  </button>
                  {(post.listingStatus === 1 || post.listingStatus === 2) && (
                    <RequestInspectionButton
                      listingId={post.listingId}
                      hasInspection={post.hasInspection}
                      onSuccess={() => loadMyPosts()}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
