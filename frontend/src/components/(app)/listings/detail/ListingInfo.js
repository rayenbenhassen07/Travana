"use client";

import React from "react";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaMapMarkerAlt,
  FaUsers,
  FaBed,
  FaBath,
  FaDoorOpen,
  FaWifi,
  FaTv,
  FaParking,
  FaSwimmingPool,
  FaSnowflake,
  FaCheck,
} from "react-icons/fa";
import { MdOutlineKitchen, MdLocalLaundryService } from "react-icons/md";

// Facility Icon Map
const facilityIcons = {
  wifi: FaWifi,
  tv: FaTv,
  parking: FaParking,
  pool: FaSwimmingPool,
  ac: FaSnowflake,
  kitchen: MdOutlineKitchen,
  washer: MdLocalLaundryService,
  default: FaCheck,
};

const ListingInfo = ({ listing, isFavorite, onToggleFavorite, onShare }) => {
  return (
    <div className="lg:col-span-2">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <FaStar className="w-4 h-4 text-secondary-900" />
            <span className="font-medium">{listing.rating || "New"}</span>
            {listing.reviews_count && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="underline cursor-pointer">
                  {listing.reviews_count} reviews
                </span>
              </>
            )}
            <span className="text-neutral-300">·</span>
            <span className="underline cursor-pointer">
              {listing.city?.name || "Unknown location"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onShare}
              className="flex items-center gap-2 hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <FaShare className="w-4 h-4" />
              <span className="font-medium underline">Share</span>
            </button>
            <button
              onClick={onToggleFavorite}
              className="flex items-center gap-2 hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {isFavorite ? (
                <FaHeart className="w-4 h-4 text-primary-500" />
              ) : (
                <FaRegHeart className="w-4 h-4" />
              )}
              <span className="font-medium underline">Save</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-semibold text-secondary-900 mb-2">
          {listing.title}
        </h1>

        {/* Mobile Location */}
        <div className="lg:hidden flex items-center gap-2 text-neutral-600 mb-3">
          <FaMapMarkerAlt className="w-4 h-4" />
          <span>{listing.city?.name || "Unknown location"}</span>
        </div>

        {/* Property Info Bar */}
        <div className="flex flex-wrap items-center gap-4 text-neutral-600">
          <div className="flex items-center gap-2">
            <FaUsers className="w-4 h-4" />
            <span>{listing.guest_count} guests</span>
          </div>
          <span className="text-neutral-300">·</span>
          <div className="flex items-center gap-2">
            <FaDoorOpen className="w-4 h-4" />
            <span>{listing.room_count} bedrooms</span>
          </div>
          <span className="text-neutral-300">·</span>
          <div className="flex items-center gap-2">
            <FaBed className="w-4 h-4" />
            <span>{listing.bed_count} beds</span>
          </div>
          <span className="text-neutral-300">·</span>
          <div className="flex items-center gap-2">
            <FaBath className="w-4 h-4" />
            <span>{listing.bathroom_count} baths</span>
          </div>
        </div>
      </div>

      {/* Host Info */}
      {listing.user && (
        <div className="py-6 border-b border-neutral-200 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-secondary-800 flex items-center justify-center text-white text-xl font-medium">
            {listing.user.name?.charAt(0).toUpperCase() || "H"}
          </div>
          <div>
            <p className="font-medium text-secondary-900">
              Hosted by {listing.user.name || "Host"}
            </p>
            <p className="text-sm text-neutral-500">
              {listing.category?.title || "Property"}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="py-6 border-b border-neutral-200">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          About this place
        </h2>
        <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
          {listing.long_description || listing.short_description}
        </p>
      </div>

      {/* Amenities / Facilities */}
      {listing.facilities && listing.facilities.length > 0 && (
        <div className="py-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            What this place offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listing.facilities.map((facility) => {
              const IconComponent =
                facilityIcons[facility.title?.toLowerCase()] ||
                facilityIcons.default;
              return (
                <div key={facility.id} className="flex items-center gap-4">
                  <IconComponent className="w-6 h-6 text-neutral-600" />
                  <span className="text-neutral-800">{facility.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="py-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Location
        </h2>
        <div className="flex items-start gap-3 mb-4">
          <FaMapMarkerAlt className="w-5 h-5 text-neutral-500 mt-0.5" />
          <div>
            <p className="text-neutral-800">{listing.adresse}</p>
            <p className="text-neutral-500">{listing.city?.name}</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-64 bg-neutral-100 rounded-xl flex items-center justify-center">
          <span className="text-neutral-400">Map view</span>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
