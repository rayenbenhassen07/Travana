import { create } from "zustand";
import axios from "@/lib/axios";

export const usePropertyAvailabilityStore = create((set, get) => ({
  availability: [],
  isLoading: false,
  error: null,

  fetchAvailability: async (propertyId, startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/properties/${propertyId}/availability`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ availability: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch availability",
        isLoading: false,
      });
      console.error("Failed to fetch availability:", error);
      throw error;
    }
  },

  setAvailability: async (propertyId, availabilityData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/properties/${propertyId}/availability`,
        availabilityData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to set availability",
        isLoading: false,
      });
      console.error("Failed to set availability:", error);
      throw error;
    }
  },

  setBulkAvailability: async (propertyId, bulkData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/properties/${propertyId}/availability/bulk`,
        bulkData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to set bulk availability",
        isLoading: false,
      });
      console.error("Failed to set bulk availability:", error);
      throw error;
    }
  },

  deleteAvailability: async (propertyId, date) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/properties/${propertyId}/availability/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        availability: state.availability.filter((item) => item.date !== date),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to delete availability",
        isLoading: false,
      });
      console.error("Failed to delete availability:", error);
      throw error;
    }
  },

  isDateAvailable: (date) => {
    const dateAvailability = get().availability.find(
      (item) => item.date === date
    );
    return dateAvailability ? dateAvailability.is_available : true;
  },

  getCustomPrice: (date) => {
    const dateAvailability = get().availability.find(
      (item) => item.date === date
    );
    return dateAvailability?.custom_price || null;
  },
}));
