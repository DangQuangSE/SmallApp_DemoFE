import { useState, useEffect, type FC } from "react";
import type { BikeFilterDto } from "../../../types/bike.types";
import { bikeService } from "../../../services/bike.service";
import "./bikes.css";

interface BikeFilterProps {
  filter: BikeFilterDto;
  onFilterChange: (filter: BikeFilterDto) => void;
}

const CONDITIONS = ["New", "Like New", "Used"];
const FRAME_SIZES = ["XS", "S", "M", "L", "XL"];
const WHEEL_SIZES = ["26", "27.5", "29", "700c"];
const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
];

const BikeFilter: FC<BikeFilterProps> = ({ filter, onFilterChange }) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    bikeService.getBrands().then(setBrands).catch(console.error);
    bikeService.getTypes().then(setTypes).catch(console.error);
  }, []);

  const handleChange = (key: keyof BikeFilterDto, value: string | number) => {
    onFilterChange({
      ...filter,
      [key]: value === "" ? undefined : value,
      page: key !== "page" ? 1 : (value as number), // reset page on filter change
    });
  };

  const handleReset = () => {
    onFilterChange({ page: 1, pageSize: filter.pageSize || 12 });
  };

  return (
    <div className="bike-filter">
      <div className="bike-filter-header">
        <h3>Bộ lọc</h3>
        <button className="filter-reset-btn" onClick={handleReset}>
          Xóa lọc
        </button>
      </div>

      {/* Search */}
      <div className="filter-group">
        <label>Tìm kiếm</label>
        <input
          type="text"
          placeholder="Tên xe, mô tả..."
          value={filter.searchTerm || ""}
          onChange={(e) => handleChange("searchTerm", e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Brand */}
      <div className="filter-group">
        <label>Thương hiệu</label>
        <select
          value={filter.brandId || ""}
          onChange={(e) =>
            handleChange("brandId", Number(e.target.value) || "")
          }
          className="filter-select"
          title="Chọn thương hiệu"
        >
          <option value="">Tất cả</option>
          {brands.map((brand, i) => (
            <option key={brand} value={i + 1}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div className="filter-group">
        <label>Loại xe</label>
        <select
          value={filter.typeId || ""}
          onChange={(e) => handleChange("typeId", Number(e.target.value) || "")}
          className="filter-select"
          title="Chọn loại xe"
        >
          <option value="">Tất cả</option>
          {types.map((type, i) => (
            <option key={type} value={i + 1}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div className="filter-group">
        <label>Tình trạng</label>
        <select
          value={filter.condition || ""}
          onChange={(e) => handleChange("condition", e.target.value)}
          className="filter-select"
          title="Chọn tình trạng"
        >
          <option value="">Tất cả</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="filter-group">
        <label>Khoảng giá (VNĐ)</label>
        <div className="filter-price-range">
          <input
            type="number"
            placeholder="Từ"
            value={filter.minPrice || ""}
            onChange={(e) =>
              handleChange("minPrice", Number(e.target.value) || "")
            }
            className="filter-input"
            min={0}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="Đến"
            value={filter.maxPrice || ""}
            onChange={(e) =>
              handleChange("maxPrice", Number(e.target.value) || "")
            }
            className="filter-input"
            min={0}
          />
        </div>
      </div>

      {/* Address */}
      <div className="filter-group">
        <label>Khu vực</label>
        <input
          type="text"
          placeholder="VD: Hà Nội, TP.HCM..."
          value={filter.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Frame Size */}
      <div className="filter-group">
        <label>Kích cỡ khung</label>
        <select
          value={filter.frameSize || ""}
          onChange={(e) => handleChange("frameSize", e.target.value)}
          className="filter-select"
          title="Chọn kích cỡ khung"
        >
          <option value="">Tất cả</option>
          {FRAME_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Wheel Size */}
      <div className="filter-group">
        <label>Cỡ bánh xe</label>
        <select
          value={filter.wheelSize || ""}
          onChange={(e) => handleChange("wheelSize", e.target.value)}
          className="filter-select"
          title="Chọn cỡ bánh xe"
        >
          <option value="">Tất cả</option>
          {WHEEL_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label>Sắp xếp</label>
        <select
          value={filter.sortBy || "newest"}
          onChange={(e) => handleChange("sortBy", e.target.value)}
          className="filter-select"
          title="Sắp xếp theo"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BikeFilter;
