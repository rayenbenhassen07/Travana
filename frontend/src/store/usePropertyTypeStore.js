import { create } from "zustand";
import axios from "@/lib/axios";

export const usePropertyTypeStore = create((set, get) => ({
  propertyTypes: [],
  isLoading: false,
  error: null,

  fetchPropertyTypes: async (lang = "en") => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/property-types", {
        params: { lang },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ propertyTypes: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch property types",
        isLoading: false,
      });
      console.error("Failed to fetch property types:", error);
    }
  },

  addPropertyType: async (propertyTypeData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/property-types",
        propertyTypeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        propertyTypes: [response.data, ...state.propertyTypes],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add property type",
        isLoading: false,
      });
      console.error("Failed to add property type:", error);
      throw error;
    }
  },

  updatePropertyType: async (id, propertyTypeData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/property-types/${id}`,
        propertyTypeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        propertyTypes: state.propertyTypes.map((type) =>
          type.id === id ? response.data : type
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to update property type",
        isLoading: false,
      });
      console.error("Failed to update property type:", error);
      throw error;
    }
  },

  deletePropertyType: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/property-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        propertyTypes: state.propertyTypes.filter((type) => type.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to delete property type",
        isLoading: false,
      });
      console.error("Failed to delete property type:", error);
      throw error;
    }
  },

  getPropertyType: async (id, lang = "en") => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/property-types/${id}`, {
        params: { lang },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch property type",
        isLoading: false,
      });
      console.error("Failed to fetch property type:", error);
      throw error;
    }
  },
}));
