import { create } from "zustand";
import axios from "@/lib/axios";

export const usePropertyStore = create((set, get) => ({
  properties: [],
  total: 0,
  currentPage: 1,
  perPage: 15,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchProperties: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");

      const queryParams = {
        page: params.page || 1,
        per_page: params.per_page || get().perPage,
        lang: params.lang || "en",
      };

      // Add filters
      if (params.search) queryParams.search = params.search;
      if (params.property_type_id)
        queryParams.property_type_id = params.property_type_id;
      if (params.city_id) queryParams.city_id = params.city_id;
      if (params.listing_type) queryParams.listing_type = params.listing_type;
      if (params.status) queryParams.status = params.status;
      if (params.min_price) queryParams.min_price = params.min_price;
      if (params.max_price) queryParams.max_price = params.max_price;
      if (params.bedroom_count)
        queryParams.bedroom_count = params.bedroom_count;
      if (params.guest_capacity)
        queryParams.guest_capacity = params.guest_capacity;
      if (params.sort_by) queryParams.sort_by = params.sort_by;
      if (params.sort_order) queryParams.sort_order = params.sort_order;

      const response = await axios.get("/api/properties", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        properties: response.data.data,
        total: response.data.total,
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        totalPages: response.data.last_page,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch properties",
        isLoading: false,
      });
      console.error("Failed to fetch properties:", error);
      throw error;
    }
  },

  getProperty: async (id, lang = "en") => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/properties/${id}`, {
        params: { lang },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch property",
        isLoading: false,
      });
      console.error("Failed to fetch property:", error);
      throw error;
    }
  },

  addProperty: async (propertyData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/properties", propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        properties: [response.data, ...state.properties],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to add property",
        isLoading: false,
      });
      console.error("Failed to add property:", error);
      throw error;
    }
  },

  updateProperty: async (id, propertyData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");

      // Determine if we need multipart for images
      const isFormData = propertyData instanceof FormData;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (isFormData) {
        headers["Content-Type"] = "multipart/form-data";
        propertyData.append("_method", "PUT");
      }

      const response = await axios.post(`/api/properties/${id}`, propertyData, {
        headers,
      });

      set((state) => ({
        properties: state.properties.map((property) =>
          property.id === id ? response.data : property
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to update property",
        isLoading: false,
      });
      console.error("Failed to update property:", error);
      throw error;
    }
  },

  deleteProperty: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        properties: state.properties.filter((property) => property.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to delete property",
        isLoading: false,
      });
      console.error("Failed to delete property:", error);
      throw error;
    }
  },

  setPage: (page) => {
    set({ currentPage: page });
  },

  setPerPage: (perPage) => {
    set({ perPage });
  },
}));
