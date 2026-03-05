import { useState, useEffect, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { bikeService, type BikePostDto } from "../../services/bike.service";
import { wishlistService } from "../../services/wishlist.service";
import { cartService } from "../../services/cart.service";
import { orderService } from "../../services/order.service";
import { ROUTES } from "../../constants/routes";
import BikeImageGallery from "../../components/features/bikes/BikeImageGallery";
import StatusBadge from "../../components/features/bikes/StatusBadge";
import SellerReputation from "../../components/features/rating/SellerReputation";
import ReportAbuseButton from "../../components/features/abuse/ReportAbuseButton";
import InspectionBadge from "../../components/features/inspection/InspectionBadge";
import "../../components/features/bikes/bikes.css";

const BikeDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState<BikePostDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const data = await bikeService.getBikeDetail(Number(id));
        setListing(data);
      } catch (err: unknown) {
        console.error(err);
        setError("Không tìm thấy bài đăng.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  // Check wishlist & cart status when listing loads (if authenticated)
  useEffect(() => {
    if (!isAuthenticated || !id) return;
    const listingId = Number(id);
    const checkStatus = async () => {
      try {
        const [wishRes, cartRes] = await Promise.all([
          wishlistService.checkWishlist(listingId),
          cartService.checkCart(listingId),
        ]);
        setIsInWishlist(wishRes);
        setIsInCart(cartRes);
      } catch {
        // Ignore — user may not have permission
      }
    };
    checkStatus();
  }, [id, isAuthenticated]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua hàng.");
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!listing) return;
    setIsBuying(true);
    try {
      const order = await orderService.buyNow(listing.listingId);
      toast.success("Đặt hàng thành công!");
      navigate(ROUTES.ORDER_DETAIL.replace(":id", String(order.orderId)));
    } catch {
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsBuying(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập.");
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!listing) return;
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(listing.listingId);
        setIsInWishlist(false);
        toast.success("Đã bỏ khỏi yêu thích.");
      } else {
        await wishlistService.addToWishlist(listing.listingId);
        setIsInWishlist(true);
        toast.success("Đã thêm vào yêu thích.");
      }
    } catch {
      toast.error("Không thể cập nhật yêu thích.");
    }
  };

  const handleToggleCart = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập.");
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!listing) return;
    try {
      if (isInCart) {
        await cartService.removeFromCart(listing.listingId);
        setIsInCart(false);
        toast.success("Đã bỏ khỏi giỏ hàng.");
      } else {
        await cartService.addToCart(listing.listingId);
        setIsInCart(true);
        toast.success("Đã thêm vào giỏ hàng.");
      }
    } catch {
      toast.error("Không thể cập nhật giỏ hàng.");
    }
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để nhắn tin.");
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!listing) return;
    navigate(`/messages/${listing.sellerId}`);
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  if (error || !listing) {
    return (
      <div className="bike-detail-container">
        <p className="form-error">{error || "Không tìm thấy bài đăng."}</p>
        <button className="btn-secondary" onClick={() => navigate("/bikes")}>
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="bike-detail-container">
      <button className="bike-detail-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      {/* Top Section: Gallery + Critical Purchase Info */}
      <div className="bike-detail-top">
        {/* Left: Gallery */}
        <div className="bike-detail-gallery-wrapper">
          <BikeImageGallery images={listing.images} />
        </div>

        {/* Right: Purchase Box */}
        <div className="bike-detail-purchase-box">
          <h1 className="bike-title">{listing.title}</h1>
          <p className="bike-price">{formatPrice(listing.price)}</p>

          <div className="bike-badges">
            {listing.condition && (
              <span className="badge-item">{listing.condition}</span>
            )}
            {listing.brandName && (
              <span className="badge-item">{listing.brandName}</span>
            )}
            {listing.typeName && (
              <span className="badge-item">{listing.typeName}</span>
            )}
            {listing.listingStatus != null && (
              <StatusBadge status={listing.listingStatus} />
            )}
            {/* Inspection badge right up top near badges */}
            {listing.hasInspection && (
              <InspectionBadge listingId={listing.listingId} />
            )}
          </div>

          <div className="bike-stock">
            {listing.quantity != null && (
              <span>
                {listing.quantity > 0
                  ? `Tình trạng: Còn ${listing.quantity} chiếc`
                  : "Tình trạng: Hết hàng"}
              </span>
            )}
          </div>

          <div className="action-buttons-container">
            {/* Buy Now — only for Buyer role */}
            {listing.listingStatus === 1 && user?.roleName === "Buyer" && (
              <button
                className="btn-buy-now"
                onClick={handleBuyNow}
                disabled={isBuying || listing.quantity === 0}
              >
                {isBuying ? "Đang xử lý..." : "🛒 Mua ngay"}
              </button>
            )}

            {/* Wishlist & Cart — hidden if user is the owner */}
            {(!user || user.userId !== listing.sellerId) && (
              <div className="cart-wishlist-group">
                <button
                  className={`btn-wishlist ${isInWishlist ? "active" : ""}`}
                  onClick={handleToggleWishlist}
                >
                  {isInWishlist ? "❤️ Đã yêu thích" : "🤍 Thêm yêu thích"}
                </button>

                {isInCart ? (
                  <button
                    className="btn-cart-toggle in-cart"
                    onClick={handleToggleCart}
                  >
                    ✅ Đã thêm — Bỏ ra
                  </button>
                ) : (
                  <button
                    className="btn-cart-toggle"
                    onClick={handleToggleCart}
                    disabled={listing.quantity === 0}
                  >
                    🛒 Thêm vào giỏ
                  </button>
                )}
              </div>
            )}

            {/* Chat with seller — hidden if user is the owner */}
            {(!user || user.userId !== listing.sellerId) && (
              <button className="btn-chat-seller" onClick={handleChat}>
                💬 Chat với người bán
              </button>
            )}

            {/* Report abuse — hidden if user is the owner */}
            {(!user || user.userId !== listing.sellerId) && (
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <ReportAbuseButton
                  targetUserId={listing.sellerId}
                  targetListingId={listing.listingId}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Details, Description, Seller Sidebar */}
      <div className="bike-detail-bottom">
        <div className="bike-detail-main-content">
          {/* Detailed Specs */}
          <div className="detail-section">
            <h3>Thông số kỹ thuật</h3>
            <div className="specs-grid">
              {listing.modelName && (
                <div className="spec-item">
                  <span className="spec-label">Model</span>
                  <span className="spec-value">{listing.modelName}</span>
                </div>
              )}
              {listing.color && (
                <div className="spec-item">
                  <span className="spec-label">Màu sắc</span>
                  <span className="spec-value">{listing.color}</span>
                </div>
              )}
              {listing.frameSize && (
                <div className="spec-item">
                  <span className="spec-label">Size khung</span>
                  <span className="spec-value">{listing.frameSize}</span>
                </div>
              )}
              {listing.frameMaterial && (
                <div className="spec-item">
                  <span className="spec-label">Chất liệu khung</span>
                  <span className="spec-value">{listing.frameMaterial}</span>
                </div>
              )}
              {listing.wheelSize && (
                <div className="spec-item">
                  <span className="spec-label">Cỡ bánh</span>
                  <span className="spec-value">{listing.wheelSize}</span>
                </div>
              )}
              {listing.brakeType && (
                <div className="spec-item">
                  <span className="spec-label">Phanh</span>
                  <span className="spec-value">{listing.brakeType}</span>
                </div>
              )}
              {listing.weight && (
                <div className="spec-item">
                  <span className="spec-label">Trọng lượng</span>
                  <span className="spec-value">{listing.weight} kg</span>
                </div>
              )}
              {listing.transmission && (
                <div className="spec-item">
                  <span className="spec-label">Bộ truyền động</span>
                  <span className="spec-value">{listing.transmission}</span>
                </div>
              )}
              {listing.serialNumber && (
                <div className="spec-item">
                  <span className="spec-label">Serial Number</span>
                  <span className="spec-value">{listing.serialNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="detail-section">
              <h3>Mô tả chi tiết</h3>
              <p className="description-text">{listing.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bike-detail-sidebar">
          {/* Seller Info */}
          <div className="seller-sidebar-card">
            <h3>Thông tin người bán</h3>
            <div className="bike-detail-seller">
              <div className="seller-avatar">
                {listing.sellerName?.charAt(0).toUpperCase()}
              </div>
              <div className="seller-info">
                <div className="seller-name">{listing.sellerName}</div>
                <div className="seller-meta">
                  {listing.address && <span>📍 {listing.address}</span>}
                  <span>📅 Đăng: {formatDate(listing.postedDate)}</span>
                </div>
              </div>
            </div>
            <SellerReputation sellerId={listing.sellerId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetailPage;
