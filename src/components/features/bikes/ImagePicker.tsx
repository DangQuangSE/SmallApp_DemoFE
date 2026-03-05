import { useEffect, useMemo, useState, type FC } from "react";
import toast from "react-hot-toast";
import {
  MAX_IMAGES,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
} from "../../../constants/bike";
import "./bikes.css";

interface ImagePickerProps {
  files: File[];
  onAdd: (newFiles: File[]) => void;
  onRemove: (index: number) => void;
}

const ImagePicker: FC<ImagePickerProps> = ({ files, onAdd, onRemove }) => {
  // Create stable preview URLs — one per file
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Regenerate URLs when files change, and revoke old ones
  useMemo(() => {
    // Revoke previous URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    const valid = selected.filter((f) => {
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`${f.name} vượt quá 5 MB`);
        return false;
      }
      if (
        !ALLOWED_IMAGE_TYPES.includes(
          f.type as (typeof ALLOWED_IMAGE_TYPES)[number],
        )
      ) {
        toast.error(`${f.name} không đúng định dạng (chỉ .jpg, .png, .webp)`);
        return false;
      }
      return true;
    });

    if (files.length + valid.length > MAX_IMAGES) {
      toast.error(`Tối đa ${MAX_IMAGES} ảnh`);
      return;
    }

    onAdd(valid);
    e.target.value = "";
  };

  return (
    <div className="image-picker">
      <div className="image-picker-grid">
        {files.map((file, i) => (
          <div key={`${i}-${file.name}-${file.size}`} className="image-picker-item">
            <img src={previewUrls[i]} alt={`Preview ${i + 1}`} />
            {i === 0 && <span className="image-picker-badge">Ảnh bìa</span>}
            <button
              type="button"
              className="image-picker-remove"
              onClick={() => onRemove(i)}
            >
              ✕
            </button>
          </div>
        ))}

        {files.length < MAX_IMAGES && (
          <label className="image-picker-add">
            <span>+ Thêm ảnh</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleFileChange}
              hidden
            />
          </label>
        )}
      </div>
      <p className="image-picker-hint">
        {files.length}/{MAX_IMAGES} ảnh — Ảnh đầu tiên là ảnh bìa
      </p>
    </div>
  );
};

export default ImagePicker;
