"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { BiSearch } from "react-icons/bi";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useRouter } from "next/navigation";
import { cities } from "@/data/cities";
// import useSearchModal from "@/hooks/useSearchModal";

const Search = () => {
  const params = useSearchParams();
  const router = useRouter();
  // const search = useSearchModal();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [focusedOption, setFocusedOption] = useState(null);
  const datePickerRef = useRef(null);
  const roomDropdownRef = useRef(null);
  const destinationRef = useRef(null);

  // Initial values from URL params
  const initialLocation = params?.get("locationValue") || "";
  const initialStartDate = params?.get("startDate")
    ? new Date(params.get("startDate"))
    : new Date();
  const initialEndDate = params?.get("endDate")
    ? new Date(params.get("endDate"))
    : new Date(new Date().setDate(new Date().getDate() + 1));
  const initialGuestCount = params?.get("guestCount") || "2";

  const [formData, setFormData] = useState({
    destination: initialLocation,
    dateRange: {
      startDate: initialStartDate,
      endDate: initialEndDate,
      key: "selection",
    },
    guests: parseInt(initialGuestCount),
  });

  // const onSearch = useCallback(() => {
  //   search.onOpen();
  // }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDatePickerOpen &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
        setFocusedOption(null);
      }
      if (
        isRoomDropdownOpen &&
        roomDropdownRef.current &&
        !roomDropdownRef.current.contains(event.target)
      ) {
        setIsRoomDropdownOpen(false);
        setFocusedOption(null);
      }
      if (
        isDestinationOpen &&
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setIsDestinationOpen(false);
        setFocusedOption(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDatePickerOpen, isRoomDropdownOpen, isDestinationOpen]);

  const adresse = useMemo(() => {
    return formData.destination || "Choisir le lieu";
  }, [formData.destination]);

  const departureLabel = useMemo(() => {
    return format(formData.dateRange.startDate, "d MMM", { locale: fr });
  }, [formData.dateRange.startDate]);

  const arrivalLabel = useMemo(() => {
    return format(formData.dateRange.endDate, "d MMM", { locale: fr });
  }, [formData.dateRange.endDate]);

  const guestLabel = useMemo(() => {
    return formData.guests
      ? `${formData.guests} voyageur${formData.guests > 1 ? "s" : ""}`
      : "Ajouter des voyageurs";
  }, [formData.guests]);

  const handleDateSelect = (ranges) => {
    setFormData({
      ...formData,
      dateRange: {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
        key: "selection",
      },
    });
  };

  const handleGuestChange = (operation) => {
    setFormData((prev) => ({
      ...prev,
      guests:
        operation === "increase"
          ? prev.guests + 1
          : Math.max(1, prev.guests - 1),
    }));
  };

  const handleDestinationSelect = (state) => {
    setFormData((prev) => ({
      ...prev,
      destination: state,
    }));
    setIsDestinationOpen(false);
  };

  const handleSubmit = () => {
    const query = {
      locationValue: formData.destination,
      startDate: formData.dateRange.startDate.toLocaleDateString("fr-CA"),
      endDate: formData.dateRange.endDate.toLocaleDateString("fr-CA"),
      guestCount: formData.guests.toString(),
    };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/listings?${queryString}`);
    setIsDatePickerOpen(false);
    setIsRoomDropdownOpen(false);
    setIsDestinationOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="
          w-full
          md:w-auto
          border-[1px]
          shadow-md
          hover:shadow-xl
          transition
          cursor-pointer
          rounded-full
        "
      >
        {/* Phone search */}
        <div
          className="px-3 lg:hidden flex justify-center items-center gap-2"
          onClick={() => {}}
        >
          <div className="w-full">
            <div className="text-xs font-semibold text-gray-900">
              Commencer la recherche
            </div>
            <div className="text-xs text-gray-600 whitespace-nowrap">
              Choisir le lieu, date et voyageurs
            </div>
          </div>
          <div
            className="
              p-2
              ml-2
              bg-green-500
              rounded-full
              text-white
            "
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <BiSearch size={18} />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex flex-row items-center justify-between">
            {/* Destination */}
            <div
              className={`
                text-sm
                px-6
                relative
                flex-1
                rounded-l-full
                hover:bg-green-100
                py-3
                h-full
                ${focusedOption === "destination" ? "bg-green-100 " : ""}
              `}
              onClick={() => {
                setFocusedOption("destination");
                setIsDestinationOpen(!isDestinationOpen);
                setIsDatePickerOpen(false);
                setIsRoomDropdownOpen(false);
              }}
            >
              <div className="text-xs font-semibold text-gray-900">
                Destination
              </div>
              <div className="text-xs text-gray-600 whitespace-nowrap">
                {adresse}
              </div>
            </div>

            {/* Arrivée */}
            <div
              className={`
                text-sm
                px-6
                border-x-[1px]
                py-2
                hover:bg-green-100
                flex-1
                text-center
                relative
                ${focusedOption === "arrival" ? "bg-green-100 " : ""}
              `}
              onClick={() => {
                setFocusedOption("arrival");
                setIsDatePickerOpen(!isDatePickerOpen);
                setIsRoomDropdownOpen(false);
                setIsDestinationOpen(false);
              }}
            >
              <div className="text-xs font-semibold text-gray-900">Arrivée</div>
              <div className="text-sm text-gray-600">{arrivalLabel}</div>
            </div>

            {/* Départ */}
            <div
              className={`
                text-sm
                py-2
                px-6
                border-r-[1px]
                flex-1
                text-center
                hover:bg-green-100
                relative
                ${
                  focusedOption === "departure" ? "bg-green-100 rounded-lg" : ""
                }
              `}
              onClick={() => {
                setFocusedOption("departure");
                setIsDatePickerOpen(!isDatePickerOpen);
                setIsRoomDropdownOpen(false);
                setIsDestinationOpen(false);
              }}
            >
              <div className="text-xs font-semibold text-gray-900">Départ</div>
              <div className="text-sm text-gray-600">{departureLabel}</div>
            </div>

            {/* Voyageurs */}
            <div
              className={`
                text-sm
                pl-6
                py-2
                pr-2
                flex
                flex-row
                items-center
                rounded-r-full
                gap-3
                relative
                flex-1
                hover:bg-green-100
                ${focusedOption === "guests" ? "bg-green-100 rounded-lg" : ""}
              `}
              onClick={() => {
                setFocusedOption("guests");
                setIsRoomDropdownOpen(!isRoomDropdownOpen);
                setIsDatePickerOpen(false);
                setIsDestinationOpen(false);
              }}
            >
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-900">
                  Voyageurs
                </div>
                <div className="text-sm w-24 text-gray-600">{guestLabel}</div>
              </div>
              <div
                className="
                  p-2
                  bg-green-500
                  rounded-full
                  text-white
                "
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
              >
                <BiSearch size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Dropdown */}
      {isDestinationOpen && (
        <div
          ref={destinationRef}
          className="
            absolute
            z-50
            bg-white
            border
            rounded-lg
            shadow-lg
            p-4
            mt-2
            left-0
            max-h-60
            overflow-y-auto
          "
        >
          {cities.map((city) => (
            <div
              key={city}
              className="
                px-4
                py-2
                hover:bg-gray-100
                cursor-pointer
              "
              onClick={() => handleDestinationSelect(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}

      {/* Date Picker Dropdown */}
      {isDatePickerOpen && (
        <div
          ref={datePickerRef}
          className="
            absolute
            z-50
            bg-white
            border
            rounded-lg
            shadow-lg
            p-4
            mt-2
            left-1/2
            -translate-x-1/2
          "
        >
          <DateRange
            ranges={[formData.dateRange]}
            onChange={handleDateSelect}
            minDate={new Date()}
            rangeColors={["#10B981"]}
            months={window.innerWidth >= 768 ? 2 : 1}
            direction={window.innerWidth >= 768 ? "horizontal" : "vertical"}
          />
        </div>
      )}

      {/* Guest Dropdown */}
      {isRoomDropdownOpen && (
        <div
          ref={roomDropdownRef}
          className="
            absolute
            z-50
            bg-white
            border
            rounded-lg
            shadow-lg
            p-4
            mt-2
            right-0
          "
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span>Personnes</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGuestChange("decrease")}
                  className="border rounded-full p-1 w-6 h-6 flex items-center justify-center"
                >
                  -
                </button>
                <span>{formData.guests}</span>
                <button
                  onClick={() => handleGuestChange("increase")}
                  className="border rounded-full p-1 w-6 h-6 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
