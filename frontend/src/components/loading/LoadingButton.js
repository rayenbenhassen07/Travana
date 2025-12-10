import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  loadingText = "Loading...",
  icon = null,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border border-transparent",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 border border-transparent",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-transparent",
  };

  const spinnerSizes = {
    sm: "xs",
    md: "sm",
    lg: "md",
    xl: "lg",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner
            size={spinnerSizes[size]}
            color="current"
            className="mr-2"
          />
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default LoadingButton;
