import { useState, useEffect, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bikeService, type BikePostDto } from "../../services/bike.service";
import BikeImageGallery from "../../components/features/bikes/BikeImageGallery";
import StatusBadge from "../../components/features/bikes/StatusBadge";
import "../../components/features/bikes/bikes.css";

const BikeDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<BikePostDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

      <div className="bike-detail-grid">
        {/* Left — Gallery */}
        <div>
          <BikeImageGallery images={listing.images} />
        </div>

        {/* Right — Info */}
        <div className="bike-detail-info">
          <h1>{listing.title}</h1>
          <p className="bike-detail-price">{formatPrice(listing.price)}</p>

          <div className="bike-detail-meta">
            {listing.condition && (
              <span className="bike-detail-meta-item">{listing.condition}</span>
            )}
            {listing.brandName && (
              <span className="bike-detail-meta-item">{listing.brandName}</span>
            )}
            {listing.typeName && (
              <span className="bike-detail-meta-item">{listing.typeName}</span>
            )}
            {listing.listingStatus != null && (
              <StatusBadge status={listing.listingStatus} />
            )}
          </div>

          {/* Specs */}
          <div className="bike-detail-section">
            <h3>Thông số kỹ thuật</h3>
            <div className="bike-detail-specs">
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
            <div className="bike-detail-section">
              <h3>Mô tả</h3>
              <p className="bike-detail-description">{listing.description}</p>
            </div>
          )}

          {/* Seller */}
          <div className="bike-detail-section">
            <h3>Người bán</h3>
            <div className="bike-detail-seller">
              <div className="seller-avatar">
                {listing.sellerName?.charAt(0).toUpperCase()}
              </div>
              <div className="seller-info">
                <div className="seller-name">{listing.sellerName}</div>
                {listing.address && (
                  <div className="seller-date">📍 {listing.address}</div>
                )}
                <div className="seller-date">
                  Đăng ngày: {formatDate(listing.postedDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetailPage;
