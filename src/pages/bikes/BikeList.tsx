import { useState, useEffect, type FC } from "react";
import {
  bikeService,
  type BikePostDto,
  type BikeFilterDto,
} from "../../services/bike.service";
import type { PagedResult } from "../../types/bike.types";
import BikeCard from "../../components/features/bikes/BikeCard";
import BikeFilter from "../../components/features/bikes/BikeFilter";
import Pagination from "../../components/features/bikes/Pagination";
import "./bike-list.css";

const BikeList: FC = () => {
  const [bikes, setBikes] = useState<BikePostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BikeFilterDto>({
    page: 1,
    pageSize: 12,
    sortBy: "newest",
  });
  const [pagination, setPagination] = useState<PagedResult<BikePostDto> | null>(
    null,
  );

  const fetchBikes = async (currentFilters: BikeFilterDto) => {
    setIsLoading(true);
    try {
      const data = await bikeService.getBikes(currentFilters);
      // Handle both paged result and plain array response
      if (Array.isArray(data)) {
        setBikes(data);
        setPagination(null);
      } else if (data && Array.isArray(data.items)) {
        setBikes(data.items);
        setPagination(data);
      }
    } catch (error) {
      console.error("Failed to fetch bikes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes(filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bike-list-page">
      {/* Sidebar Filter */}
      <aside className="bike-list-sidebar">
        <BikeFilter filter={filters} onFilterChange={setFilters} />
      </aside>

      {/* Main Content */}
      <div className="bike-list-main">
        <div className="bike-list-header">
          <h1>Khám phá xe đạp</h1>
          {pagination && (
            <span className="bike-list-count">
              {pagination.totalCount} kết quả
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : bikes.length > 0 ? (
          <>
            <div className="bike-grid">
              {bikes.map((bike) => (
                <BikeCard key={bike.listingId} bike={bike} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                hasPrevious={pagination.hasPrevious}
                hasNext={pagination.hasNext}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>Không tìm thấy xe nào phù hợp với yêu cầu của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BikeList;
