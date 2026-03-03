import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { wishlistService } from "../../services/wishlist.service";
import type { BikePostDto } from "../../types/bike.types";
import { ROUTES } from "../../constants/routes";
import BikeCard from "../../components/features/bikes/BikeCard";
import "./wishlist.css";

const WishlistPage: FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<BikePostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem danh sách yêu thích.");
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch wishlist
  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await wishlistService.getWishlist();
        setItems(data);
      } catch {
        toast.error("Không thể tải danh sách yêu thích.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  const handleRemove = async (listingId: number) => {
    try {
      await wishlistService.removeFromWishlist(listingId);
      setItems((prev) => prev.filter((item) => item.listingId !== listingId));
      toast.success("Đã bỏ khỏi yêu thích.");
    } catch {
      toast.error("Không thể xoá khỏi yêu thích.");
    }
  };

  if (authLoading) {
    return <div className="wishlist-loading">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">Danh sách yêu thích ({items.length})</h1>

      {isLoading ? (
        <div className="wishlist-loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.listingId} className="wishlist-item">
              <BikeCard bike={item} />
              <button
                className="wishlist-remove-btn"
                onClick={() => handleRemove(item.listingId)}
              >
                ✕ Bỏ yêu thích
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">
          <span className="wishlist-empty-icon">❤️</span>
          <p>Chưa có xe nào trong danh sách yêu thích.</p>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
