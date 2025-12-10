"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

/**
 * MultiImageInput Component - Gallery Upload with Preview, Reorder, Delete
 */
export const MultiImageInput = ({
  label,
  name,
  value = [],
  onChange,
  error,
  required = false,
  disabled = false,
  maxImages = 10,
  storagePath = "/storage/images",
  accept = "image/*",
  ...props
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});

  // Create and cleanup preview URLs
  useEffect(() => {
    const newPreviewUrls = {};

    value.forEach((image, index) => {
      if (image?.file instanceof File) {
        // Create URL for File objects
        newPreviewUrls[index] = URL.createObjectURL(image.file);
      } else if (image instanceof File) {
        // Direct File object
        newPreviewUrls[index] = URL.createObjectURL(image);
      }
    });

    setPreviewUrls(newPreviewUrls);

    // Cleanup function
    return () => {
      Object.values(newPreviewUrls).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [value]);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding new files exceeds max limit
    if (value.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Simply add File objects - no need for base64 conversion
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
    }));

    if (onChange) {
      onChange({ target: { name, value: [...value, ...newImages] } });
    }
  };

  // Handle image deletion
  const handleDelete = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  // Handle drag start
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newValue = [...value];
    const draggedItem = newValue[draggedIndex];
    newValue.splice(draggedIndex, 1);
    newValue.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Get preview URL
  const getPreviewUrl = (image, index) => {
    // Use cached preview URL if available
    if (previewUrls[index]) {
      return previewUrls[index];
    }

    // If it's a string URL (from backend)
    if (typeof image === "string") {
      // Already has http/https
      if (image.startsWith("http")) {
        return image;
      }
      // Path from storage
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      return `${apiUrl}/storage/${image}`;
    }

    // If it's an object with preview property
    if (image?.preview) {
      return image.preview;
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
              const previewUrl = getPreviewUrl(image, index);

              return (
                <div
                  key={image.id || index}
                  draggable={!disabled}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 border-neutral-200 group cursor-move ${
                    draggedIndex === index ? "opacity-50" : ""
                  } ${disabled ? "cursor-not-allowed" : ""}`}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", previewUrl);
                        e.target.src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f5f5f5" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">No Preview</text></svg>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                      <FaPlus className="text-neutral-400 text-2xl" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover:scale-100"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  {/* Image Number */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Button */}
        {value.length < maxImages && !disabled && (
          <label
            className={`block w-full border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
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
