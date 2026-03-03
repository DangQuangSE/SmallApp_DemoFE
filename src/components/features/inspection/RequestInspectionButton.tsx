import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { inspectionService } from "../../../services/inspection.service";
import "../../inspection/inspection.css";

interface RequestInspectionButtonProps {
  listingId: number;
  hasInspection: boolean;
  onSuccess: () => void;
}

const RequestInspectionButton: FC<RequestInspectionButtonProps> = ({
  listingId,
  hasInspection,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (hasInspection) {
    return <span className="badge-inspected">✅ Đã kiểm định</span>;
  }

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      await inspectionService.createRequest({ listingId });
      toast.success("Đã gửi yêu cầu kiểm định!");
      onSuccess();
    } catch {
      toast.error("Gửi yêu cầu thất bại. Có thể đã có yêu cầu đang chờ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="btn-inspect"
      onClick={handleRequest}
      disabled={isLoading}
    >
      {isLoading ? "Đang gửi..." : "🔍 Yêu cầu kiểm định"}
    </button>
  );
};

export default RequestInspectionButton;
