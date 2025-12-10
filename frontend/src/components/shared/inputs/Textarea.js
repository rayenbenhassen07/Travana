"use client";
import React from "react";

/**
 * Reusable Textarea Component
 */
export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all outline-none resize-none ${
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
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
