import axios from "@/lib/axios";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/users");
      set({ users: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },
  addUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/users", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        users: [...state.users, response.data],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to add user:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error; // Re-throw to allow UI to handle
    }
  },
  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/api/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? response.data : user
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to update user:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error; // Re-throw to allow UI to handle
    }
  },
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete user:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error; // Re-throw to allow UI to handle
    }
  },
}));
