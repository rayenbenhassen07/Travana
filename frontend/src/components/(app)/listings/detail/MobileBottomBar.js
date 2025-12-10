"use client";

import React from "react";
import { FaStar } from "react-icons/fa";

const MobileBottomBar = ({ listing, onReserve }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-secondary-900">
              ${listing.price}
            </span>
            <span className="text-neutral-500 text-sm">/ night</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <FaStar className="w-3 h-3 text-secondary-900" />
            <span className="font-medium">{listing.rating || "New"}</span>
          </div>
        </div>
        <button
          onClick={onReserve}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-md cursor-pointer hover:from-primary-600 hover:to-primary-700 transition-all"
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

export default MobileBottomBar;
