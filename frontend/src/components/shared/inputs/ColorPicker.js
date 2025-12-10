"use client";
import React, { useState } from "react";

/**
 * ColorPicker Component with Predefined Colors and Custom Input
 */
export const ColorPicker = ({
  label,
  name,
  value = "#000000",
  onChange,
  error,
  required = false,
  disabled = false,
  colors = [
    "#000000",
    "#ffffff",
    "#f97316",
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#64748b",
    "#78716c",
  ],
  ...props
}) => {
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color) => {
    setCustomColor(color);
    if (onChange) {
      onChange({ target: { name, value: color } });
    }
  };

  const handleCustomChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    if (onChange) {
      onChange({ target: { name, value: newColor } });
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {/* Predefined Color Grid */}
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => !disabled && handleColorSelect(color)}
              disabled={disabled}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                value === color
                  ? "border-primary-500 scale-110 shadow-lg"
                  : "border-neutral-300 hover:scale-105 hover:border-primary-400"
              } ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            >
              {value === color && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full border border-neutral-300"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name={name}
              value={customColor}
              onChange={handleCustomChange}
              disabled={disabled}
              placeholder="#000000"
              maxLength={7}
              className={`w-full px-4 py-3 pl-14 border-2 rounded-xl transition-all outline-none ${
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
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border-2 border-neutral-300"
              style={{ backgroundColor: customColor }}
            ></div>
          </div>

          {/* Native Color Picker */}
          <input
            type="color"
            value={customColor}
            onChange={handleCustomChange}
            disabled={disabled}
            className="w-14 h-12 rounded-xl border-2 border-neutral-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
