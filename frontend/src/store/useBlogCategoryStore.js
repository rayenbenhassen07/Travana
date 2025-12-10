import { create } from "zustand";
import axios from "@/lib/axios";

export const useBlogCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async (activeOnly = false) => {
    set({ isLoading: true, error: null });
    try {
      const params = activeOnly ? { active_only: 1, all: 1 } : { all: 1 };
      const response = await axios.get("/api/blog-categories", { params });
      set({
        categories: response.data.data || response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch blog categories",
        isLoading: false,
      });
      console.error("Failed to fetch blog categories:", error);
    }
  },

  addCategory: async (categoryData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/blog-categories", categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await get().fetchCategories();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/blog-categories/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await get().fetchCategories();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/blog-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await get().fetchCategories();
    } catch (error) {
      throw error;
    }
  },
}));
