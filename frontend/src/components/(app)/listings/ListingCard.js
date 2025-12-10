"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaStar, FaBed, FaBath, FaUsers } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ListingCard = ({ listing }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const prevClass = `listing-prev-${listing.id}`;
  const nextClass = `listing-next-${listing.id}`;

  const handleCardClick = () => {
    router.push(`/listings/${listing.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  return (
    <div onClick={handleCardClick} className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        {/* Category Badge */}
        {listing.category && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-white/90 backdrop-blur-sm text-secondary-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {listing.category.title}
            </span>
          </div>
        )}

        {/* Image Swiper */}
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={listing.images?.length > 1}
          navigation={{
            prevEl: `.${prevClass}`,
            nextEl: `.${nextClass}`,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Navigation, Pagination]}
          className="h-full w-full listing-swiper"
        >
          {listing.images && listing.images.length > 0 ? (
            listing.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={
                      imageError
                        ? "/images/placeholder.jpg"
                        : `${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`
                    }
                    alt={`${listing.title} - ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                <span className="text-neutral-400 text-sm">No images</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        {/* Navigation Arrows */}
        {listing.images?.length > 1 && (
          <>
            <button
              onClick={(e) => e.stopPropagation()}
              className={`${prevClass} absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-secondary-800 p-1.5 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer`}
            >
              <MdChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className={`${nextClass} absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-secondary-800 p-1.5 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer`}
            >
              <MdChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Location & Rating */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-secondary-900 truncate pr-2">
            {listing.city?.name || "Unknown Location"}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <FaStar className="w-3.5 h-3.5 text-secondary-900" />
            <span className="text-sm font-medium text-secondary-900">
              {listing.rating || "New"}
            </span>
          </div>
        </div>

        {/* Title */}
        <p className="text-neutral-500 text-sm truncate">{listing.title}</p>

        {/* Features */}
        <div className="flex items-center gap-3 text-neutral-500 text-sm">
          <div className="flex items-center gap-1">
            <FaUsers className="w-3.5 h-3.5" />
            <span>{listing.guest_count} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBed className="w-3.5 h-3.5" />
            <span>{listing.bed_count} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath className="w-3.5 h-3.5" />
            <span>{listing.bathroom_count}</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-1">
          <span className="font-semibold text-secondary-900">
            ${formatPrice(listing.price)}
          </span>
          <span className="text-neutral-500 text-sm"> / night</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
