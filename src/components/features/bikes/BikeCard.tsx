import { type FC } from "react";
import { Link } from "react-router-dom";
import { type BikePostDto } from "../../../services/bike.service";
import { ROUTES } from "../../../constants/routes";
import "./bike-card.css";

interface BikeCardProps {
  bike: BikePostDto;
}

const BikeCard: FC<BikeCardProps> = ({ bike }) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(bike.price);

  // Get thumbnail image URL
  const thumbnailImage =
    bike.images?.find((img) => img.isThumbnail)?.mediaUrl ||
    bike.images?.[0]?.mediaUrl ||
    "/assets/images/placeholder-bike.png";

  const bikeDetailPath = ROUTES.BIKE_DETAIL.replace(
    ":id",
    String(bike.listingId),
  );

  return (
    <div className="bike-card">
      <Link to={bikeDetailPath} className="bike-card-image-link">
        <img
          src={thumbnailImage}
          alt={bike.title}
          className="bike-card-image"
        />
        {bike.condition === "New" && (
          <span className="bike-badge badge-new">Mới</span>
        )}
        {bike.condition === "Used" && (
          <span className="bike-badge badge-used">Đã qua sử dụng</span>
        )}
      </Link>

      <div className="bike-card-content">
        <h3 className="bike-card-title">
          <Link to={bikeDetailPath}>{bike.title}</Link>
        </h3>
        <p className="bike-card-brand">{bike.brandName}</p>
        <div className="bike-card-footer">
          <span className="bike-card-price">{formattedPrice}</span>
          <button className="btn btn-outline-primary btn-sm">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
