"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useListingStore } from "@/store/useListingStore";
import { useReservationStore } from "@/store/useReservationStore";
import { LoadingSpinner } from "@/components/Loading";
import PhotoGalleryModal from "@/components/shared/PhotoGalleryModal";
import {
  BookingCard,
  BookingModal,
  ListingGallery,
  ListingHeader,
  ListingInfo,
  MobileBottomBar,
  ReservationConfirmModal,
} from "@/components/(app)/listings/detail";

const ListingDetails = ({ listingId }) => {
  const router = useRouter();
  const { getListing } = useListingStore();
  const { reservations, fetchReservations } = useReservationStore();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);

  // Booking State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const data = await getListing(listingId);
        setListing(data);

        // Check if favorited
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(parseInt(listingId)));
      } catch (err) {
        setError("Failed to load listing details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
      // Fetch reservations for this listing
      fetchReservations(listingId);
    }
  }, [listingId, getListing, fetchReservations]);

  // Filter reservations for this listing
  const listingReservations = reservations.filter(
    (r) => r.listing_id === parseInt(listingId)
  );

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const id = parseInt(listingId);

    if (isFavorite) {
      const newFavorites = favorites.filter((fav) => fav !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing?.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !listing) return null;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;

    const subtotal = listing.price * nights;
    const serviceFee = subtotal * 0.12;
    const total = subtotal + serviceFee;

    return { nights, subtotal, serviceFee, total };
  };

  const pricing = calculateTotalPrice();

  const handleReserve = () => {
    setShowReservationModal(true);
  };

  const handleReservationSuccess = () => {
    // Clear dates and guests after successful reservation
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    // Refresh reservations
    fetchReservations(listingId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
            {error || "Listing not found"}
          </h2>
          <p className="text-neutral-500 mb-6">
            The listing you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/listings")}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Browse all listings
          </button>
        </div>
      </div>
    );
  }

  const images = listing.images || [];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Mobile Header */}
        <ListingHeader
          listing={listing}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
        />

        {/* Image Gallery */}
        <ListingGallery
          images={images}
          title={listing.title}
          currentPhotoIndex={currentPhotoIndex}
          onPhotoIndexChange={setCurrentPhotoIndex}
          onShowAllPhotos={() => setShowAllPhotos(true)}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Left Column - Details */}
            <ListingInfo
              listing={listing}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />

            {/* Right Column - Booking Card */}
            <BookingCard
              listing={listing}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              onGuestsChange={setGuests}
              pricing={pricing}
              reservedDates={listingReservations}
              onReserve={handleReserve}
            />
          </div>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <MobileBottomBar
          listing={listing}
          onReserve={() => setShowBookingModal(true)}
        />
      </div>

      {/* Full Screen Photo Gallery Modal */}
      <PhotoGalleryModal
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
        images={images}
        currentIndex={currentPhotoIndex}
        onIndexChange={setCurrentPhotoIndex}
      />

      {/* Mobile Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        listing={listing}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        onGuestsChange={setGuests}
        pricing={pricing}
        reservedDates={listingReservations}
        onReserve={handleReserve}
      />

      {/* Reservation Confirmation Modal */}
      <ReservationConfirmModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        listing={listing}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        pricing={pricing}
        onSuccess={handleReservationSuccess}
      />
    </>
  );
};

export default ListingDetails;
