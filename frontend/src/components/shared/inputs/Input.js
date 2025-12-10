"use client";
import React from "react";

/**
 * Reusable Input Component
 *
 * @param {String} label - Input label
 * @param {String} type - Input type (text, email, password, etc.)
 * @param {String} name - Input name
 * @param {String} value - Input value
 * @param {Function} onChange - Change handler
 * @param {String} placeholder - Placeholder text
 * @param {String} error - Error message
 * @param {Boolean} required - Required field
 * @param {Boolean} disabled - Disabled state
 * @param {ReactNode} icon - Icon component
 */
export const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon = null,
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
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 text-sm ${
            icon ? "pl-10" : ""
          } border-2 rounded-xl transition-all outline-none ${
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
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
