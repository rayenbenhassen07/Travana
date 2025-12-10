"use client";

import { useState } from "react";
import {
  FaTimes,
  FaSlidersH,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { SelectWithSearch } from "@/components/shared/inputs/SelectWithSearch";

const PRICE_RANGES = [
  { label: "Any price", min: null, max: null },
  { label: "Under $50", min: null, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $500", min: 200, max: 500 },
  { label: "$500+", min: 500, max: null },
];

const SORT_OPTIONS = [
  { value: null, label: "Par défaut" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

const ListingsFiltersBar = ({
  filters,
  categories,
  total,
  onFilterChange,
  onClearAll,
  onOpenMobileFilters,
}) => {
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.title,
  }));

  const hasActiveFilters =
    filters.city ||
    filters.category_id ||
    filters.min_price ||
    filters.max_price ||
    filters.guests ||
    filters.sort_by;

  const getCurrentPriceLabel = () => {
    if (!filters.min_price && !filters.max_price) return "Price";
    if (!filters.min_price) return `Under $${filters.max_price}`;
    if (!filters.max_price) return `$${filters.min_price}+`;
    return `$${filters.min_price} - $${filters.max_price}`;
  };

  const getCurrentSortLabel = () => {
    const option = SORT_OPTIONS.find((opt) => opt.value === filters.sort_by);
    return option ? option.label : "Trier";
  };

  const getActiveCategory = () =>
    categories.find((c) => c.id == filters.category_id);

  return (
    <div className="sticky top-0 bg-white border-b border-neutral-200 shadow-sm z-[25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-full hover:border-primary-500 hover:bg-primary-50 transition-all flex-shrink-0 cursor-pointer"
          >
            <FaSlidersH className="w-4 h-4 text-primary-500" />
            <span className="font-medium text-secondary-800">Filtres</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
            )}
          </button>

          {/* Category Filter - Desktop */}
          <div className="hidden sm:block flex-shrink-0 min-w-[180px] z-50">
            <SelectWithSearch
              name="category_id"
              value={filters.category_id || ""}
              onChange={(e) =>
                onFilterChange({ category_id: e.target.value || null })
              }
              options={categoryOptions}
              placeholder="Toutes catégories"
              searchable={true}
            />
          </div>

          {/* Price Filter */}
          <div className="relative flex-shrink-0 hidden md:block ">
            <button
              onClick={() => {
                setShowPriceDropdown(!showPriceDropdown);
                setShowSortDropdown(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl transition-all font-medium text-sm cursor-pointer ${
                filters.min_price || filters.max_price
                  ? "bg-primary-50 border-primary-500 text-primary-700"
                  : "bg-white border-neutral-200 hover:border-primary-400 text-secondary-800"
              }`}
            >
              <FaDollarSign className="w-4 h-4 text-neutral-400" />
              <span>{getCurrentPriceLabel()}</span>
            </button>

            {showPriceDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[45]"
                  onClick={() => setShowPriceDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-[70]">
                  {PRICE_RANGES.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onFilterChange({
                          min_price: range.min,
                          max_price: range.max,
                        });
                        setShowPriceDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors cursor-pointer ${
                        filters.min_price === range.min &&
                        filters.max_price === range.max
                          ? "text-primary-600 font-medium bg-primary-50"
                          : "text-secondary-800"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort by Price */}
          <div className="relative flex-shrink-0 hidden md:block z-[50]">
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowPriceDropdown(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl transition-all font-medium text-sm cursor-pointer ${
                filters.sort_by
                  ? "bg-primary-50 border-primary-500 text-primary-700"
                  : "bg-white border-neutral-200 hover:border-primary-400 text-secondary-800"
              }`}
            >
              {filters.sort_by === "price_desc" ? (
                <FaSortAmountDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <FaSortAmountUp className="w-4 h-4 text-neutral-400" />
              )}
              <span>{getCurrentSortLabel()}</span>
            </button>

            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[45]"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-[70]">
                  {SORT_OPTIONS.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onFilterChange({ sort_by: option.value });
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center gap-2 ${
                        filters.sort_by === option.value
                          ? "text-primary-600 font-medium bg-primary-50"
                          : "text-secondary-800"
                      }`}
                    >
                      {option.value === "price_asc" && (
                        <FaSortAmountUp className="w-3 h-3" />
                      )}
                      {option.value === "price_desc" && (
                        <FaSortAmountDown className="w-3 h-3" />
                      )}
                      {option.value === null && <span className="w-3" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Active Filters Pills */}
          {hasActiveFilters && (
            <div className="hidden lg:flex items-center gap-2 pl-2">
              <div className="w-px h-6 bg-neutral-200" />

              {/* {filters.city && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  {filters.city}
                  <button
                    onClick={() => onFilterChange({ city: "" })}
                    className="hover:text-primary-900 cursor-pointer"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}

              {getActiveCategory() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {getActiveCategory().title}
                  <button
                    onClick={() => onFilterChange({ category_id: null })}
                    className="hover:text-primary-900 cursor-pointer"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.guests && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  <FaUsers className="w-3 h-3" />
                  {filters.guests}+ invités
                  <button
                    onClick={() => onFilterChange({ guests: null })}
                    className="hover:text-primary-900 cursor-pointer"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(filters.min_price || filters.max_price) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {getCurrentPriceLabel()}
                  <button
                    onClick={() =>
                      onFilterChange({ min_price: null, max_price: null })
                    }
                    className="hover:text-primary-900 cursor-pointer"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.sort_by && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {getCurrentSortLabel()}
                  <button
                    onClick={() => onFilterChange({ sort_by: null })}
                    className="hover:text-primary-900 cursor-pointer"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )} */}

              <button
                onClick={onClearAll}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm ml-1 cursor-pointer"
              >
                Tout effacer
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="ml-auto text-sm text-neutral-500 flex-shrink-0 hidden lg:block">
            <span className="font-semibold text-secondary-800">{total}</span>{" "}
            {total === 1 ? "propriété" : "propriétés"} trouvée
            {total !== 1 && "s"}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export constants for use in other components
export { PRICE_RANGES, SORT_OPTIONS };
export default ListingsFiltersBar;
