"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

/**
 * Reusable Select Component
 */
export const Select = React.forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      options = [],
      error,
      required = false,
      disabled = false,
      placeholder = "Select an option",
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get selected option label
    const selectedOption = options.find((opt) => opt.value == value);
    const selectedLabel = selectedOption ? selectedOption.label : placeholder;

    const handleSelect = (optionValue) => {
      // Update the hidden native select value
      const selectElement = dropdownRef.current?.querySelector("select");
      if (selectElement) {
        selectElement.value = optionValue;
        // Trigger native change event for react-hook-form
        const event = new Event("change", { bubbles: true });
        selectElement.dispatchEvent(event);
      }

      // Also call onChange if provided
      if (onChange) {
        onChange({ target: { name, value: optionValue } });
      }
      setIsOpen(false);
    };

    return (
      <div className="w-full relative" ref={dropdownRef}>
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Hidden native select for form compatibility */}
        <select
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          className="hidden"
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Select Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all outline-none text-left flex items-center justify-between ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          } ${
            disabled
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-white text-neutral-700 cursor-pointer hover:border-primary-400"
          } ${!value ? "text-neutral-400" : ""}`}
        >
          <span className="truncate">{selectedLabel}</span>
          <FaChevronDown
            className={`text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && !disabled && (
          <div className="absolute z-[100] w-full mt-2 bg-white border-2 border-neutral-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
            <div className="overflow-y-auto max-h-64">
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-2.5 text-sm text-left hover:bg-primary-50 transition-colors flex items-center justify-between cursor-pointer ${
                      option.value == value
                        ? "bg-primary-50 text-primary-700 font-semibold"
                        : "text-neutral-700"
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.value == value && (
                      <FaCheck className="text-primary-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                  No options available
                </div>
              )}
            </div>
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
