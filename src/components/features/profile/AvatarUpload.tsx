import { useState, useRef, type FC, type ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./profile.css";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

interface AvatarUploadProps {
  avatarUrl?: string | null;
  fullName?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
}

const AvatarUpload: FC<AvatarUploadProps> = ({
  avatarUrl,
  fullName,
  onUpload,
  onRemove,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Client-side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Kích thước file không được vượt quá 5 MB");
      return;
    }

    setError("");
    setUploading(true);
    try {
      await onUpload(file);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Upload thất bại";
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Bạn có chắc muốn xoá ảnh đại diện?")) return;

    setError("");
    setUploading(true);
    try {
      await onRemove();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Xoá ảnh thất bại";
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">{initials}</div>
        )}

        {uploading && (
          <div className="avatar-overlay">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        )}
      </div>

      <div className="avatar-actions">
        <label
          htmlFor="avatar-file-input"
          className="avatar-btn avatar-btn-upload"
        >
          <FontAwesomeIcon icon={faCamera} />
          <span>{uploading ? "Đang tải..." : "Đổi ảnh"}</span>
        </label>
        <input
          id="avatar-file-input"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          hidden
        />
        {avatarUrl && (
          <button
            type="button"
            className="avatar-btn avatar-btn-remove"
            onClick={handleRemove}
            disabled={uploading}
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Xoá</span>
          </button>
        )}
      </div>

      {error && <p className="avatar-error">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
