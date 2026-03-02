import { type FC } from "react";
import { Link } from "react-router-dom";
import { Bike } from "../../../services/bike.service";
import { ROUTES } from "../../../constants/routes";
import "./bike-card.css";

interface BikeCardProps {
  bike: Bike;
}

const BikeCard: FC<BikeCardProps> = ({ bike }) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(bike.price);

  return (
    <div className="bike-card">
      <Link to={ROUTES.BIKE_DETAIL.replace(":id", bike.id)} className="bike-card-image-link">
        <img 
          src={bike.images[0] || "/assets/images/placeholder-bike.png"} 
          alt={bike.name} 
          className="bike-card-image"
        />
        {bike.condition === "new" && <span className="bike-badge badge-new">Mới</span>}
        {bike.condition === "used" && <span className="bike-badge badge-used">Đã qua sử dụng</span>}
      </Link>
      
      <div className="bike-card-content">
        <h3 className="bike-card-title">
          <Link to={ROUTES.BIKE_DETAIL.replace(":id", bike.id)}>{bike.name}</Link>
        </h3>
        <p className="bike-card-brand">{bike.brand}</p>
        <div className="bike-card-footer">
          <span className="bike-card-price">{formattedPrice}</span>
          <button className="btn btn-outline-primary btn-sm">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
