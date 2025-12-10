"use client";

import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { GuestsInput } from "@/components/(app)/listings";
import DatePicker from "./DatePicker";

const BookingModal = ({
  isOpen,
  onClose,
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
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-secondary-900">
              Reserve
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Date Selection */}
          <div className="mb-4">
            <label className="block  text-sm font-medium text-secondary-900 mb-2">
              Sélectionner les dates
            </label>
            <DatePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={onCheckInChange}
              onCheckOutChange={onCheckOutChange}
              reservedDates={reservedDates}
            />
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-900 mb-2">
              Invités
            </label>
            <GuestsInput
              value={guests}
              onChange={onGuestsChange}
              maxGuests={listing.guest_count || 10}
              minGuests={1}
            />
          </div>

          {/* Pricing Breakdown */}
          {pricing && (
            <div className="border-t border-neutral-200 pt-4 mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">
                  ${listing.price} × {pricing.nights} nuits
                </span>
                <span className="text-neutral-900">
                  ${pricing.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Frais de service</span>
                <span className="text-neutral-900">
                  ${pricing.serviceFee.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Reserve Button */}
          <button
            onClick={() => {
              onClose();
              onReserve?.();
            }}
            disabled={!canReserve}
            className={`w-full py-4 font-semibold rounded-xl shadow-md transition-all ${
              canReserve
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white cursor-pointer hover:from-primary-600 hover:to-primary-700"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Réserver
          </button>
          {!canReserve && (
            <p className="text-center text-sm text-neutral-500 mt-2">
              Sélectionnez les dates pour continuer
            </p>
          )}
          <p className="text-center text-sm text-neutral-500 mt-3">
            Vous ne serez pas encore débité
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
