"use client";
import React, { useState } from "react";
import { FaTrash, FaPlus, FaImage } from "react-icons/fa";

/**
 * Simple MultiImageInput Component - Gallery Upload with Preview and Delete
 */
export const SimpleMultiImageInput = ({
  label,
  name,
  value = [],
  onChange,
  error,
  required = false,
  disabled = false,
  maxImages = 10,
  accept = "image/*",
  ...props
}) => {
  const [previews, setPreviews] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding new files exceeds max limit
    if (value.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Add new files to the value array
    const updatedValue = [...value, ...files];

    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: updatedValue,
          files: updatedValue,
        },
      };
      onChange(syntheticEvent);
    }

    // Reset file input
    e.target.value = "";
  };

  // Handle image deletion
  const handleDelete = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: newValue,
          files: newValue,
        },
      };
      onChange(syntheticEvent);
    }
  };

  // Get preview URL
  const getPreviewUrl = (image) => {
    // If it's a File object
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    // If it's a string URL (from backend)
    if (typeof image === "string") {
      if (image.startsWith("http")) {
        return image;
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      return `${apiUrl}/storage/${image}`;
    }
    return "";
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
        {/* Image Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {value.map((image, index) => {
              const previewUrl = getPreviewUrl(image);

              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-neutral-200 group bg-neutral-50"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-neutral-300 text-3xl" />
                    </div>
                  )}

                  {/* Delete Button */}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}

                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Button */}
        {value.length < maxImages && !disabled && (
          <label className="block w-full border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FaPlus className="text-primary-600 text-xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700">
                  Upload Images
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {value.length} of {maxImages} images uploaded
                </p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept={accept}
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
              {...props}
            />
          </label>
        )}

        {/* Max Reached Message */}
        {value.length >= maxImages && (
          <div className="text-center text-sm text-neutral-500 py-3 bg-neutral-50 rounded-xl border border-neutral-200">
            Maximum {maxImages} images reached
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
