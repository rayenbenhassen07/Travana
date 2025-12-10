import { create } from "zustand";
import axios from "@/lib/axios";

export const useBlogCommentStore = create((set, get) => ({
  comments: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  likedComments: new Set(), // Track which comments are liked by current user

  // Helper to extract liked comment IDs from comments tree
  extractLikedComments: (comments) => {
    const likedIds = new Set();

    const traverse = (commentList) => {
      if (!Array.isArray(commentList)) return;

      commentList.forEach((comment) => {
        if (comment.user_liked === true) {
          likedIds.add(comment.id);
        }
        if (
          comment.replies &&
          Array.isArray(comment.replies) &&
          comment.replies.length > 0
        ) {
          traverse(comment.replies);
        }
      });
    };

    traverse(comments);
    return likedIds;
  },

  fetchComments: async (blogId, page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`/api/blogs/${blogId}/comments`, {
        params: { page, per_page: limit },
        headers,
      });

      const commentsData = response.data.data || response.data || [];

      // Extract liked comments from API response (user_liked attribute)
      const likedIds = get().extractLikedComments(commentsData);

      set({
        comments: commentsData,
        likedComments: likedIds,
        total: response.data.total || 0,
        currentPage: response.data.current_page || page,
        totalPages: response.data.last_page || 1,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch comments",
        isLoading: false,
      });
      console.error("Failed to fetch comments:", error);
    }
  },

  addComment: async (blogId, content, parentId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.post(
        `/api/blogs/${blogId}/comments`,
        {
          content,
          parent_id: parentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh comments after adding
      await get().fetchComments(blogId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateComment: async (blogId, commentId, content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        `/api/blogs/${blogId}/comments/${commentId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh comments after updating
      await get().fetchComments(blogId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteComment: async (blogId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      await axios.delete(`/api/blogs/${blogId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh comments after deleting
      await get().fetchComments(blogId);
    } catch (error) {
      throw error;
    }
  },

  toggleLike: async (blogId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.post(
        `/api/blogs/${blogId}/comments/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update liked comments set
      set((state) => {
        const newLikedComments = new Set(state.likedComments);
        if (response.data.liked) {
          newLikedComments.add(commentId);
        } else {
          newLikedComments.delete(commentId);
        }

        // Recursively update the comment in the tree
        const updateCommentInTree = (comments) => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes_count: response.data.likes_count,
                user_liked: response.data.liked,
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentInTree(comment.replies),
              };
            }
            return comment;
          });
        };

        return {
          likedComments: newLikedComments,
          comments: updateCommentInTree(state.comments),
        };
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clearComments: () => {
    set({
      comments: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      likedComments: new Set(),
    });
  },

  // Helper to check if a comment is liked
  isCommentLiked: (commentId) => {
    return get().likedComments.has(commentId);
  },
}));
