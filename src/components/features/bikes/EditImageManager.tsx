import { type FC } from "react";
import type { BikeImageDto } from "../../../types/bike.types";
import ImagePicker from "./ImagePicker";
import "./bikes.css";

interface EditImageManagerProps {
  existingImages: BikeImageDto[];
  newFiles: File[];
  removeMediaIds: number[];
  thumbnailMediaId?: number;
  onMarkRemove: (mediaId: number) => void;
  onUndoRemove: (mediaId: number) => void;
  onSetThumbnail: (mediaId: number) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveNewFile: (index: number) => void;
}

const MAX_IMAGES = 10;

const EditImageManager: FC<EditImageManagerProps> = ({
  existingImages,
  newFiles,
  removeMediaIds,
  thumbnailMediaId,
  onMarkRemove,
  onUndoRemove,
  onSetThumbnail,
  onAddFiles,
  onRemoveNewFile,
}) => {
  const activeExisting = existingImages.filter(
    (img) => !removeMediaIds.includes(img.mediaId),
  );

  const totalAfterSave = activeExisting.length + newFiles.length;

  return (
    <div className="edit-images">
      <h4>Ảnh hiện tại ({activeExisting.length})</h4>
      <div className="image-picker-grid">
        {existingImages.map((img) => {
          const isRemoved = removeMediaIds.includes(img.mediaId);
          const isThumb =
            img.mediaId === thumbnailMediaId ||
            (!thumbnailMediaId && img.isThumbnail);

          return (
            <div
              key={img.mediaId}
              className={`image-picker-item ${isRemoved ? "removed" : ""}`}
            >
              <img src={img.mediaUrl} alt="" />

              {isThumb && !isRemoved && (
                <span className="image-picker-badge">Ảnh bìa</span>
              )}

              {!isRemoved ? (
                <div className="image-item-actions">
                  {!isThumb && (
                    <button
                      type="button"
                      className="btn-thumb"
                      onClick={() => onSetThumbnail(img.mediaId)}
                      title="Đặt ảnh bìa"
                    >
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    className="image-picker-remove"
                    onClick={() => onMarkRemove(img.mediaId)}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-undo"
                  onClick={() => onUndoRemove(img.mediaId)}
                >
                  Hoàn tác
                </button>
              )}
            </div>
          );
        })}
      </div>

      <h4 className="edit-images-subtitle">Ảnh mới</h4>
      <ImagePicker
        files={newFiles}
        onAdd={onAddFiles}
        onRemove={onRemoveNewFile}
      />

      <p className="image-picker-hint">
        Tổng ảnh sau khi lưu: {totalAfterSave} / {MAX_IMAGES}
      </p>
    </div>
  );
};

export default EditImageManager;
