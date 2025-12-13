"use client";
import React, { useState, useEffect } from "react";
import { usePropertyStore } from "@/store/usePropertyStore";
import { usePropertyAvailabilityStore } from "@/store/usePropertyAvailabilityStore";
import { Input, Select, Button } from "@/components/shared/inputs";
import { FaCalendar, FaCheck, FaTimes, FaDollarSign } from "react-icons/fa";
import { toast } from "sonner";

const PropertyAvailabilityPage = () => {
  const { properties, fetchProperties } = usePropertyStore();
  const {
    availability,
    fetchAvailability,
    setAvailability,
    setBulkAvailability,
    deleteAvailability,
    isDateAvailable,
    getCustomPrice,
  } = usePropertyAvailabilityStore();

  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Form states for adding/updating availability
  const [formData, setFormData] = useState({
    date: "",
    is_available: true,
    custom_price: "",
  });

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Fetch availability when property or month changes
  useEffect(() => {
    if (selectedProperty) {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split("T")[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
      fetchAvailability(selectedProperty, startDate, endDate);
    }
  }, [selectedProperty, selectedMonth, fetchAvailability]);

  // Get calendar days for the selected month
  const getCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1)
    );
  };

  // Handle date click
  const handleDateClick = (date) => {
    if (!selectedProperty || !date) return;

    const dateStr = date.toISOString().split("T")[0];
    const available = isDateAvailable(dateStr);
    const customPrice = getCustomPrice(dateStr);

    setFormData({
      date: dateStr,
      is_available: available !== false, // Default to true if not set
      custom_price: customPrice || "",
    });
  };

  // Handle save availability
  const handleSaveAvailability = async (e) => {
    e.preventDefault();

    if (!selectedProperty || !formData.date) {
      toast.error("Please select a property and date");
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        date: formData.date,
        is_available: formData.is_available,
        custom_price: formData.custom_price || null,
      };

      await setAvailability(selectedProperty, data);
      toast.success("Availability updated successfully!");

      // Refresh availability
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split("T")[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
      await fetchAvailability(selectedProperty, startDate, endDate);

      // Reset form
      setFormData({ date: "", is_available: true, custom_price: "" });
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bulk set available
  const handleBulkSetAvailable = async (isAvailable) => {
    if (!selectedProperty) {
      toast.error("Please select a property");
      return;
    }

    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    setIsLoading(true);
    try {
      await setBulkAvailability(selectedProperty, {
        start_date: startDate,
        end_date: endDate,
        is_available: isAvailable,
      });
      toast.success(
        `Month marked as ${isAvailable ? "available" : "unavailable"}!`
      );
      await fetchAvailability(selectedProperty, startDate, endDate);
    } catch (error) {
      toast.error("Failed to update bulk availability");
    } finally {
      setIsLoading(false);
    }
  };

  const calendarDays = getCalendarDays();
  const monthName = selectedMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-800 flex items-center gap-3">
          <FaCalendar /> Property Availability Calendar
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage property availability and custom pricing
        </p>
      </div>

      {/* Property Selection */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4">
        <Select
          label="Select Property"
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          options={[
            { value: "", label: "Choose a property..." },
            ...properties.map((prop) => ({
              value: prop.id,
              label: `${prop.name} - ${prop.city?.name || "No city"}`,
            })),
          ]}
        />
      </div>

      {selectedProperty && (
        <>
          {/* Month Navigation */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <Button variant="secondary" onClick={handlePreviousMonth}>
                Previous
              </Button>
              <h2 className="text-xl font-bold">{monthName}</h2>
              <Button variant="secondary" onClick={handleNextMonth}>
                Next
              </Button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleBulkSetAvailable(true)}
                disabled={isLoading}
              >
                Mark Month Available
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleBulkSetAvailable(false)}
                disabled={isLoading}
              >
                Mark Month Unavailable
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-neutral-700 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((date, index) => {
                if (!date) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square" />
                  );
                }

                const dateStr = date.toISOString().split("T")[0];
                const available = isDateAvailable(dateStr);
                const customPrice = getCustomPrice(dateStr);
                const isSelected = formData.date === dateStr;
                const isToday =
                  dateStr === new Date().toISOString().split("T")[0];

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square p-2 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary-500 bg-primary-50"
                        : available
                        ? "border-green-300 bg-green-50 hover:bg-green-100"
                        : available === false
                        ? "border-red-300 bg-red-50 hover:bg-red-100"
                        : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                    } ${isToday ? "ring-2 ring-primary-400" : ""}`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{date.getDate()}</div>
                      {customPrice && (
                        <div className="text-xs text-primary-600 font-semibold mt-1">
                          ${customPrice}
                        </div>
                      )}
                      {available !== undefined && (
                        <div className="flex justify-center mt-1">
                          {available ? (
                            <FaCheck className="text-green-600 text-xs" />
                          ) : (
                            <FaTimes className="text-red-600 text-xs" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit Form */}
          {formData.date && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-lg font-bold mb-4">
                Edit Availability for {formData.date}
              </h3>
              <form onSubmit={handleSaveAvailability} className="space-y-4">
                <Select
                  label="Availability Status"
                  value={formData.is_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_available: e.target.value === "true",
                    })
                  }
                  options={[
                    { value: true, label: "Available" },
                    { value: false, label: "Unavailable" },
                  ]}
                />

                <Input
                  label="Custom Price (Optional)"
                  type="number"
                  value={formData.custom_price}
                  onChange={(e) =>
                    setFormData({ ...formData, custom_price: e.target.value })
                  }
                  placeholder="Leave empty to use default price"
                  min="0"
                  step="0.01"
                  icon={<FaDollarSign />}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setFormData({
                        date: "",
                        is_available: true,
                        custom_price: "",
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Availability"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Legend */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <h4 className="font-semibold mb-3">Legend:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-green-300 bg-green-50"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-red-300 bg-red-50"></div>
                <span className="text-sm">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-neutral-200 bg-neutral-50"></div>
                <span className="text-sm">Not Set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-primary-500 bg-primary-50"></div>
                <span className="text-sm">Selected</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyAvailabilityPage;
