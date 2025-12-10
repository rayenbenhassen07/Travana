"use client";
import React from "react";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/shared/inputs";
import {
  FaHome,
  FaUser,
  FaCalendar,
  FaUsers,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const ReservationViewModal = ({
  isOpen,
  onClose,
  reservation,
  onEdit,
  onDelete,
  getStatusBadge,
}) => {
  if (!reservation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reservation Details"
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">
            Reservation #{reservation.id}
          </h3>
          {getStatusBadge(reservation)}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FaHome className="text-neutral-400 mt-1" />
            <div>
              <p className="text-sm text-neutral-500">Listing</p>
              <p className="font-semibold text-neutral-800">
                {reservation.listing?.title || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaUser className="text-neutral-400 mt-1" />
            <div>
              <p className="text-sm text-neutral-500">Guest</p>
              <p className="font-semibold text-neutral-800">
                {reservation.user?.name || "No guest"}
              </p>
              {reservation.user?.email && (
                <p className="text-sm text-neutral-600">
                  {reservation.user.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaCalendar className="text-neutral-400 mt-1" />
            <div>
              <p className="text-sm text-neutral-500">Dates</p>
              <p className="font-semibold text-neutral-800">
                {new Date(reservation.start_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                -{" "}
                {new Date(reservation.end_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaUsers className="text-neutral-400 mt-1" />
            <div>
              <p className="text-sm text-neutral-500">Guests & Type</p>
              <p className="font-semibold text-neutral-800">
                {reservation.guest_count || "N/A"} guests •{" "}
                {reservation.client_type || "N/A"}
              </p>
            </div>
          </div>

          {reservation.details && (
            <div className="pt-3 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 mb-2">Details</p>
              <p className="text-neutral-700">{reservation.details}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            icon={<FaEdit />}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onDelete}
            icon={<FaTrash />}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReservationViewModal;
