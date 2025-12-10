"use client";
import React from "react";

/**
 * Reusable Button Component
 */
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon = null,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-100",
    secondary:
      "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 focus:ring-neutral-100",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-100",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-100",
    outline:
      "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-100",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold rounded-xl transition-all
        focus:ring-2 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
