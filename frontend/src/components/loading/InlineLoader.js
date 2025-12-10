import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const InlineLoader = ({
  text = "Loading...",
  size = "sm",
  showText = true,
  className = "",
  spinnerColor = "current",
  textColor = "text-gray-600",
}) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <LoadingSpinner
        size={size}
        color={spinnerColor}
        className={showText ? "mr-2" : ""}
      />
      {showText && <span className={`text-sm ${textColor}`}>{text}</span>}
    </div>
  );
};

export default InlineLoader;
