"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Tooltip Component using Portal
const Tooltip = ({ children, targetRef, isVisible }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (isVisible && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position tooltip above the target, centered
      const left =
        targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      const top = targetRect.top - tooltipRect.height - 8; // 8px gap

      setPosition({ top, left });
    }
  }, [isVisible, targetRef]);

  if (!isVisible || typeof window === "undefined") return null;

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className="animate-in fade-in duration-150"
    >
      {children}
    </div>,
    document.body
  );
};

const ReservationCalendar = ({
  listings,
  reservations,
  onReservationClick,
  onDateRangeSelect,
  showPrices = false,
  isLoading = false,
  onMonthChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredReservation, setHoveredReservation] = useState(null);
  const [tooltipTarget, setTooltipTarget] = useState(null);

  // Get days in current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    return { year, month, daysInMonth, startDayOfWeek, firstDay, lastDay };
  };

  const monthInfo = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const { year, month, daysInMonth } = monthInfo;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      days.push({
        date,
        day,
        isToday: date.toDateString() === new Date().toDateString(),
        isPast: date < today,
      });
    }

    return days;
  }, [monthInfo]);

  // Navigate months
  const goToPreviousMonth = async () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);

    if (onMonthChange) {
      setIsNavigating(true);
      try {
        await onMonthChange(newDate);
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const goToNextMonth = async () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);

    if (onMonthChange) {
      setIsNavigating(true);
      try {
        await onMonthChange(newDate);
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const goToToday = async () => {
    const today = new Date();
    setCurrentDate(today);

    if (onMonthChange) {
      setIsNavigating(true);
      try {
        await onMonthChange(today);
      } finally {
        setIsNavigating(false);
      }
    }
  };

  // Format month/year
  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Get all reservations for a specific listing and date
  const getReservationsForDate = (listingId, date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return reservations.filter((res) => {
      if (res.listing_id !== listingId) return false;

      const startDate = new Date(res.start_date);
      const endDate = new Date(res.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  // Determine reservation type for a specific date
  const getReservationType = (reservation, date) => {
    const startDate = new Date(reservation.start_date);
    const endDate = new Date(reservation.end_date);
    const checkDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    const isStart = checkDate.getTime() === startDate.getTime();
    const isEnd = checkDate.getTime() === endDate.getTime();
    const isSameDay = startDate.getTime() === endDate.getTime();

    if (isSameDay) return "same-day";
    if (isStart) return "start";
    if (isEnd) return "end";
    return "middle";
  };

  // Calculate reservation stats
  const getReservationStats = (reservation, listing) => {
    const startDate = new Date(reservation.start_date);
    const endDate = new Date(reservation.end_date);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;
    return { nights, totalPrice };
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-white p-3 md:p-4 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-2 md:gap-3">
          <h2 className="text-lg md:text-xl font-bold text-neutral-800">
            {formatMonthYear(currentDate)}
          </h2>
          <button
            onClick={goToToday}
            className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={goToPreviousMonth}
            disabled={isNavigating}
            className="p-1.5 md:p-2 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Month"
          >
            <FaChevronLeft className="text-neutral-600 text-sm md:text-base" />
          </button>
          <button
            onClick={goToNextMonth}
            disabled={isNavigating}
            className="p-1.5 md:p-2 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Month"
          >
            <FaChevronRight className="text-neutral-600 text-sm md:text-base" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-max relative">
            {/* Days Header */}
            <div className="flex border-b border-neutral-200 sticky top-0 bg-white z-20">
              <div className="w-48 md:w-64 flex-shrink-0 p-2 md:p-4 border-r border-neutral-200 font-semibold text-neutral-700 text-sm md:text-base sticky left-0 bg-white z-30">
                Property
              </div>
              {calendarDays.map((dayInfo) => (
                <div
                  key={dayInfo.day}
                  className={`w-20 md:w-24 flex-shrink-0 p-2 md:p-3 text-center border-r border-neutral-200 ${
                    dayInfo.isToday
                      ? "bg-primary-50"
                      : dayInfo.isPast
                      ? "bg-neutral-50"
                      : "bg-white"
                  }`}
                >
                  <div
                    className={`text-base md:text-lg font-bold ${
                      dayInfo.isToday
                        ? "text-primary-600"
                        : dayInfo.isPast
                        ? "text-neutral-400"
                        : "text-neutral-700"
                    }`}
                  >
                    {dayInfo.day}
                  </div>
                  <div className="text-[10px] md:text-xs text-neutral-500 mt-0.5 md:mt-1">
                    {dayInfo.date.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Listings Rows */}
            {isLoading || isNavigating ? (
              listings.length > 0 ? (
                listings.map((listing) => (
                  <div
                    key={`skeleton-${listing.id}`}
                    className="flex border-b border-neutral-200"
                  >
                    <div className="w-48 md:w-64 flex-shrink-0 p-2 md:p-4 border-r border-neutral-200 sticky left-0 bg-white z-10">
                      <div className="space-y-0.5 md:space-y-1">
                        <h3 className="font-semibold text-neutral-800 text-xs md:text-sm leading-tight">
                          {listing.title}
                        </h3>
                        <p className="text-[10px] md:text-xs text-neutral-500 flex items-center gap-1">
                          Location: {listing.city?.name || "N/A"}
                        </p>
                        {showPrices && (
                          <p className="text-xs md:text-sm font-bold text-primary-600">
                            ${listing.price}/night
                          </p>
                        )}
                        <p className="text-[10px] md:text-xs text-neutral-500">
                          {listing.guest_count} guests • {listing.room_count}{" "}
                          rooms
                        </p>
                      </div>
                    </div>
                    {calendarDays.map((dayInfo) => (
                      <div
                        key={dayInfo.day}
                        className="w-20 md:w-24 flex-shrink-0 border-r border-neutral-200 p-1 md:p-2"
                      >
                        <div className="h-12 md:h-16 bg-neutral-100 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-neutral-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-neutral-300 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-sm">Loading calendar...</p>
                  </div>
                </div>
              )
            ) : listings.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                No listings available. Please add listings first.
              </div>
            ) : (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex border-b border-neutral-200 hover:bg-neutral-50 transition-colors overflow-visible"
                >
                  {/* Listing Info */}
                  <div className="w-48 md:w-64 flex-shrink-0 p-2 md:p-4 border-r border-neutral-200 sticky left-0 bg-white z-10">
                    <div className="space-y-0.5 md:space-y-1">
                      <h3 className="font-semibold text-neutral-800 text-xs md:text-sm leading-tight">
                        {listing.title}
                      </h3>
                      <p className="text-[10px] md:text-xs text-neutral-500 flex items-center gap-1">
                        Location: {listing.city?.name || "N/A"}
                      </p>
                      {showPrices && (
                        <p className="text-xs md:text-sm font-bold text-primary-600">
                          ${listing.price}/night
                        </p>
                      )}
                      <p className="text-[10px] md:text-xs text-neutral-500">
                        {listing.guest_count} guests • {listing.room_count}{" "}
                        rooms
                      </p>
                    </div>
                  </div>

                  {/* Calendar Days */}
                  {calendarDays.map((dayInfo) => {
                    const dayReservations = getReservationsForDate(
                      listing.id,
                      dayInfo.date
                    );

                    if (dayReservations.length > 0) {
                      const resGroups = dayReservations.reduce((acc, res) => {
                        const type = getReservationType(res, dayInfo.date);
                        if (!acc[type]) acc[type] = [];
                        acc[type].push(res);
                        return acc;
                      }, {});

                      return (
                        <div
                          key={dayInfo.day}
                          className="w-20 md:w-24 flex-shrink-0 border-r border-neutral-200 p-0.5 md:p-1 relative min-h-[3rem] md:min-h-[4rem] overflow-visible"
                        >
                          {Object.entries(resGroups).map(([type, group]) => {
                            group.sort((a, b) => a.id - b.id); // Assuming id is numeric; adjust if needed
                            const n = group.length;

                            let groupContainerClass = "absolute h-full ";
                            let borderClass = "";

                            switch (type) {
                              case "same-day":
                                groupContainerClass +=
                                  "left-[25%] right-[25%] ";
                                borderClass = "rounded-md";
                                break;
                              case "start":
                                groupContainerClass += "left-[55%] right-0 ";
                                borderClass = "rounded-l-full";
                                break;
                              case "end":
                                groupContainerClass += "left-0 right-[45%] ";
                                borderClass = "rounded-r-full";
                                break;
                              case "middle":
                                groupContainerClass += "left-0 right-0 ";
                                borderClass = "";
                                break;
                            }

                            return (
                              <div key={type} className={groupContainerClass}>
                                <div className="relative h-full">
                                  {group.map((reservation, index) => {
                                    const isBlocked = reservation.is_blocked;
                                    const bgClass = isBlocked
                                      ? "bg-neutral-600 hover:bg-neutral-700"
                                      : "bg-primary-500 hover:bg-primary-600";
                                    let innerBorderClass = borderClass;
                                    let innerHeightClass = "h-full";
                                    let topClass = "";
                                    if (n > 1) {
                                      innerHeightClass = `h-[${100 / n}%]`;
                                      topClass = `top-[${index * (100 / n)}%]`;
                                      innerBorderClass = "rounded-md";
                                    }

                                    const { nights, totalPrice } =
                                      getReservationStats(reservation, listing);

                                    return (
                                      <div
                                        key={reservation.id}
                                        className={`absolute left-0 right-0 ${topClass} ${innerHeightClass}`}
                                        onMouseEnter={(e) => {
                                          setHoveredReservation({
                                            reservation,
                                            listing,
                                            nights,
                                            totalPrice,
                                            isBlocked,
                                          });
                                          setTooltipTarget(e.currentTarget);
                                        }}
                                        onMouseLeave={() => {
                                          setHoveredReservation(null);
                                          setTooltipTarget(null);
                                        }}
                                      >
                                        <div
                                          onClick={() =>
                                            onReservationClick(reservation)
                                          }
                                          className={`absolute inset-0 ${bgClass} ${innerBorderClass} cursor-pointer transition-all`}
                                        >
                                          {type === "start" && n === 1 && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <span className="text-white text-[9px] md:text-[11px] font-semibold truncate px-1">
                                                {isBlocked
                                                  ? "Blocked"
                                                  : reservation.user?.name?.split(
                                                      " "
                                                    )[0] || "Guest"}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    // Available / Past Day Cell
                    return (
                      <div
                        key={dayInfo.day}
                        className={`
                          w-20 md:w-24 flex-shrink-0 border-r border-neutral-200 p-1 md:p-2 transition-colors min-h-[3rem] md:min-h-[4rem]
                          ${
                            dayInfo.isPast
                              ? "bg-neutral-50 cursor-not-allowed"
                              : "hover:bg-primary-50 cursor-pointer"
                          }
                        `}
                        onClick={() => {
                          if (!dayInfo.isPast && onDateRangeSelect) {
                            onDateRangeSelect(listing, dayInfo.date);
                          }
                        }}
                        title={
                          dayInfo.isPast
                            ? "Past date"
                            : `Click to create reservation for ${listing.title}`
                        }
                      >
                        {!dayInfo.isPast && showPrices && (
                          <div className="text-center">
                            <div className="text-[10px] md:text-xs text-neutral-400 font-medium">
                              ${listing.price}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-3 md:p-4 rounded-xl border border-neutral-200">
        <h3 className="text-xs md:text-sm font-semibold text-neutral-700 mb-2 md:mb-3">
          Legend & Check-in/Check-out Policy
        </h3>
        <div className="mb-3 text-xs text-neutral-600 bg-primary-50 p-2 rounded">
          <strong>Check-in:</strong> 2:00 PM (14:00) •{" "}
          <strong>Check-out:</strong> 12:00 PM (noon)
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-3 md:w-6 md:h-4 bg-primary-500 rounded"></div>
            <span className="text-xs md:text-sm text-neutral-600">
              Reservation
            </span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-3 md:w-6 md:h-4 bg-neutral-700 rounded"></div>
            <span className="text-xs md:text-sm text-neutral-600">Blocked</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-3 md:w-6 md:h-4 bg-neutral-50 border border-neutral-200 rounded"></div>
            <span className="text-xs md:text-sm text-neutral-600">
              Past Date
            </span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-3 md:w-6 md:h-4 bg-white border border-neutral-200 rounded"></div>
            <span className="text-xs md:text-sm text-neutral-600">
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Tooltip Portal */}
      {hoveredReservation && tooltipTarget && (
        <Tooltip targetRef={{ current: tooltipTarget }} isVisible={true}>
          <div className="bg-neutral-800 text-white text-xs rounded-lg p-2.5 shadow-2xl border border-neutral-700 min-w-[180px] whitespace-nowrap">
            {hoveredReservation.isBlocked ? (
              <div>
                <div className="font-semibold mb-1.5 text-neutral-100">
                  Blocked Period
                </div>
                <div className="text-[11px] text-neutral-300 space-y-0.5">
                  <div>
                    Check-in: 2:00 PM,{" "}
                    {new Date(
                      hoveredReservation.reservation.start_date
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div>
                    Check-out: 12:00 PM,{" "}
                    {new Date(
                      hoveredReservation.reservation.end_date
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-semibold mb-1.5 text-neutral-100">
                  {hoveredReservation.reservation.user?.name || "Guest"}
                </div>
                <div className="space-y-1 text-[11px] text-neutral-300">
                  <div className="flex items-center justify-between gap-3">
                    <span>Check-in:</span>
                    <span className="font-medium text-white">
                      2:00 PM,{" "}
                      {new Date(
                        hoveredReservation.reservation.start_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Check-out:</span>
                    <span className="font-medium text-white">
                      12:00 PM,{" "}
                      {new Date(
                        hoveredReservation.reservation.end_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Duration:</span>
                    <span className="font-medium text-white">
                      {hoveredReservation.nights} night
                      {hoveredReservation.nights > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Guests:</span>
                    <span className="font-medium text-white">
                      {hoveredReservation.reservation.guest_count || 0}
                    </span>
                  </div>
                  {hoveredReservation.reservation.client_type && (
                    <div className="flex items-center justify-between gap-3">
                      <span>Type:</span>
                      <span className="font-medium text-white capitalize">
                        {hoveredReservation.reservation.client_type}
                      </span>
                    </div>
                  )}
                  {showPrices && (
                    <div className="flex items-center justify-between gap-3 pt-1.5 mt-1.5 border-t border-neutral-600">
                      <span>Total:</span>
                      <span className="font-bold text-primary-400">
                        ${hoveredReservation.totalPrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default ReservationCalendar;
