"use client";
import React from "react";

/**
 * Switch Toggle Component
 */
export const Switch = ({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  error,
  description,
  ...props
}) => {
  return (
    <div className="w-full">
      <label
        className={`flex items-center justify-between gap-4 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex-1">
          {label && (
            <span className="block text-sm font-semibold text-neutral-700">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-xs text-neutral-500 mt-0.5">
              {description}
            </span>
          )}
        </div>

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
            className={`w-12 h-6 rounded-full transition-colors ${
              checked ? "bg-primary-500" : "bg-neutral-300"
            } ${!disabled ? "hover:opacity-80" : ""}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                checked ? "translate-x-6" : "translate-x-0.5"
              } mt-0.5`}
            ></div>
          </div>
        </div>
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
