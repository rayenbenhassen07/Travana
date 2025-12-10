"use client";

import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaHome,
  FaSpinner,
} from "react-icons/fa";
import useAuthStore from "@/store/useAuthStore";
import { useReservationStore } from "@/store/useReservationStore";
import { Select } from "@/components/shared/inputs/Select";

const ReservationConfirmModal = ({
  isOpen,
  onClose,
  listing,
  checkIn,
  checkOut,
  guests,
  pricing,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const { addReservation, isLoading } = useReservationStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    sex: "",
    clientType: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        sex: user.sex || "",
      }));
    }
    // Set default client type based on guests
    setFormData((prev) => ({
      ...prev,
      clientType: guests === 1 ? "one" : guests <= 4 ? "family" : "group",
    }));
  }, [user, guests]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields for all users
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    }
    if (!formData.sex) {
      newErrors.sex = "Le sexe est requis";
    }
    if (!formData.clientType) {
      newErrors.clientType = "Le type de client est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    try {
      // Prepare reservation data matching backend structure
      const reservationData = {
        listing_id: listing.id,
        user_id: user?.id || null,
        start_date: checkIn,
        end_date: checkOut,
        is_blocked: false,
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        sex: formData.sex,
        client_type: formData.clientType,
        nights: pricing?.nights || 0,
        total: pricing?.total || 0,
        subtotal: pricing?.subtotal || 0,
        per_night: listing.price,
        service_fee: pricing?.serviceFee || 0,
        currency_id: 1, // Default currency ID
      };

      const result = await addReservation(reservationData);

      // Set success data to show success message
      setSuccessData({
        ref: result.ref,
        checkIn: checkIn,
        checkOut: checkOut,
        email: formData.email,
        total: pricing?.total || 0,
      });

      // Reset form on success
      setFormData({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        sex: user?.sex || "",
        clientType: "",
        specialRequests: "",
      });

      // Success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setSubmitError(
        error.response?.data?.errors?.start_date?.[0] ||
          error.response?.data?.message ||
          "Une erreur est survenue lors de la réservation"
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h3 className="text-xl font-bold text-secondary-900">
              Confirmer la réservation
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {successData ? (
              /* Success Message */
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  Réservation confirmée !
                </h3>
                <p className="text-neutral-600 mb-6">
                  Votre réservation a été enregistrée avec succès
                </p>

                <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 mb-6">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">
                        Référence
                      </span>
                      <span className="font-semibold text-secondary-900">
                        {successData.ref}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Dates</span>
                      <span className="font-medium text-secondary-900">
                        {new Date(successData.checkIn).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        →{" "}
                        {new Date(successData.checkOut).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-primary-200">
                      <span className="text-sm text-neutral-600">Total</span>
                      <span className="text-xl font-bold text-primary-600">
                        ${successData.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Email de confirmation envoyé
                      </p>
                      <p className="text-sm text-green-700">
                        Un email avec tous les détails de votre réservation a
                        été envoyé à{" "}
                        <span className="font-semibold">
                          {successData.email}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSuccessData(null);
                    onClose();
                  }}
                  className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                {/* Reservation Summary */}
                <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.images?.[0] && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${listing.images[0]}`}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-secondary-900 truncate">
                        {listing.title}
                      </h4>
                      <p className="text-sm text-neutral-500 flex items-center gap-1">
                        <FaHome className="w-3 h-3" />
                        {listing.city?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <FaCalendarAlt className="w-4 h-4 text-neutral-400" />
                      <span>
                        {formatDate(checkIn)} → {formatDate(checkOut)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <FaUsers className="w-4 h-4 text-neutral-400" />
                      <span>
                        {guests} invité{guests > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  {pricing && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2 text-sm">
                      <div className="flex justify-between text-neutral-600">
                        <span>
                          ${listing.price} × {pricing.nights} nuits
                        </span>
                        <span>${pricing.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Frais de service</span>
                        <span>${pricing.serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-secondary-900 pt-2 border-t border-neutral-200">
                        <span>Total</span>
                        <span>${pricing.total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Contact Information - Always editable */}
                  <div className="space-y-4 mb-4">
                    {user && (
                      <p className="text-sm text-green-600 font-medium mb-2 flex items-center gap-2">
                        <FaUser className="w-4 h-4" />
                        Connecté en tant que {user.name}
                      </p>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-900 mb-1">
                        Nom complet *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Jean Dupont"
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.fullName
                              ? "border-red-300 focus:border-red-500"
                              : "border-neutral-200 focus:border-primary-500"
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-900 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jean@exemple.com"
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.email
                              ? "border-red-300 focus:border-red-500"
                              : "border-neutral-200 focus:border-primary-500"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-900 mb-1">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+216 XX XXX XXX"
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.phone
                              ? "border-red-300 focus:border-red-500"
                              : "border-neutral-200 focus:border-primary-500"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Sex */}
                    <Select
                      label="Sexe"
                      name="sex"
                      value={formData.sex}
                      onChange={handleInputChange}
                      options={[
                        { value: "male", label: "Homme" },
                        { value: "female", label: "Femme" },
                      ]}
                      placeholder="Sélectionner"
                      error={errors.sex}
                      required
                    />

                    {/* Client Type */}
                    <Select
                      label="Type de séjour"
                      name="clientType"
                      value={formData.clientType}
                      onChange={handleInputChange}
                      options={[
                        { value: "one", label: "Seul" },
                        { value: "family", label: "Famille (2-4 personnes)" },
                        { value: "group", label: "Groupe (5+ personnes)" },
                      ]}
                      placeholder="Sélectionner"
                      error={errors.clientType}
                      required
                    />
                  </div>

                  {/* Special Requests (optional for everyone) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-secondary-900 mb-1">
                      Demandes spéciales (optionnel)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Arrivée tardive, besoins particuliers..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                      <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-md hover:from-primary-600 hover:to-primary-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        Réservation en cours...
                      </>
                    ) : (
                      "Confirmer la réservation"
                    )}
                  </button>

                  <p className="text-center text-sm text-neutral-500 mt-3">
                    Vous ne serez pas encore débité
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmModal;
