import { create } from "zustand";
import axios from "@/lib/axios";

export const useCityStore = create((set, get) => ({
  cities: [],
  isLoading: false,
  error: null,

  fetchCities: async (lang = "en") => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/cities", {
        params: { lang },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ cities: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch cities",
        isLoading: false,
      });
      console.error("Failed to fetch cities:", error);
    }
  },

  addCity: async (cityData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/cities", cityData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        cities: [response.data, ...state.cities],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add city",
        isLoading: false,
      });
      console.error("Failed to add city:", error);
      throw error;
    }
  },

  updateCity: async (id, cityData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/cities/${id}`, cityData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        cities: state.cities.map((city) =>
          city.id === id ? response.data : city
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update city",
        isLoading: false,
      });
      console.error("Failed to update city:", error);
      throw error;
    }
  },

  deleteCity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/cities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        cities: state.cities.filter((city) => city.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete city",
        isLoading: false,
      });
      console.error("Failed to delete city:", error);
      throw error;
    }
  },
}));
