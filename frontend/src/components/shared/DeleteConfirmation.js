"use client";
import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

/**
 * Delete Confirmation Dialog Component
 *
 * @param {Boolean} isOpen - Controls dialog visibility
 * @param {Function} onClose - Callback when dialog closes
 * @param {Function} onConfirm - Callback when delete is confirmed
 * @param {String} title - Confirmation title
 * @param {String} message - Confirmation message
 * @param {String} itemName - Name of item being deleted (optional)
 * @param {Boolean} isLoading - Loading state during deletion
 */
const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <FaTimes size={18} />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-neutral-800 mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-center text-neutral-600 mb-1">{message}</p>

            {/* Item Name */}
            {itemName && (
              <p className="text-center font-semibold text-neutral-800 mb-4">
                "{itemName}"
              </p>
            )}

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700 text-center">
                This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
