"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useRouter } from "next/navigation";
import { useCityStore } from "@/store/useCityStore";
import DestinationSelect from "../DestinationSelect";
import { ButtonLoading } from "@/components/Loading";
import GuestsInput from "./GuestsInput";

const SearchListing = ({ destination, startDate, endDate, pax, onSearch }) => {
  const router = useRouter();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Parse initial pax (assuming it's just adults now)
  const parsePax = (paxString) => {
    if (!paxString) return 2; // Default to 2 adults if no pax provided
    const [adults] = paxString.split(",").map(Number);
    return adults || 2; // Default to 2 if invalid
  };

  const [formData, setFormData] = useState({
    destination: destination || "",
    dateRange: {
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate
        ? new Date(endDate)
        : new Date(new Date().setDate(new Date().getDate() + 3)),
      key: "selection",
    },
    adults: parsePax(pax),
  });

  const datePickerRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Fetch cities
  const { cities, fetchCities } = useCityStore();

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDatePickerOpen &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDatePickerOpen]);

  const handleGuestsChange = (newValue) => {
    setFormData((prev) => ({ ...prev, adults: newValue }));
  };

  const handleDateSelect = (ranges) => {
    setFormData({ ...formData, dateRange: ranges.selection });
  };

  const handleBackgroundClick = () => {
    setIsDatePickerOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation checks
      if (!formData.destination) {
        alert("Veuillez entrer une destination");
        setIsLoading(false);
        return;
      }

      if (!formData.dateRange.startDate || !formData.dateRange.endDate) {
        alert("Veuillez sélectionner des dates");
        setIsLoading(false);
        return;
      }

      if (formData.dateRange.startDate > formData.dateRange.endDate) {
        alert("La date de début doit être avant la date de fin");
        setIsLoading(false);
        return;
      }

      // Build query parameters for listings page
      const query = {
        city: formData.destination,
        check_in: formData.dateRange.startDate.toLocaleDateString("fr-CA"),
        check_out: formData.dateRange.endDate.toLocaleDateString("fr-CA"),
        guests: formData.adults.toString(),
      };

      setIsDatePickerOpen(false);

      // If onSearch callback is provided, use it (for in-page search)
      if (onSearch) {
        onSearch({
          city: query.city,
          check_in: query.check_in,
          check_out: query.check_out,
          guests: parseInt(query.guests),
        });
        setIsLoading(false);
        return;
      }

      const queryString = new URLSearchParams(query).toString();

      // Minimum loading time for animation
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/listings?${queryString}`);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="w-full flex justify-center items-center relative z-30 ">
      {isDatePickerOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 "
          onClick={handleBackgroundClick}
        ></div>
      )}
      <div
        ref={searchContainerRef}
        className="bg-white rounded-2xl w-full max-w-6xl  relative  border-neutral-200"
      >
        {/* Search inputs */}
        <div className="flex flex-col md:flex-row gap-4 p-2 text-sm md:text-base">
          {/* Destination */}
          <div className="relative flex-grow ">
            <DestinationSelect
              cities={cities}
              value={formData.destination}
              onChange={(city) =>
                setFormData({ ...formData, destination: city.name })
              }
              className="pl-10 py-3 border-2 border-neutral-200 rounded-xl w-full bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer"
            />
          </div>

          {/* Date */}
          <div className="relative md:w-1/3  ">
            <button
              onClick={() => {
                setIsDatePickerOpen(!isDatePickerOpen);
              }}
              className="flex items-center gap-3 p-3 border-2 border-neutral-200 rounded-xl w-full bg-white hover:bg-neutral-50 hover:border-primary-500 transition-all cursor-pointer"
            >
              <FaCalendarAlt className="text-primary-500" />
              <span className="truncate text-neutral-700">
                {`${formData.dateRange.startDate.toLocaleDateString("fr-FR")} - 
                  ${formData.dateRange.endDate.toLocaleDateString("fr-FR")}`}
              </span>
            </button>

            {isDatePickerOpen && (
              <div
                className="absolute -left-9 md:-left-60 lg:-left-40  bg-white border-2 border-neutral-200 rounded-2xl shadow-2xl p-4 mt-2 z-30"
                ref={datePickerRef}
                onClick={stopPropagation}
              >
                <DateRange
                  ranges={[formData.dateRange]}
                  onChange={handleDateSelect}
                  months={window.innerWidth >= 768 ? 2 : 1}
                  direction={
                    window.innerWidth >= 768 ? "horizontal" : "vertical"
                  }
                  minDate={new Date()}
                  rangeColors={["#f97316"]}
                />
              </div>
            )}
          </div>

          {/* Guests */}
          <div className="relative md:w-1/6">
            <GuestsInput
              value={formData.adults}
              onChange={handleGuestsChange}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3 px-8 bg-gradient-to-r from-neutral-600 to-neutral-700 text-white font-semibold hover:from-neutral-700 hover:to-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-all transform"
          >
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <>
                <FaSearch />
                <span className="hidden md:inline cursor-pointer">
                  Rechercher
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchListing;
