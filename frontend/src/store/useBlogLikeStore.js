import { create } from "zustand";
import axios from "@/lib/axios";

export const useBlogLikeStore = create((set, get) => ({
  likedBlogs: new Set(),
  likeCounts: {},
  isLoading: false,
  error: null,

  toggleBlogLike: async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.post(
        `/api/blogs/${blogId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      set((state) => {
        const newLikedBlogs = new Set(state.likedBlogs);
        if (response.data.liked) {
          newLikedBlogs.add(blogId);
        } else {
          newLikedBlogs.delete(blogId);
        }

        return {
          likedBlogs: newLikedBlogs,
          likeCounts: {
            ...state.likeCounts,
            [blogId]: response.data.likes_count,
          },
        };
      });

      return response.data;
    } catch (error) {
      console.error("Failed to toggle like:", error);
      throw error;
    }
  },

  checkBlogLike: async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { liked: false, likes_count: 0 };
      }

      const response = await axios.get(`/api/blogs/${blogId}/like/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state
      set((state) => {
        const newLikedBlogs = new Set(state.likedBlogs);
        if (response.data.liked) {
          newLikedBlogs.add(blogId);
        } else {
          newLikedBlogs.delete(blogId);
        }

        return {
          likedBlogs: newLikedBlogs,
          likeCounts: {
            ...state.likeCounts,
            [blogId]: response.data.likes_count,
          },
        };
      });

      return response.data;
    } catch (error) {
      console.error("Failed to check like:", error);
      return { liked: false, likes_count: 0 };
    }
  },

  getBlogLikes: async (blogId, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`/api/blogs/${blogId}/likes`, {
        params: { page },
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch likes",
        isLoading: false,
      });
      throw error;
    }
  },

  isBlogLiked: (blogId) => {
    return get().likedBlogs.has(blogId);
  },

  getBlogLikeCount: (blogId) => {
    const count = get().likeCounts[blogId];
    // If we don't have it in the store, return undefined so the component uses blog.likes_count
    return count !== undefined ? count : undefined;
  },

  // Initialize like counts from blog data
  initializeBlogLikes: (blogs) => {
    set((state) => {
      const newLikeCounts = { ...state.likeCounts };
      blogs.forEach((blog) => {
        if (blog.likes_count !== undefined) {
          newLikeCounts[blog.id] = blog.likes_count;
        }
      });
      return { likeCounts: newLikeCounts };
    });
  },

  // Clear all state
  clearState: () => {
    set({
      likedBlogs: new Set(),
      likeCounts: {},
      isLoading: false,
      error: null,
    });
  },
}));
