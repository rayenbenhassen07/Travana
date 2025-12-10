import { create } from "zustand";
import axios from "@/lib/axios";

export const useListingStore = create((set, get) => ({
  listings: [],
  total: 0,
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    cityId: null,
    roomCount: null,
    guestCount: null,
    bedCount: null,
    bathroomCount: null,
    minPrice: null,
    maxPrice: null,
    categoryId: null,
    facilityIds: [],
    priceCategory: null, // Added priceCategory
  },

  fetchListings: async (page = 1, limit = 10, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");

      // Build query params
      const params = {
        page,
        limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.city_id) params.city_id = filters.city_id;
      if (filters.city) params.city = filters.city;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.user_id) params.user_id = filters.user_id;
      if (filters.guests) params.guests = filters.guests;
      if (filters.check_in) params.check_in = filters.check_in;
      if (filters.check_out) params.check_out = filters.check_out;

      const response = await axios.get("/api/listings", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        listings: response.data.data,
        total: response.data.pagination.total,
        currentPage: response.data.pagination.currentPage,
        itemsPerPage: limit,
        totalPages: response.data.pagination.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch listings",
        isLoading: false,
      });
      console.error("Failed to fetch listings:", error);
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchListings(1, get().itemsPerPage, {
      ...get().filters,
      ...newFilters,
    });
  },

  setItemsPerPage: (perPage) => {
    set({ itemsPerPage: perPage });
    get().fetchListings(1, perPage, get().filters);
  },

  addListing: async (listingData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/listings", listingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getListing: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateListing: async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`/api/listings/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { currentPage, itemsPerPage, filters, listings } = get();

      if (listings.length === 1 && currentPage > 1) {
        await get().fetchListings(currentPage - 1, itemsPerPage, filters);
      } else {
        await get().fetchListings(currentPage, itemsPerPage, filters);
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete listing",
        isLoading: false,
      });
      console.error("Failed to delete listing:", error);
      throw error;
    }
  },
}));
