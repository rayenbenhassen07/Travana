"use client";
import React from "react";
import {
  Input,
  Textarea,
  SelectWithSearch,
  Button,
} from "@/components/shared/inputs";
import { FaCalendar, FaUsers } from "react-icons/fa";

const ReservationForm = ({
  formData,
  setFormData,
  formErrors,
  listings,
  users,
  clientTypeOptions,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit = false,
}) => {
  return (
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

      {/* Duration and Price Preview */}
      {formData.start_date && formData.end_date && formData.listing_id && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-600 mb-1">Duration</p>
              <p className="text-lg font-bold text-neutral-800">
                {Math.ceil(
                  (new Date(formData.end_date) -
                    new Date(formData.start_date)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                night(s)
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-600 mb-1">Estimated Total</p>
              <p className="text-lg font-bold text-primary-600">
                $
                {(
                  Math.ceil(
                    (new Date(formData.end_date) -
                      new Date(formData.start_date)) /
                      (1000 * 60 * 60 * 24)
                  ) *
                  (listings.find((l) => l.id == formData.listing_id)?.price ||
                    0)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

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
        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
        placeholder="Enter any additional details or notes"
        rows={3}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={isEdit ? "is_blocked_edit" : "is_blocked"}
          checked={formData.is_blocked}
          onChange={(e) =>
            setFormData({ ...formData, is_blocked: e.target.checked })
          }
          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
        />
        <label
          htmlFor={isEdit ? "is_blocked_edit" : "is_blocked"}
          className="text-sm font-medium text-neutral-700 cursor-pointer"
        >
          Block these dates (no guest required)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
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
          {isEdit ? "Update Reservation" : "Create Reservation"}
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;
