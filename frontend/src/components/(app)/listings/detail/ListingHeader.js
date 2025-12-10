"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart, FaShare, FaChevronLeft } from "react-icons/fa";

const ListingHeader = ({ listing, isFavorite, onToggleFavorite, onShare }) => {
  const router = useRouter();

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            <FaShare className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleFavorite}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            {isFavorite ? (
              <FaHeart className="w-5 h-5 text-primary-500" />
            ) : (
              <FaRegHeart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingHeader;
