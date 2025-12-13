import { create } from "zustand";
import axios from "@/lib/axios";

export const useFacilityStore = create((set, get) => ({
  facilities: [],
  isLoading: false,
  error: null,

  fetchFacilities: async (lang = "en", category = null) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const params = { lang };
      if (category) params.category = category;

      const response = await axios.get("/api/facilities", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ facilities: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch facilities",
        isLoading: false,
      });
      console.error("Failed to fetch facilities:", error);
    }
  },

  getFacility: async (id, lang = "en") => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/facilities/${id}`, {
        params: { lang },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch facility",
        isLoading: false,
      });
      console.error("Failed to fetch facility:", error);
      throw error;
    }
  },

  addFacility: async (facilityData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/facilities", facilityData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        facilities: [response.data, ...state.facilities],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to add facility",
        isLoading: false,
      });
      console.error("Failed to add facility:", error);
      throw error;
    }
  },

  updateFacility: async (id, facilityData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`/api/facilities/${id}`, facilityData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        facilities: state.facilities.map((facility) =>
          facility.id === id ? response.data : facility
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to update facility",
        isLoading: false,
      });
      console.error("Failed to update facility:", error);
      throw error;
    }
  },

  deleteFacility: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/facilities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        facilities: state.facilities.filter((facility) => facility.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to delete facility",
        isLoading: false,
      });
      console.error("Failed to delete facility:", error);
      throw error;
    }
  },

  // Helper to filter facilities by category
  getFacilitiesByCategory: (category) => {
    return get().facilities.filter(
      (facility) => facility.category === category
    );
  },
}));
