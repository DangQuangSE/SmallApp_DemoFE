import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { bikeService } from "../../services/bike.service";
import type { CreateBikeFormValues } from "../../types/bike.types";
import ImagePicker from "../../components/features/bikes/ImagePicker";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import {
  createBikeSchema,
  type CreateBikeFormData,
} from "../../utils/validators";
import {
  BIKE_CONDITIONS,
  FRAME_SIZES,
  FRAME_MATERIALS,
  WHEEL_SIZES,
  BRAKE_TYPES,
  MAX_IMAGES,
} from "../../constants/bike";
import "../../components/features/bikes/bikes.css";

const CreatePostPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBikeFormData>({
    resolver: zodResolver(createBikeSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: CreateBikeFormData) => {
    if (imageFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }
    if (imageFiles.length > MAX_IMAGES) {
      toast.error(`Tối đa ${MAX_IMAGES} ảnh`);
      return;
    }

    const values: CreateBikeFormValues = {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      price: Number(data.price),
      address: data.address?.trim() || undefined,
      brandId: data.brandId ? Number(data.brandId) : undefined,
      typeId: data.typeId ? Number(data.typeId) : undefined,
      modelName: data.modelName?.trim() || undefined,
      serialNumber: data.serialNumber?.trim() || undefined,
      color: data.color?.trim() || undefined,
      condition: data.condition || undefined,
      frameSize: data.frameSize || undefined,
      frameMaterial: data.frameMaterial || undefined,
      wheelSize: data.wheelSize || undefined,
      brakeType: data.brakeType || undefined,
      weight: data.weight ? Number(data.weight) : undefined,
      transmission: data.transmission?.trim() || undefined,
      imageFiles,
    };

    try {
      setIsLoading(true);
      const created = await bikeService.createBike(values);
      toast.success("Đăng bài thành công!");
      navigate(ROUTES.BIKE_DETAIL.replace(":id", String(created.listingId)));
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Đăng bài thất bại";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-form">
      <h1>Đăng bài bán xe</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <div className="form-section">
          <h3>Thông tin cơ bản</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="create-title">
                Tiêu đề <span className="required">*</span>
              </label>
              <input
                id="create-title"
                type="text"
                className="form-control"
                placeholder="VD: Xe đạp Giant Escape 3 - Còn mới 95%"
                maxLength={200}
                {...register("title")}
              />
              {errors.title && (
                <span className="form-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="create-price">
                Giá (VNĐ) <span className="required">*</span>
              </label>
              <input
                id="create-price"
                type="number"
                className="form-control"
                placeholder="VD: 5500000"
                min={1}
                {...register("price")}
              />
              {errors.price && (
                <span className="form-error">{errors.price.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="create-address">Địa chỉ</label>
              <input
                id="create-address"
                type="text"
                className="form-control"
                placeholder="VD: Quận 1, TP.HCM"
                maxLength={255}
                {...register("address")}
              />
              {errors.address && (
                <span className="form-error">{errors.address.message}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="create-description">Mô tả</label>
              <textarea
                id="create-description"
                className="form-control"
                placeholder="Mô tả chi tiết về xe..."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <span className="form-error">{errors.description.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Bike Specs */}
        <div className="form-section">
          <h3>Thông số xe</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="create-modelName">Model</label>
              <input
                id="create-modelName"
                type="text"
                className="form-control"
                placeholder="VD: Escape 3"
                {...register("modelName")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-serialNumber">Serial Number</label>
              <input
                id="create-serialNumber"
                type="text"
                className="form-control"
                placeholder="VD: GNT2024001"
                {...register("serialNumber")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-color">Màu sắc</label>
              <input
                id="create-color"
                type="text"
                className="form-control"
                placeholder="VD: Đen"
                {...register("color")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-condition">Tình trạng</label>
              <select
                id="create-condition"
                className="form-control"
                title="Chọn tình trạng"
                {...register("condition")}
              >
                <option value="">Chọn tình trạng</option>
                {BIKE_CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="create-brandId">Brand ID</label>
              <input
                id="create-brandId"
                type="number"
                className="form-control"
                placeholder="VD: 1"
                min={1}
                {...register("brandId")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-typeId">Type ID</label>
              <input
                id="create-typeId"
                type="number"
                className="form-control"
                placeholder="VD: 1"
                min={1}
                {...register("typeId")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-frameSize">Size khung</label>
              <select
                id="create-frameSize"
                className="form-control"
                title="Chọn size khung"
                {...register("frameSize")}
              >
                <option value="">Chọn size</option>
                {FRAME_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="create-frameMaterial">Chất liệu khung</label>
              <select
                id="create-frameMaterial"
                className="form-control"
                title="Chọn chất liệu khung"
                {...register("frameMaterial")}
              >
                <option value="">Chọn chất liệu</option>
                {FRAME_MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="create-wheelSize">Cỡ bánh</label>
              <select
                id="create-wheelSize"
                className="form-control"
                title="Chọn cỡ bánh"
                {...register("wheelSize")}
              >
                <option value="">Chọn cỡ bánh</option>
                {WHEEL_SIZES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="create-brakeType">Loại phanh</label>
              <select
                id="create-brakeType"
                className="form-control"
                title="Chọn loại phanh"
                {...register("brakeType")}
              >
                <option value="">Chọn loại phanh</option>
                {BRAKE_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="create-weight">Trọng lượng (kg)</label>
              <input
                id="create-weight"
                type="number"
                className="form-control"
                placeholder="VD: 11.5"
                step="0.1"
                min={0}
                {...register("weight")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-transmission">Bộ truyền động</label>
              <input
                id="create-transmission"
                type="text"
                className="form-control"
                placeholder="VD: Shimano Altus 3x8"
                {...register("transmission")}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h3>
            Hình ảnh <span className="required">*</span>
          </h3>
          <ImagePicker
            files={imageFiles}
            onAdd={(newFiles) =>
              setImageFiles((prev) => [...prev, ...newFiles])
            }
            onRemove={(index) =>
              setImageFiles((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(ROUTES.SELLER_LISTINGS)}
          >
            Hủy
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Đang đăng..." : "Đăng bài"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
