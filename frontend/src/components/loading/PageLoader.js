import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const PageLoader = ({
  message = "Loading...",
  overlay = true,
  size = "xl",
  showMessage = true,
  className = "",
  backdrop = "light", // light, dark, blur
}) => {
  const backdropClasses = {
    light: "bg-white/80",
    dark: "bg-gray-900/80",
    blur: "bg-white/80 backdrop-blur-sm",
  };

  if (overlay) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClasses[backdrop]} ${className}`}
      >
        <div className="text-center">
          <LoadingSpinner size={size} color="blue" className="mx-auto" />
          {showMessage && (
            <p className="mt-4 text-lg font-medium text-gray-600">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <LoadingSpinner size={size} color="blue" className="mx-auto" />
      {showMessage && (
        <p className="mt-4 text-lg font-medium text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default PageLoader;
