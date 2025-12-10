"use client";
import React from "react";
import { FaCheck } from "react-icons/fa";

/**
 * Checkbox Component
 */
export const Checkbox = ({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  error,
  ...props
}) => {
  return (
    <div className="w-full">
      <label
        className={`flex items-center gap-3 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="relative">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-5 h-5 border-2 rounded transition-all ${
              checked
                ? "bg-primary-500 border-primary-500"
                : "bg-white border-neutral-300"
            } ${
              !disabled && !checked ? "hover:border-primary-400" : ""
            } flex items-center justify-center`}
          >
            {checked && <FaCheck className="text-white text-xs" />}
          </div>
        </div>
        {label && (
          <span
            className={`text-sm font-medium ${
              checked ? "text-neutral-700" : "text-neutral-600"
            }`}
          >
            {label}
          </span>
        )}
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
