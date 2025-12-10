"use client";

import React from "react";
import Image from "next/image";

const ListingGallery = ({
  images,
  title,
  currentPhotoIndex,
  onPhotoIndexChange,
  onShowAllPhotos,
}) => {
  const remainingCount = images.length - 5;

  return (
    <div className="relative">
      {/* Desktop Gallery Grid */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[450px]">
          {/* Main Image */}
          <div className="col-span-2 row-span-2 relative">
            {images[0] ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${images[0]}`}
                alt={title}
                fill
                className="object-cover cursor-pointer hover:brightness-90 transition-all"
                onClick={() => {
                  onPhotoIndexChange(0);
                  onShowAllPhotos();
                }}
                priority
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                <span className="text-neutral-400">No image</span>
              </div>
            )}
          </div>

          {/* Secondary Images */}
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="relative">
              {images[index] ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${images[index]}`}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer hover:brightness-90 transition-all"
                  onClick={() => {
                    onPhotoIndexChange(index);
                    onShowAllPhotos();
                  }}
                />
              ) : (
                <div className="w-full h-full bg-neutral-200" />
              )}

              {/* Show All Button on last image */}
              {index === 4 && remainingCount > 0 && (
                <button
                  onClick={onShowAllPhotos}
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Show all photos
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Gallery Swiper */}
      <div className="lg:hidden">
        <div className="relative aspect-square">
          {images[currentPhotoIndex] ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${images[currentPhotoIndex]}`}
              alt={title}
              fill
              className="object-cover cursor-pointer"
              onClick={onShowAllPhotos}
              priority
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-400">No image</span>
            </div>
          )}

          {/* Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onPhotoIndexChange(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    currentPhotoIndex === index ? "bg-white w-3" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Photo Count Badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm">
            {currentPhotoIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingGallery;
