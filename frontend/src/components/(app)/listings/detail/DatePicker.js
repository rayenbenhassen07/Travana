"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const DatePicker = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  reservedDates = [], // Array of { start_date, end_date } objects
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get all reserved date strings for quick lookup
  const getReservedDateSet = () => {
    const reserved = new Set();
    reservedDates.forEach(({ start_date, end_date }) => {
      const start = new Date(start_date);
      const end = new Date(end_date);
      // Block dates from start_date to end_date - 1 day (checkout day is available)
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        reserved.add(d.toISOString().split("T")[0]);
      }
    });
    return reserved;
  };

  const reservedSet = getReservedDateSet();

  // Format date to YYYY-MM-DD without timezone issues
  const formatDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateReserved = (date) => {
    return reservedSet.has(formatDateStr(date));
  };

  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateDisabled = (date) => {
    return isDateInPast(date) || isDateReserved(date);
  };

  const isDateSelected = (date) => {
    const dateStr = formatDateStr(date);
    return dateStr === checkIn || dateStr === checkOut;
  };

  const isDateInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const dateStr = formatDateStr(date);
    return dateStr > checkIn && dateStr < checkOut;
  };

  const isDateInHoverRange = (date) => {
    if (!checkIn || checkOut || !hoveredDate || !selectingCheckOut)
      return false;
    const dateStr = formatDateStr(date);
    const hoverStr = formatDateStr(hoveredDate);
    return dateStr > checkIn && dateStr <= hoverStr;
  };

  // Check if there's a reserved date between checkIn and the target date
  const hasReservedDateBetween = (startStr, endDate) => {
    const start = new Date(startStr);
    const end = endDate;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (isDateReserved(d)) return true;
    }
    return false;
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;

    const dateStr = formatDateStr(date);

    if (!selectingCheckOut || !checkIn) {
      // Selecting check-in
      onCheckInChange(dateStr);
      onCheckOutChange("");
      setSelectingCheckOut(true);
    } else {
      // Selecting check-out
      if (dateStr <= checkIn) {
        // If clicked date is before check-in, reset and set as new check-in
        onCheckInChange(dateStr);
        onCheckOutChange("");
      } else if (hasReservedDateBetween(checkIn, date)) {
        // If there's a reserved date between, reset
        onCheckInChange(dateStr);
        onCheckOutChange("");
      } else {
        onCheckOutChange(dateStr);
        setSelectingCheckOut(false);
        setIsOpen(false);
      }
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get day of week (0 = Sunday, adjust for Monday start)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days = [];

    // Add empty slots for days before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Sélectionner";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  );

  const renderMonth = (monthDate) => {
    const days = getDaysInMonth(monthDate);

    return (
      <div className="flex-1 min-w-[280px]">
        {/* Month Header */}
        <div className="text-center font-semibold text-secondary-900 mb-4">
          {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-neutral-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const disabled = isDateDisabled(date);
            const selected = isDateSelected(date);
            const inRange = isDateInRange(date);
            const inHoverRange = isDateInHoverRange(date);
            const reserved = isDateReserved(date);
            const isCheckIn = formatDateStr(date) === checkIn;
            const isCheckOut = formatDateStr(date) === checkOut;

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-full
                  transition-all duration-150 relative
                  ${
                    disabled
                      ? "text-neutral-300 cursor-not-allowed"
                      : "cursor-pointer hover:bg-neutral-100"
                  }
                  ${
                    reserved
                      ? "bg-neutral-100 text-neutral-300 line-through"
                      : ""
                  }
                  ${
                    selected
                      ? "bg-secondary-900 text-white hover:bg-secondary-800"
                      : ""
                  }
                  ${
                    (inRange || inHoverRange) && !selected
                      ? "bg-neutral-100"
                      : ""
                  }
                  ${isCheckIn && checkOut ? "rounded-r-none" : ""}
                  ${isCheckOut ? "rounded-l-none" : ""}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-neutral-200 rounded-xl overflow-hidden cursor-pointer hover:border-neutral-400 transition-all"
      >
        <div className="grid grid-cols-2 divide-x divide-neutral-200">
          <div
            className={`p-3 transition-colors ${
              selectingCheckOut === false || !isOpen ? "" : "bg-neutral-50"
            }`}
          >
            <label className="block text-xs font-semibold uppercase text-secondary-900 cursor-pointer">
              Arrivée
            </label>
            <div className="flex items-center gap-2 mt-1">
              <FaCalendarAlt className="w-3 h-3 text-neutral-400" />
              <span
                className={`text-sm ${
                  checkIn ? "text-neutral-700" : "text-neutral-400"
                }`}
              >
                {formatDisplayDate(checkIn)}
              </span>
            </div>
          </div>
          <div
            className={`p-3 transition-colors ${
              selectingCheckOut && isOpen ? "bg-neutral-50" : ""
            }`}
          >
            <label className="block text-xs font-semibold uppercase text-secondary-900 cursor-pointer">
              Départ
            </label>
            <div className="flex items-center gap-2 mt-1">
              <FaCalendarAlt className="w-3 h-3 text-neutral-400" />
              <span
                className={`text-sm ${
                  checkOut ? "text-neutral-700" : "text-neutral-400"
                }`}
              >
                {formatDisplayDate(checkOut)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar */}
          <div
            className="absolute right-0 mt-2 z-50 bg-white border border-neutral-200 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <FaChevronLeft className="w-4 h-4 text-neutral-600" />
              </button>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <FaChevronRight className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Two Month View */}
            <div className="flex gap-8">
              {renderMonth(currentMonth)}
              {renderMonth(nextMonth)}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-neutral-200 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-secondary-900" />
                <span>Sélectionné</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-neutral-100 border border-neutral-300" />
                <span>Indisponible</span>
              </div>
            </div>

            {/* Clear Button */}
            {(checkIn || checkOut) && (
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    onCheckInChange("");
                    onCheckOutChange("");
                    setSelectingCheckOut(false);
                  }}
                  className="text-sm font-medium text-neutral-600 underline hover:text-neutral-900 cursor-pointer"
                >
                  Effacer les dates
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;
