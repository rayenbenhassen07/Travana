"use client";
import React from "react";
import { FaCalendar } from "react-icons/fa";

/**
 * DateInput Component - Custom styled date/datetime input
 */
export const DateInput = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText, // Added this
  required = false,
  disabled = false,
  type = "date", // 'date', 'datetime-local', 'time'
  min,
  max,
  placeholder,
  icon,
  ...props // Now safe: helperText is destructured above
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-neutral-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Icon */}
        {icon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        ) : (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <FaCalendar size={16} />
          </div>
        )}

        <input
          type={type}
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 text-sm border-2 rounded-xl transition-all outline-none ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          } ${
            disabled
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-white text-neutral-700"
          }`}
          {...props}
        />
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
          {helperText}
        </p>
      )}

      {/* Error */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
