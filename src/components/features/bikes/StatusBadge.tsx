import type { FC } from "react";
import { STATUS_MAP } from "../../../types/bike.types";
import "./bikes.css";

interface StatusBadgeProps {
  status?: number;
}

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const info = STATUS_MAP[status ?? 0] || STATUS_MAP[0];
  return (
    <span className={`status-badge status-${status ?? 0}`}>{info.label}</span>
  );
};

export default StatusBadge;
