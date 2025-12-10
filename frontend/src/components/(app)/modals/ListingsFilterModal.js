"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FaTimes,
  FaHome,
  FaDollarSign,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { SelectWithSearch } from "@/components/shared/inputs/SelectWithSearch";
import {
  PRICE_RANGES,
  SORT_OPTIONS,
} from "@/components/(app)/listings/ListingsFiltersBar";

const ListingsFilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  categoryOptions,
  total,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleClearAll = useCallback(() => {
    onClearAll();
  }, [onClearAll]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 cursor-pointer transition-opacity duration-300 ${
          showModal ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col transform transition-transform duration-300 ease-out ${
          showModal ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-neutral-200 flex items-center justify-between z-10 rounded-t-3xl">
          <h2 className="text-lg font-semibold text-secondary-900">Filtres</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-6 space-y-6">
            {/* Category */}
            <div className="relative z-[60]">
              <h3 className="font-medium text-secondary-900 mb-3 flex items-center gap-2">
                <FaHome className="w-4 h-4 text-primary-500" />
                Catégorie
              </h3>
              <SelectWithSearch
                name="category_id_mobile"
                value={filters.category_id || ""}
                onChange={(e) =>
                  onFilterChange({ category_id: e.target.value || null })
                }
                options={categoryOptions}
                placeholder="Toutes catégories"
                searchable={true}
              />
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-medium text-secondary-900 mb-3 flex items-center gap-2">
                <FaDollarSign className="w-4 h-4 text-primary-500" />
                Gamme de prix
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PRICE_RANGES.map((range, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      onFilterChange({
                        min_price: range.min,
                        max_price: range.max,
                      })
                    }
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium cursor-pointer ${
                      filters.min_price === range.min &&
                      filters.max_price === range.max
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-secondary-800"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort by Price */}
            <div>
              <h3 className="font-medium text-secondary-900 mb-3 flex items-center gap-2">
                <FaSortAmountDown className="w-4 h-4 text-primary-500" />
                Trier par prix
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {SORT_OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onFilterChange({ sort_by: option.value })}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium cursor-pointer flex items-center gap-2 ${
                      filters.sort_by === option.value
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-secondary-800"
                    }`}
                  >
                    {option.value === "price_asc" && (
                      <FaSortAmountUp className="w-4 h-4" />
                    )}
                    {option.value === "price_desc" && (
                      <FaSortAmountDown className="w-4 h-4" />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-neutral-200 flex items-center gap-3">
          <button
            onClick={handleClearAll}
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-xl font-medium text-secondary-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Tout effacer
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Voir {total} résultats
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingsFilterModal;
