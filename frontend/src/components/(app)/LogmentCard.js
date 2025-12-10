import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaBed,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";

const LogmentCard = ({ listing, favorites, toggleFavorite }) => {
  const router = useRouter(); // Initialize useRouter hook

  // Generate unique class names using listing.id
  const prevClass = `swiper-button-prev-${listing.id}`;
  const nextClass = `swiper-button-next-${listing.id}`;

  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  // Handle card click to navigate to /logement/:id
  const handleCardClick = () => {
    router.push(`/logement/${listing.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Image Gallery */}
      <div className="w-full relative">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          navigation={{
            prevEl: `.${prevClass}`,
            nextEl: `.${nextClass}`,
          }}
          modules={[Navigation, Autoplay]}
          className="mb-6"
        >
          {listing.images && listing.images.length > 0 ? (
            listing.images.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image}
                  alt={`${listing.title} - ${index + 1}`}
                  height={100}
                  width={100}
                  className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
        {/* Navigation Buttons with Unique Classes */}
        <button
          onClick={(e) => e.stopPropagation()} // Prevent card click
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 sm:p-2 rounded-full shadow-lg z-10 hover:bg-gray-200 cursor-pointer transition opacity-0 group-hover:opacity-100 ${prevClass}`}
        >
          <MdKeyboardArrowLeft />
        </button>
        <button
          onClick={(e) => e.stopPropagation()} // Prevent card click
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 sm:p-2 rounded-full shadow-lg z-10 hover:bg-gray-200 cursor-pointer transition opacity-0 group-hover:opacity-100 ${nextClass}`}
        >
          <MdKeyboardArrowRight />
        </button>
      </div>

      {/* Listing Details */}

      {/* Location */}
      <div>
        <div className="flex items-center text-gray-500">
          <FaMapMarkerAlt className="h-3 w-3 mr-1" />
          <span className="text-sm truncate">
            {truncateText(listing.adresse, 28)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-800">
          {truncateText(listing.title, 28)}
        </h3>

        {/* Features */}
      </div>
      <div className="flex flex-col items-start justify-between">
        <div className="flex items-center justify-start gap-2  text-gray-600">
          <div className="flex items-center">
            <FaUsers className="h-3 w-3 mr-1" />
            <span className="text-sm">{listing.guestCount} invités</span>
          </div>
          <div className="flex items-center">
            <FaBed className="h-3 w-3 mr-1" />
            <span className="text-sm">{listing.roomCount} lits</span>
          </div>
        </div>
        <div>
          <span className="text-lg font-bold text-blue-800">
            {listing.price}dt
          </span>
          <span className="text-gray-500 text-sm"> / nuit</span>
        </div>
      </div>
    </div>
  );
};

export default LogmentCard;
