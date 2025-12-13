import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useFacilityCategoryStore = create((set, get) => ({
  facilityCategories: [],
  isLoading: false,
  error: null,

  // Fetch all facility categories
  fetchFacilityCategories: async (languageCode = "en") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/facility-categories?language=${languageCode}`
      );
      set({ facilityCategories: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch facility categories",
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch a single facility category
  fetchFacilityCategory: async (id, languageCode = "en") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/facility-categories/${id}?language=${languageCode}`
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch facility category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Add a new facility category
  addFacilityCategory: async (facilityCategory) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/facility-categories`,
        facilityCategory,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        facilityCategories: [...state.facilityCategories, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to add facility category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update a facility category
  updateFacilityCategory: async (id, facilityCategory) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/facility-categories/${id}`,
        facilityCategory,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        facilityCategories: state.facilityCategories.map((cat) =>
          cat.id === id ? response.data : cat
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to update facility category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a facility category
  deleteFacilityCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/facility-categories/${id}`);
      set((state) => ({
        facilityCategories: state.facilityCategories.filter(
          (cat) => cat.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to delete facility category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
