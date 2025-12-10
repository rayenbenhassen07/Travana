import axios from "@/lib/axios";
import { create } from "zustand";

export const useReservationStore = create((set) => ({
  reservations: [],
  isLoading: false,
  error: null,

  fetchReservations: async (
    listingId = null,
    startDate = null,
    endDate = null
  ) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      let url = "/api/listing-reservations";
      const params = new URLSearchParams();

      if (listingId) params.append("listing_id", listingId);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ reservations: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  addReservation: async (reservationData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/listing-reservations",
        reservationData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      set((state) => ({
        reservations: [...state.reservations, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      console.error("Failed to add reservation:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  updateReservation: async (id, reservationData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/listing-reservations/${id}`,
        reservationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        reservations: state.reservations.map((reservation) =>
          reservation.id === id ? response.data : reservation
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      console.error("Failed to update reservation:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  deleteReservation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/listing-reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        reservations: state.reservations.filter(
          (reservation) => reservation.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete reservation:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // Block dates (create blocked reservation)
  blockDates: async (blockData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const reservationData = {
        ...blockData,
        is_blocked: true,
      };
      const response = await axios.post(
        "/api/listing-reservations",
        reservationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        reservations: [...state.reservations, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      console.error("Failed to block dates:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },
}));
