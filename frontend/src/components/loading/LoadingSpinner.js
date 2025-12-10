import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "blue",
  className = "",
  variant = "spin",
}) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
    "2xl": "h-16 w-16",
  };

  const colorClasses = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600",
    green: "text-green-600",
    red: "text-red-600",
    orange: "text-orange-600",
    current: "text-current",
  };

  if (variant === "dots") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-full animate-bounce`}
        ></div>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-full animate-pulse ${className}`}
      ></div>
    );
  }

  // Default spin variant
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default LoadingSpinner;
