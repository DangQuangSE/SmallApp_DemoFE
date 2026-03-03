import { useState, useEffect, type FC } from "react";
import {
  bikeService,
  type BikePostDto,
  type BikeFilterDto,
} from "../../services/bike.service";
import BikeCard from "../../components/features/bikes/BikeCard";
import "./bike-list.css";

const BikeList: FC = () => {
  const [bikes, setBikes] = useState<BikePostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BikeFilterDto>({});

  const fetchBikes = async () => {
    setIsLoading(true);
    try {
      const data = await bikeService.getBikes(filters);
      // Handle both paged result and plain array response
      if (Array.isArray(data)) {
        setBikes(data);
      } else if (data && Array.isArray(data.items)) {
        setBikes(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch bikes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, [filters]);

  const handleFilterChange = (key: keyof BikeFilterDto, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bike-list-container">
      <div className="bike-list-header">
        <h1>Khám phá xe đạp</h1>
        <div className="bike-list-controls">
          <select
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="filter-select"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : bikes.length > 0 ? (
        <div className="bike-grid">
          {bikes.map((bike) => (
            <BikeCard key={bike.listingId} bike={bike} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Không tìm thấy xe nào phù hợp với yêu cầu của bạn.</p>
        </div>
      )}
    </div>
  );
};

export default BikeList;
