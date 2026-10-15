import Image from "next/image";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    // Handle the case when totalPages is 1
    if (totalPages === 1) {
      return [1];
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="sticky bottom-0">
      {/* Desktop Pagination */}
      <div
        className={`flex sticky bottom-0 bg-white py-5 items-center justify-center gap-2 ${className}`}
      >
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            isPreviousDisabled
              ? "bg-[#F5F7F8] cursor-not-allowed"
              : "bg-[#F5F7F8]"
          }`}
          aria-label="صفحه قبلی"
        >
          <Image
            src={"/assets/icons/chevron-left.svg"}
            width={16}
            height={16}
            alt="arrow"
            className="rotate-180"
          />
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F5F7F8] text-sm">
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(page as number)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-[#F5F7F8] border border-primary"
                    : "bg-[#F5F7F8]"
                }`}
                aria-label={`صفحه ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            isNextDisabled ? "bg-[#F5F7F8] cursor-not-allowed" : "bg-[#F5F7F8]"
          }`}
          aria-label="صفحه بعدی"
        >
          <Image
            src={"/assets/icons/chevron-left.svg"}
            width={16}
            height={16}
            alt="arrow"
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
