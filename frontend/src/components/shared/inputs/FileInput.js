"use client";
import React from "react";

/**
 * Reusable FileInput Component for image uploads
 */
export const FileInput = ({
  label,
  name,
  onChange,
  accept = "image/*",
  error,
  required = false,
  disabled = false,
  currentFile = null,
  icon = null,
  ...props
}) => {
  const [preview, setPreview] = React.useState(null);

  React.useEffect(() => {
    if (currentFile && typeof currentFile === "string") {
      setPreview(currentFile);
    }
  }, [currentFile]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (onChange) onChange(e);
  };

  const handleRemove = () => {
    setPreview(null);
    const input = document.querySelector(`input[name="${name}"]`);
    if (input) input.value = "";
    if (onChange) {
      onChange({ target: { name, files: [] } });
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

      {preview ? (
        <div className="relative group">
          <img
            src={
              preview.startsWith("uploads/")
                ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${preview}`
                : preview
            }
            alt="Preview"
            className="w-full h-40 object-cover rounded-xl border-2 border-neutral-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            type="file"
            name={name}
            onChange={handleChange}
            accept={accept}
            disabled={disabled}
            className={`w-full px-4 py-3 ${
              icon ? "pl-10" : ""
            } border-2 rounded-xl transition-all outline-none cursor-pointer
            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
            file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 
            file:cursor-pointer hover:file:bg-primary-100 ${
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
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
