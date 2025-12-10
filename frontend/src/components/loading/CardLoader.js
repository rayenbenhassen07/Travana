import React from "react";
import SkeletonLoader from "./SkeletonLoader";

const CardLoader = ({
  count = 1,
  variant = "listing",
  className = "",
  grid = false,
  gridCols = 3,
}) => {
  const Card = () => {
    if (variant === "listing") {
      return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Image placeholder */}
          <div className="animate-pulse bg-gray-200 h-48 w-full"></div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div>

            {/* Location */}
            <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>

            {/* Price and rating */}
            <div className="flex justify-between items-center">
              <div className="animate-pulse bg-gray-200 h-5 w-1/3 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-5 w-1/4 rounded"></div>
            </div>

            {/* Features */}
            <div className="flex space-x-2">
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === "profile") {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 rounded-full h-16 w-16"></div>
            <div className="flex-1 space-y-2">
              <div className="animate-pulse bg-gray-200 h-5 w-1/2 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-1/3 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded"></div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === "simple") {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="animate-pulse bg-gray-200 h-6 w-full rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
        </div>
      );
    }

    return <SkeletonLoader variant="card" />;
  };

  const cards = Array.from({ length: count }, (_, index) => (
    <Card key={index} />
  ));

  if (grid) {
    const gridClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
      <div className={`grid ${gridClasses[gridCols]} gap-6 ${className}`}>
        {cards}
      </div>
    );
  }

  return <div className={`space-y-6 ${className}`}>{cards}</div>;
};

export default CardLoader;
