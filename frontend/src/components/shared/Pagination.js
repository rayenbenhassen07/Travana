"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * Reusable Pagination Component
 *
 * @param {Number} currentPage - Current page number (1-indexed)
 * @param {Number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback when page changes
 * @param {Number} maxVisible - Maximum visible page numbers (default: 5)
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisible = 5,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200">
      {/* Page Info */}
      <div className="text-sm text-neutral-600">
        Page{" "}
        <span className="font-semibold text-neutral-800">{currentPage}</span> of{" "}
        <span className="font-semibold text-neutral-800">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
            currentPage === 1
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
          }`}
        >
          <FaChevronLeft size={12} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* First Page */}
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all cursor-pointer"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-2 text-neutral-400">...</span>}
          </>
        )}

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              currentPage === page
                ? "bg-neutral-700 text-white font-semibold"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last Page */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-neutral-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
            currentPage === totalPages
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <FaChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
