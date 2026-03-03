import { useState, useEffect, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { bikeService } from "../../services/bike.service";
import type {
  BikePostDto,
  BikeImageDto,
  UpdateBikeFormValues,
} from "../../types/bike.types";
import EditImageManager from "../../components/features/bikes/EditImageManager";
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
} from "../../constants/bike";
import "../../components/features/bikes/bikes.css";

const EditPostPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Image state (managed separately from form)
  const [existingImages, setExistingImages] = useState<BikeImageDto[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removeMediaIds, setRemoveMediaIds] = useState<number[]>([]);
  const [thumbnailMediaId, setThumbnailMediaId] = useState<
    number | undefined
  >();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBikeFormData>({
    resolver: zodResolver(createBikeSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) return;
    const loadListing = async () => {
      try {
        setIsLoading(true);
        const data: BikePostDto = await bikeService.getBikeDetail(Number(id));
        reset({
          title: data.title || "",
          description: data.description || "",
          price: data.price ? String(data.price) : "",
          address: data.address || "",
          brandId: "",
          typeId: "",
          modelName: data.modelName || "",
          serialNumber: data.serialNumber || "",
          color: data.color || "",
          condition: data.condition || "",
          frameSize: data.frameSize || "",
          frameMaterial: data.frameMaterial || "",
          wheelSize: data.wheelSize || "",
          brakeType: data.brakeType || "",
          weight: data.weight ? String(data.weight) : "",
          transmission: data.transmission || "",
        });
        setExistingImages(data.images || []);
      } catch (err) {
        console.error(err);
        toast.error("Không tìm thấy bài đăng.");
      } finally {
        setIsLoading(false);
      }
    };
    loadListing();
  }, [id, reset]);

  const onSubmit = async (data: CreateBikeFormData) => {
    // Check total images after save
    const activeExisting = existingImages.filter(
      (img) => !removeMediaIds.includes(img.mediaId),
    );
    if (activeExisting.length + newFiles.length === 0) {
      toast.error("Bài đăng phải có ít nhất 1 ảnh");
      return;
    }

    const values: UpdateBikeFormValues = {
      listingId: Number(id),
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
      imageFiles: [],
      existingImages,
      newFiles,
      removeMediaIds,
      thumbnailMediaId,
    };

    try {
      setIsSaving(true);
      const updated = await bikeService.updateBike(values);
      toast.success("Cập nhật bài đăng thành công!");
      navigate(ROUTES.BIKE_DETAIL.replace(":id", String(updated.listingId)));
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Cập nhật thất bại";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="post-form">
      <h1>Chỉnh sửa bài đăng</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <div className="form-section">
          <h3>Thông tin cơ bản</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="edit-title">
                Tiêu đề <span className="required">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                className="form-control"
                maxLength={200}
                {...register("title")}
              />
              {errors.title && (
                <span className="form-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-price">
                Giá (VNĐ) <span className="required">*</span>
              </label>
              <input
                id="edit-price"
                type="number"
                className="form-control"
                min={1}
                {...register("price")}
              />
              {errors.price && (
                <span className="form-error">{errors.price.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-address">Địa chỉ</label>
              <input
                id="edit-address"
                type="text"
                className="form-control"
                maxLength={255}
                {...register("address")}
              />
              {errors.address && (
                <span className="form-error">{errors.address.message}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="edit-description">Mô tả</label>
              <textarea
                id="edit-description"
                className="form-control"
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
              <label htmlFor="edit-modelName">Model</label>
              <input
                id="edit-modelName"
                type="text"
                className="form-control"
                {...register("modelName")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-serialNumber">Serial Number</label>
              <input
                id="edit-serialNumber"
                type="text"
                className="form-control"
                {...register("serialNumber")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-color">Màu sắc</label>
              <input
                id="edit-color"
                type="text"
                className="form-control"
                {...register("color")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-condition">Tình trạng</label>
              <select
                id="edit-condition"
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
              <label htmlFor="edit-brandId">Brand ID</label>
              <input
                id="edit-brandId"
                type="number"
                className="form-control"
                min={1}
                {...register("brandId")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-typeId">Type ID</label>
              <input
                id="edit-typeId"
                type="number"
                className="form-control"
                min={1}
                {...register("typeId")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-frameSize">Size khung</label>
              <select
                id="edit-frameSize"
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
              <label htmlFor="edit-frameMaterial">Chất liệu khung</label>
              <select
                id="edit-frameMaterial"
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
              <label htmlFor="edit-wheelSize">Cỡ bánh</label>
              <select
                id="edit-wheelSize"
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
              <label htmlFor="edit-brakeType">Loại phanh</label>
              <select
                id="edit-brakeType"
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
              <label htmlFor="edit-weight">Trọng lượng (kg)</label>
              <input
                id="edit-weight"
                type="number"
                className="form-control"
                step="0.1"
                min={0}
                {...register("weight")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-transmission">Bộ truyền động</label>
              <input
                id="edit-transmission"
                type="text"
                className="form-control"
                {...register("transmission")}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h3>Hình ảnh</h3>
          <EditImageManager
            existingImages={existingImages}
            newFiles={newFiles}
            removeMediaIds={removeMediaIds}
            thumbnailMediaId={thumbnailMediaId}
            onMarkRemove={(mediaId) =>
              setRemoveMediaIds((prev) => [...prev, mediaId])
            }
            onUndoRemove={(mediaId) =>
              setRemoveMediaIds((prev) => prev.filter((mId) => mId !== mediaId))
            }
            onSetThumbnail={(mediaId) => setThumbnailMediaId(mediaId)}
            onAddFiles={(files) => setNewFiles((prev) => [...prev, ...files])}
            onRemoveNewFile={(index) =>
              setNewFiles((prev) => prev.filter((_, i) => i !== index))
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
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
