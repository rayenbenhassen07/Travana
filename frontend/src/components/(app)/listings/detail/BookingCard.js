"use client";

import React from "react";
import { GuestsInput } from "@/components/(app)/listings";
import DatePicker from "./DatePicker";

const BookingCard = ({
  listing,
  checkIn,
  checkOut,
  guests,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  pricing,
  reservedDates = [],
  onReserve,
}) => {
  const canReserve = checkIn && checkOut && pricing;

  return (
    <div className="hidden lg:block">
      <div className="sticky top-24">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-lg">
          {/* Price Header */}
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-2xl font-semibold text-secondary-900">
              ${listing.price}
            </span>
            <span className="text-neutral-500">/ nuit</span>
          </div>

          {/* Date Selection */}
          <DatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={onCheckInChange}
            onCheckOutChange={onCheckOutChange}
            reservedDates={reservedDates}
            className="mb-4"
          />

          {/* Guests Selection */}
          <div className="mb-4">
            <GuestsInput
              value={guests}
              onChange={onGuestsChange}
              maxGuests={listing.guest_count || 10}
              minGuests={1}
            />
          </div>

          {/* Reserve Button */}
          <button
            onClick={onReserve}
            disabled={!canReserve}
            className={`w-full py-3.5 font-semibold rounded-xl transition-all shadow-md cursor-pointer ${
              canReserve
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Réserver
          </button>

          {!canReserve && (
            <p className="text-center text-sm text-neutral-500 mt-2">
              Sélectionnez les dates pour réserver
            </p>
          )}

          {/* Pricing Breakdown */}
          {pricing && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 underline cursor-pointer">
                  ${listing.price} × {pricing.nights} nuits
                </span>
                <span className="text-neutral-900">
                  ${pricing.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 underline cursor-pointer">
                  Frais de service
                </span>
                <span className="text-neutral-900">
                  ${pricing.serviceFee.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between font-semibold">
                <span className="text-secondary-900">Total</span>
                <span className="text-secondary-900">
                  ${pricing.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-neutral-500 mt-4">
            Vous ne serez pas encore débité
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
