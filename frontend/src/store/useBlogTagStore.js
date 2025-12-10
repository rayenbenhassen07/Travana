import { create } from "zustand";
import axios from "@/lib/axios";

export const useBlogTagStore = create((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/blog-tags", {
        params: { all: 1 },
      });
      set({
        tags: response.data.data || response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch blog tags",
        isLoading: false,
      });
      console.error("Failed to fetch blog tags:", error);
    }
  },

  fetchPopularTags: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/blog-tags/popular/list", {
        params: { limit },
      });
      set({
        tags: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch popular tags",
        isLoading: false,
      });
      console.error("Failed to fetch popular tags:", error);
    }
  },

  addTag: async (tagData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/blog-tags", tagData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await get().fetchTags();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTag: async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/blog-tags/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await get().fetchTags();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTag: async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/blog-tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await get().fetchTags();
    } catch (error) {
      throw error;
    }
  },
}));
