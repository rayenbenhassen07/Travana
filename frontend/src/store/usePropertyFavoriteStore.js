import { create } from "zustand";
import axios from "@/lib/axios";

export const usePropertyFavoriteStore = create((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/property-favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ favorites: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch favorites",
        isLoading: false,
      });
      console.error("Failed to fetch favorites:", error);
      throw error;
    }
  },

  toggleFavorite: async (propertyId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/property-favorites/toggle",
        { property_id: propertyId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh favorites list
      await get().fetchFavorites();

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to toggle favorite",
        isLoading: false,
      });
      console.error("Failed to toggle favorite:", error);
      throw error;
    }
  },

  checkFavorite: async (propertyId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/property-favorites/check/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ isLoading: false });
      return response.data.is_favorited;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to check favorite status",
        isLoading: false,
      });
      console.error("Failed to check favorite status:", error);
      throw error;
    }
  },

  isFavorited: (propertyId) => {
    return get().favorites.some(
      (favorite) => favorite.property_id === propertyId
    );
  },
}));
