import { create } from "zustand";
import axios from "@/lib/axios";

export const useBlogStore = create((set, get) => ({
  blogs: [],
  total: 0,
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    status: "",
    categoryId: null,
    tagId: null,
    authorId: null,
    featured: null,
  },

  fetchBlogs: async (page = 1, limit = 10, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");

      // Build query params
      const params = {
        page,
        per_page: limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.tag) params.tag = filters.tag;
      if (filters.author_id) params.author_id = filters.author_id;
      if (
        filters.featured !== null &&
        filters.featured !== undefined &&
        filters.featured !== ""
      ) {
        params.featured = filters.featured;
      }

      const response = await axios.get("/api/blogs", {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      set({
        blogs: response.data.data || [],
        total: response.data.total || 0,
        currentPage: response.data.current_page || page,
        itemsPerPage: limit,
        totalPages: response.data.last_page || 1,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch blogs",
        isLoading: false,
      });
      console.error("Failed to fetch blogs:", error);
    }
  },

  fetchPopularBlogs: async (limit = 10, days = 30) => {
    try {
      const response = await axios.get("/api/blogs/popular/list", {
        params: { limit, days },
      });
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch popular blogs:", error);
      return []; // Return empty array instead of throwing
    }
  },

  fetchBlogsByCategory: async (categorySlug, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/blogs/category/${categorySlug}`, {
        params: { page, per_page: limit },
      });
      set({
        blogs: response.data.data || [],
        total: response.data.total || 0,
        currentPage: response.data.current_page || page,
        itemsPerPage: limit,
        totalPages: response.data.last_page || 1,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch blogs",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchBlogsByTag: async (tagSlug, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/blogs/tag/${tagSlug}`, {
        params: { page, per_page: limit },
      });
      set({
        blogs: response.data.data || [],
        total: response.data.total || 0,
        currentPage: response.data.current_page || page,
        itemsPerPage: limit,
        totalPages: response.data.last_page || 1,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch blogs",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchRelatedBlogs: async (blogId) => {
    try {
      const response = await axios.get(`/api/blogs/${blogId}/related`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch related blogs:", error);
      throw error;
    }
  },

  searchBlogs: async (query, filters = {}, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const params = {
        q: query,
        page,
        per_page: limit,
        ...filters,
      };

      const response = await axios.get("/api/blogs/search/query", { params });
      set({
        blogs: response.data.data || [],
        total: response.data.total || 0,
        currentPage: response.data.current_page || page,
        itemsPerPage: limit,
        totalPages: response.data.last_page || 1,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to search blogs",
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchBlogs(1, get().itemsPerPage, {
      ...get().filters,
      ...newFilters,
    });
  },

  setItemsPerPage: (perPage) => {
    set({ itemsPerPage: perPage });
    get().fetchBlogs(1, perPage, get().filters);
  },

  addBlog: async (blogData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/blogs", blogData, {
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

  getBlog: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/blogs/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBlog: async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`/api/blogs/${id}`, updatedData, {
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

  deleteBlog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { currentPage, itemsPerPage, filters, blogs } = get();

      if (blogs.length === 1 && currentPage > 1) {
        await get().fetchBlogs(currentPage - 1, itemsPerPage, filters);
      } else {
        await get().fetchBlogs(currentPage, itemsPerPage, filters);
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete blog",
        isLoading: false,
      });
      console.error("Failed to delete blog:", error);
      throw error;
    }
  },
}));
