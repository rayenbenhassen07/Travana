"use client";

import React from "react";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Logo from "../(app)/navbar/Logo";

const PhotoGalleryModal = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onIndexChange,
  apiUrl = process.env.NEXT_PUBLIC_API_URL,
}) => {
  if (!isOpen || !images.length) return null;

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onIndexChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onIndexChange?.(newIndex);
  };

  const handleThumbnailClick = (index) => {
    onIndexChange?.(index);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        {/* Close Button */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="p-2 bg-white/10 cursor-pointer hover:bg-white/20 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <Logo color="white" />
          </div>
        </div>
        {/* Logo */}

        {/* Photo Counter */}
        <div className="text-white font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Main Image */}
      <div className="h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl aspect-video">
          <Image
            src={`${apiUrl}/storage/${images[currentIndex]}`}
            alt={`Photo ${currentIndex + 1}`}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <FaChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <FaChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all cursor-pointer ${
              currentIndex === index
                ? "ring-2 ring-white"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={`${apiUrl}/storage/${image}`}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
