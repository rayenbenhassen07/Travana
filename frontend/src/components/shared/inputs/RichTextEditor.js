"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

/**
 * RichTextEditor Component using React Quill (React 19 Compatible)
 * Fixed: Editor container now properly handles overflow when large text is pasted
 */
export const RichTextEditor = ({
  label,
  name,
  value = "",
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = "Start typing...",
  height = "500px",
  ...props
}) => {
  // Dynamically import ReactQuill with SSR disabled
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill-new"), {
        ssr: false,
        loading: () => (
          <div
            className="w-full border-2 border-neutral-200 rounded-xl p-4 bg-neutral-50 animate-pulse"
            style={{ height }}
          >
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ),
      }),
    []
  );

  // Quill toolbar configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "direction",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  const handleChange = (content) => {
    // Call onChange with the content directly (as the parent expects)
    if (onChange) {
      onChange(content);
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
      <div
        className={`border-2 rounded-xl overflow-hidden transition-all ${
          error
            ? "border-red-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
            : "border-neutral-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100"
        } ${disabled ? "bg-neutral-100 opacity-60" : "bg-white"}`}
      >
        <style jsx global>{`
          .rich-text-editor-wrapper {
            height: ${height};
          }
          .rich-text-editor-wrapper .ql-container {
            height: calc(${height} - 42px);
            overflow-y: auto;
            font-family: inherit;
          }
          .rich-text-editor-wrapper .ql-editor {
            min-height: calc(${height} - 42px);
            max-height: none;
          }
          .rich-text-editor-wrapper .ql-toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            background: white;
            border-bottom: 1px solid #e5e7eb;
          }
          /* Custom scrollbar */
          .rich-text-editor-wrapper .ql-container::-webkit-scrollbar {
            width: 8px;
          }
          .rich-text-editor-wrapper .ql-container::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .rich-text-editor-wrapper .ql-container::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .rich-text-editor-wrapper
            .ql-container::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
        <div className="rich-text-editor-wrapper">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            readOnly={disabled}
            {...props}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
