import type { FC } from "react";
import "./bikes.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        ← Trước
      </button>

      <div className="pagination-pages">
        {getPageNumbers().map((p, i) =>
          typeof p === "string" ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`pagination-page ${p === page ? "active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        className="pagination-btn"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Sau →
      </button>
    </div>
  );
};

export default Pagination;
