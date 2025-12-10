"use client";
import React, { useState, useEffect } from "react";
import { FaTrash, FaImage } from "react-icons/fa";

/**
 * Simple Image Upload Component - Single or Multiple
 */
export const SimpleImageUpload = ({
  label,
  name,
  value = null,
  onChange,
  error,
  required = false,
  disabled = false,
  accept = "image/*",
  multiple = false,
  maxSize = 5, // MB
  ...props
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (value) {
      if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else if (typeof value === "string") {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        if (value.startsWith("http")) {
          setPreview(value);
        } else {
          setPreview(`${apiUrl}/storage/${value}`);
        }
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      alert(`File size must be less than ${maxSize}MB`);
      e.target.value = "";
      return;
    }

    // Create synthetic event with File object as value
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: file,
          files: [file],
        },
      };
      onChange(syntheticEvent);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: null,
          files: [],
        },
      };
      onChange(syntheticEvent);
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
        {preview ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-neutral-200 group bg-neutral-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
            <div className="w-full h-full hidden items-center justify-center">
              <FaImage className="text-neutral-300 text-3xl" />
            </div>

            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        ) : (
          <label className="block w-full border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FaImage className="text-primary-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700">
                  Click to upload image
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Max size: {maxSize}MB
                </p>
              </div>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
              {...props}
            />
          </label>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
