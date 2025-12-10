import React from "react";

const SkeletonLoader = ({
  variant = "text",
  lines = 3,
  className = "",
  animate = true,
}) => {
  const baseClasses = `bg-gray-200 ${animate ? "animate-pulse" : ""}`;

  const SkeletonLine = ({ width = "full", height = "4" }) => (
    <div
      className={`${baseClasses} rounded h-${height} w-${width} ${className}`}
    ></div>
  );

  if (variant === "text") {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonLine
            key={index}
            width={index === lines - 1 ? "3/4" : "full"}
          />
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div
        className={`${baseClasses} rounded-full h-12 w-12 ${className}`}
      ></div>
    );
  }

  if (variant === "card") {
    return (
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <div className={`${baseClasses} rounded h-48 w-full`}></div>
        <div className="space-y-2">
          <SkeletonLine height="6" />
          <SkeletonLine width="3/4" />
          <SkeletonLine width="1/2" />
        </div>
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="flex space-x-4">
        <div className={`${baseClasses} rounded-full h-12 w-12`}></div>
        <div className="flex-1 space-y-2">
          <SkeletonLine height="4" width="1/4" />
          <SkeletonLine height="3" width="1/2" />
        </div>
      </div>
    );
  }

  if (variant === "button") {
    return (
      <div className={`${baseClasses} rounded-md h-10 w-24 ${className}`}></div>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <SkeletonLine width="1/4" />
            <SkeletonLine width="1/3" />
            <SkeletonLine width="1/4" />
            <SkeletonLine width="1/6" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "listing") {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className={`${baseClasses} h-48 w-full`}></div>
        <div className="p-4 space-y-3">
          <SkeletonLine height="6" width="3/4" />
          <SkeletonLine height="4" width="1/2" />
          <div className="flex justify-between items-center">
            <SkeletonLine height="5" width="1/3" />
            <SkeletonLine height="8" width="1/4" />
          </div>
        </div>
      </div>
    );
  }

  // Default rectangle
  return (
    <div className={`${baseClasses} rounded h-4 w-full ${className}`}></div>
  );
};

export default SkeletonLoader;
