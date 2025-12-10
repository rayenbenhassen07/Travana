"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch, FaCheck, FaTimes } from "react-icons/fa";

/**
 * MultiSelect Component with Checkboxes
 */
export const MultiSelect = ({
  label,
  name,
  value = [],
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = "Select options",
  searchable = true,
  maxDisplay = 2,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected options labels
  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const displayText =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length <= maxDisplay
      ? selectedOptions.map((opt) => opt.label).join(", ")
      : `${selectedOptions.length} selected`;

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { name, value: [] } });
    }
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Selected Value Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none text-left flex items-center justify-between gap-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        } ${
          disabled
            ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            : "bg-white text-neutral-700 cursor-pointer hover:border-primary-400"
        } ${value.length === 0 ? "text-neutral-400" : ""}`}
      >
        <span className="truncate flex-1">{displayText}</span>
        <div className="flex items-center gap-2">
          {value.length > 0 && !disabled && (
            <span
              onClick={handleClearAll}
              className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <FaTimes />
            </span>
          )}
          <FaChevronDown
            className={`text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-neutral-200 rounded-xl shadow-lg max-h-72 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-neutral-200">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Selected Count */}
          {value.length > 0 && (
            <div className="px-4 py-2 bg-primary-50 border-b border-primary-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-primary-700">
                {value.length} selected
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggle(option.value)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-primary-50 transition-colors flex items-center gap-3 ${
                      isSelected ? "bg-primary-50" : ""
                    }`}
                  >
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary-500 border-primary-500"
                          : "border-neutral-300"
                      }`}
                    >
                      {isSelected && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "text-primary-700 font-semibold"
                          : "text-neutral-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
