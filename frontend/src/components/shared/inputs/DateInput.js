"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCalendar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

const DateInput = ({
  label,
  name,
  value, // "YYYY-MM-DD"
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder = "jj/mm/aaaa",
  min,
  max,
  icon = <FaCalendar size={16} />,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState("days"); // "days" or "years"
  const dropdownRef = useRef(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  // Initialize view based on value or max
  useEffect(() => {
    if (value) {
      const date = new Date(value + "T00:00:00");
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const formatDateStr = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDateSelect = (date) => {
    const dateStr = formatDateStr(date);
    onChange({ target: { name, value: dateStr } });
    setIsOpen(false);
  };

  const isDateDisabled = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (min) {
      const minDate = new Date(min + "T00:00:00");
      if (d < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max + "T00:00:00");
      if (d > maxDate) return true;
    }
    return false;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const goToPrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToYear = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode("days");
  };

  const currentYear = currentMonth.getFullYear();
  const yearRangeStart = currentYear - 100; // Show current year and 100 years before
  const years = Array.from({ length: 101 }, (_, i) => yearRangeStart + i); // 101 years: current + 100 before

  const renderDaysView = () => {
    const days = getDaysInMonth(currentMonth);

    return (
      <>
        {/* Header - Clickable Year */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="p-2 hover:bg-neutral-100 rounded-lg"
          >
            <FaChevronLeft className="w-4 h-4 text-neutral-600" />
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewMode("years");
              }}
              className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
            >
              {currentYear}
            </button>
            <span className="font-semibold text-neutral-900">
              {MONTHS[currentMonth.getMonth()]}
            </span>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="p-2 hover:bg-neutral-100 rounded-lg"
          >
            <FaChevronRight className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-neutral-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, i) => {
            if (!date)
              return <div key={`empty-${i}`} className="aspect-square" />;

            const disabled = isDateDisabled(date);
            const selected =
              selectedDate &&
              formatDateStr(date) === formatDateStr(selectedDate);

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => handleDateSelect(date)}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                  ${
                    disabled
                      ? "text-neutral-300 cursor-not-allowed"
                      : "cursor-pointer hover:bg-primary-50 text-neutral-700"
                  }
                  ${
                    selected
                      ? "bg-primary-500 text-white font-medium hover:bg-primary-600"
                      : ""
                  }
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  const renderYearsView = () => (
    <>
      <div className="flex items-center justify-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">
          Sélectionner l'année
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto px-1">
        {years.map((year) => {
          const isSelected = year === currentYear;
          const isInRange = !min || year >= new Date(min).getFullYear();
          const isInMaxRange = !max || year <= new Date(max).getFullYear();

          const disabled = !isInRange || !isInMaxRange;

          return (
            <button
              key={year}
              type="button"
              disabled={disabled}
              onClick={() => goToYear(year)}
              className={`
                py-3 rounded-lg text-sm font-medium transition-all
                ${
                  disabled
                    ? "text-neutral-300 cursor-not-allowed"
                    : "hover:bg-primary-50 cursor-pointer"
                }
                ${
                  isSelected
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "text-neutral-700"
                }
              `}
            >
              {year}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setViewMode("days")}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 underline"
        >
          Retour au calendrier
        </button>
      </div>
    </>
  );

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          {icon}
        </div>

        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all cursor-pointer
            flex items-center justify-between bg-white
            ${error ? "border-red-300" : "border-neutral-200"}
            ${
              disabled
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "hover:border-primary-400"
            }
            ${isOpen ? "border-primary-500 ring-2 ring-primary-100" : ""}
          `}
        >
          <span
            className={`text-sm ${
              value ? "text-neutral-700" : "text-neutral-400"
            }`}
          >
            {value ? formatDisplay(value) : placeholder}
          </span>
          <FaChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-2 left-0 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 w-80">
              {viewMode === "days" ? renderDaysView() : renderYearsView()}

              {/* Clear button */}
              {value && viewMode === "days" && (
                <div className="mt-5 pt-4 border-t border-neutral-200 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({ target: { name, value: "" } });
                      setIsOpen(false);
                    }}
                    className="text-sm text-neutral-600 hover:text-neutral-900 underline"
                  >
                    Effacer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Chevron Down Inline SVG
const FaChevronDown = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default DateInput;
