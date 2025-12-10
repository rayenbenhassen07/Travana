"use client";
import React, { useState, useEffect } from "react";
import { useListingStore } from "@/store/useListingStore";
import { useReservationStore } from "@/store/useReservationStore";
import { useUserStore } from "@/store/useUserStore";
import ReservationCalendar from "@/components/(admin)/ReservationCalendar";
import {
  ReservationModal,
  ReservationViewModal,
} from "@/components/(admin)/modals";
import { Button } from "@/components/shared/inputs";
import { FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

const CalendarPage = () => {
  const { listings, fetchListings } = useListingStore();
  const {
    reservations,
    fetchReservations,
    addReservation,
    updateReservation,
    deleteReservation,
    isLoading: isReservationsLoading,
  } = useReservationStore();
  const { users, fetchUsers } = useUserStore();

  // UI states
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    user_id: "",
    listing_id: "",
    start_date: "",
    end_date: "",
    guest_count: 1,
    client_type: "family",
    details: "",
    is_blocked: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI states
  const [showPrices, setShowPrices] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsCalendarLoading(true);
      try {
        await Promise.all([
          fetchListings(1, 100), // Get all listings for calendar
          fetchReservations(),
          fetchUsers(),
        ]);
      } catch (error) {
        console.error("Failed to load calendar data:", error);
      } finally {
        setIsCalendarLoading(false);
      }
    };
    loadData();
  }, [fetchListings, fetchReservations, fetchUsers]);

  // Handle month change
  const handleMonthChange = async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get first and last day of the month
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    // Fetch reservations for this month range
    await fetchReservations(null, startDate, endDate);
  };

  // Handle date range selection
  const handleDateRangeSelect = (listing, date) => {
    setSelectedListing(listing);
    setSelectedDate(date);
    setFormData({
      ...formData,
      listing_id: listing.id,
      start_date: date.toISOString().split("T")[0],
      end_date: date.toISOString().split("T")[0],
    });
    setIsAddModalOpen(true);
  };

  // Handle reservation click
  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsViewModalOpen(true);
  };

  // Handle add reservation
  const handleAddReservation = () => {
    setSelectedListing(null);
    setSelectedDate(null);
    setFormData({
      user_id: "",
      listing_id: "",
      start_date: "",
      end_date: "",
      guest_count: 1,
      client_type: "family",
      details: "",
      is_blocked: false,
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Handle edit
  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setFormData({
      user_id: reservation.user_id || "",
      listing_id: reservation.listing_id,
      start_date: reservation.start_date
        ? reservation.start_date.split("T")[0]
        : "",
      end_date: reservation.end_date ? reservation.end_date.split("T")[0] : "",
      guest_count: reservation.guest_count || 1,
      client_type: reservation.client_type || "family",
      details: reservation.details || "",
      is_blocked: reservation.is_blocked || false,
    });
    setFormErrors({});
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (reservation) => {
    setSelectedReservation(reservation);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.listing_id) {
      errors.listing_id = "Listing is required";
    }
    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }
    if (!formData.end_date) {
      errors.end_date = "End date is required";
    }
    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >= formData.end_date
    ) {
      errors.end_date = "End date must be after start date";
    }
    if (!formData.is_blocked && !formData.user_id) {
      errors.user_id = "User is required for regular reservations";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit add
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addReservation(formData);
      toast.success("Reservation created successfully!");
      setIsAddModalOpen(false);
      resetForm();
      fetchReservations();
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const errors = {};
        Object.keys(errorData.errors).forEach((key) => {
          errors[key] = errorData.errors[key][0];
        });
        setFormErrors(errors);
        const firstError = Object.values(errorData.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(errorData?.message || "Failed to create reservation");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateReservation(selectedReservation.id, formData);
      toast.success("Reservation updated successfully!");
      setIsEditModalOpen(false);
      resetForm();
      fetchReservations();
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const errors = {};
        Object.keys(errorData.errors).forEach((key) => {
          errors[key] = errorData.errors[key][0];
        });
        setFormErrors(errors);
        const firstError = Object.values(errorData.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(errorData?.message || "Failed to update reservation");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteReservation(selectedReservation.id);
      toast.success("Reservation deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedReservation(null);
      fetchReservations();
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(
        errorData?.error || errorData?.message || "Failed to delete reservation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      user_id: "",
      listing_id: "",
      start_date: "",
      end_date: "",
      guest_count: 1,
      client_type: "family",
      details: "",
      is_blocked: false,
    });
    setFormErrors({});
    setSelectedReservation(null);
    setSelectedListing(null);
    setSelectedDate(null);
  };

  // Get status badge
  const getStatusBadge = (reservation) => {
    if (reservation.is_blocked) {
      return (
        <span className="px-3 py-1 bg-neutral-700 text-white rounded-full text-sm font-medium">
          Blocked
        </span>
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(reservation.start_date);
    const endDate = new Date(reservation.end_date);

    if (endDate < today) {
      return (
        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium">
          Completed
        </span>
      );
    } else if (startDate <= today && endDate >= today) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Upcoming
        </span>
      );
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Reservation Calendar
          </h1>
          <p className="text-neutral-500 mt-0.5 md:mt-1 text-sm md:text-base">
            Manage bookings across all properties
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setShowPrices(!showPrices)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-xs md:text-sm"
          >
            {showPrices ? (
              <FaEye className="text-xs md:text-sm" />
            ) : (
              <FaEyeSlash className="text-xs md:text-sm" />
            )}
            <span className="font-medium">
              {showPrices ? "Hide" : "Show"} Prices
            </span>
          </button>
          <Button
            icon={<FaPlus className="text-xs md:text-sm" />}
            onClick={handleAddReservation}
            className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
          >
            <span className="hidden sm:inline">Create Reservation</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <ReservationCalendar
        listings={listings}
        reservations={reservations}
        onReservationClick={handleReservationClick}
        onDateRangeSelect={handleDateRangeSelect}
        showPrices={showPrices}
        isLoading={isCalendarLoading}
        onMonthChange={handleMonthChange}
      />

      {/* Modals */}
      <ReservationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        onSubmit={handleSubmitAdd}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        listings={listings}
        users={users}
        mode="add"
      />

      <ReservationViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onEdit={() => handleEdit(selectedReservation)}
        onDelete={() => handleDelete(selectedReservation)}
        getStatusBadge={getStatusBadge}
      />

      <ReservationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        onSubmit={handleSubmitEdit}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        listings={listings}
        users={users}
        mode="edit"
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedReservation(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Reservation"
        message="Are you sure you want to delete this reservation?"
        itemName={`Reservation #${selectedReservation?.id}`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CalendarPage;
