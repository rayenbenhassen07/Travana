"use client";

import {
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

const ListingsSearchBanner = ({ filters, onFilterChange }) => {
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const hasSearchFilters = filters.city || filters.check_in || filters.guests;

  if (!hasSearchFilters) return null;

  return (
    <div className="bg-primary-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {filters.city && (
              <div className="flex items-center gap-2 text-primary-700">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span className="font-medium">{filters.city}</span>
              </div>
            )}
            {filters.check_in && filters.check_out && (
              <div className="flex items-center gap-2 text-primary-700">
                <FaCalendarAlt className="w-4 h-4" />
                <span className="font-medium">
                  {formatDate(filters.check_in)} -{" "}
                  {formatDate(filters.check_out)}
                </span>
              </div>
            )}
            {filters.guests && (
              <div className="flex items-center gap-2 text-primary-700">
                <FaUsers className="w-4 h-4" />
                <span className="font-medium">
                  {filters.guests} {filters.guests > 1 ? "invités" : "invité"}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() =>
              onFilterChange({
                city: "",
                check_in: null,
                check_out: null,
                guests: null,
              })
            }
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
          >
            <FaTimes className="w-3 h-3" />
            Modifier la recherche
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingsSearchBanner;
