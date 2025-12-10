"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaMinus, FaBed } from "react-icons/fa";

const GuestsInput = ({
  value = 2,
  onChange,
  maxGuests = 20,
  minGuests = 1,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (operation) => {
    let newValue = value;
    if (operation === "increase" && value < maxGuests) {
      newValue = value + 1;
    } else if (operation === "decrease" && value > minGuests) {
      newValue = value - 1;
    }
    onChange?.(newValue);
  };

  const formatGuestInfo = () => {
    return `${value} Invité${value > 1 ? "s" : ""}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 border-2 border-neutral-200 rounded-xl w-full bg-white hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer"
      >
        <FaBed className="text-neutral-500" />
        <span className="text-neutral-700">{formatGuestInfo()}</span>
      </button>

      {isOpen && (
        <div
          className="absolute bg-white border-2 border-neutral-200 rounded-xl shadow-2xl mt-2 p-4 w-64 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-neutral-700">Invité(s)</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChange("decrease")}
                disabled={value <= minGuests}
                className="border-2 border-neutral-200 rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMinus className="text-neutral-600" />
              </button>
              <span className="w-6 text-center font-semibold text-neutral-700">
                {value}
              </span>
              <button
                type="button"
                onClick={() => handleChange("increase")}
                disabled={value >= maxGuests}
                className="border-2 border-neutral-200 rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus className="text-neutral-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestsInput;
