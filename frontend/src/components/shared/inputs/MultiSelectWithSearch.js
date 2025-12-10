"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch, FaCheck, FaTimes } from "react-icons/fa";

/**
 * Enhanced Multi-Select Component with Search
 */
export const MultiSelectWithSearch = ({
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

  // Get selected option labels
  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.length > 2
        ? `${selectedLabels.length} selected`
        : selectedLabels.join(", ")
      : placeholder;

  const handleToggle = (optionValue) => {
    let newValue;
    if (value.includes(optionValue)) {
      newValue = value.filter((v) => v !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }

    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
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
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Selected Values Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all outline-none text-left flex items-center justify-between ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        } ${
          disabled
            ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            : "bg-white text-neutral-700 cursor-pointer hover:border-primary-400"
        } ${value.length === 0 ? "text-neutral-400" : ""}`}
      >
        <span className="truncate">{displayText}</span>
        <div className="flex items-center gap-2">
          {value.length > 0 && !disabled && (
            <div
              onClick={handleClearAll}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1"
            >
              <FaTimes size={14} />
            </div>
          )}
          <FaChevronDown
            className={`text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Selected Items Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {options
            .filter((opt) => value.includes(opt.value))
            .map((option) => (
              <span
                key={option.value}
                className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <span>{option.label}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(option.value, e)}
                    className="hover:text-primary-900 transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </span>
            ))}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-neutral-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
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
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-primary-50 transition-colors flex items-center justify-between ${
                    value.includes(option.value)
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700"
                  }`}
                >
                  <span>{option.label}</span>
                  {value.includes(option.value) && (
                    <FaCheck className="text-primary-600" />
                  )}
                </button>
              ))
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
