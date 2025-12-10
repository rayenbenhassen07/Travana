"use client";
import React from "react";
import Modal from "@/components/shared/Modal";
import {
  Input,
  Textarea,
  SelectWithSearch,
  Button,
} from "@/components/shared/inputs";
import { FaCalendar, FaUsers } from "react-icons/fa";

const ReservationModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  formErrors,
  isSubmitting,
  listings,
  users,
  mode = "add", // 'add' or 'edit'
  title,
}) => {
  // Client type options
  const clientTypeOptions = [
    { value: "family", label: "Family" },
    { value: "group", label: "Group" },
    { value: "one", label: "Individual" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        title ||
        (mode === "add" ? "Create New Reservation" : "Edit Reservation")
      }
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectWithSearch
            label="Listing"
            name="listing_id"
            value={formData.listing_id}
            onChange={(e) =>
              setFormData({ ...formData, listing_id: e.target.value })
            }
            options={listings.map((listing) => ({
              value: listing.id,
              label: listing.title,
            }))}
            error={formErrors.listing_id}
            required
          />

          <SelectWithSearch
            label="Guest"
            name="user_id"
            value={formData.user_id}
            onChange={(e) =>
              setFormData({ ...formData, user_id: e.target.value })
            }
            options={users.map((user) => ({
              value: user.id,
              label: `${user.name} (${user.email})`,
            }))}
            error={formErrors.user_id}
            required={!formData.is_blocked}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Check-in Date"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            error={formErrors.start_date}
            required
            icon={<FaCalendar />}
          />

          <Input
            label="Check-out Date"
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            error={formErrors.end_date}
            required
            icon={<FaCalendar />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Number of Guests"
            type="number"
            name="guest_count"
            value={formData.guest_count}
            onChange={(e) =>
              setFormData({ ...formData, guest_count: e.target.value })
            }
            min="1"
            icon={<FaUsers />}
          />

          <SelectWithSearch
            label="Client Type"
            name="client_type"
            value={formData.client_type}
            onChange={(e) =>
              setFormData({ ...formData, client_type: e.target.value })
            }
            options={clientTypeOptions}
          />
        </div>

        <Textarea
          label="Details / Notes"
          name="details"
          value={formData.details}
          onChange={(e) =>
            setFormData({ ...formData, details: e.target.value })
          }
          placeholder="Enter any additional details or notes"
          rows={3}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`is_blocked_${mode}`}
            checked={formData.is_blocked}
            onChange={(e) =>
              setFormData({ ...formData, is_blocked: e.target.checked })
            }
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
          />
          <label
            htmlFor={`is_blocked_${mode}`}
            className="text-sm font-medium text-neutral-700 cursor-pointer"
          >
            Block these dates (no guest required)
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            {mode === "add" ? "Create Reservation" : "Update Reservation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservationModal;
