import { create } from "zustand";
import axios from "@/lib/axios";

export const useAlertStore = create((set, get) => ({
  alerts: [],
  isLoading: false,
  error: null,

  fetchAlerts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/alerts");
      set({ alerts: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch alerts",
        isLoading: false,
      });
      console.error("Failed to fetch alerts:", error);
    }
  },

  addAlert: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/alerts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        alerts: [response.data, ...state.alerts],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to add alert",
        isLoading: false,
      });
      console.error("Failed to add alert:", error);
      throw error;
    }
  },

  updateAlert: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`/api/alerts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        alerts: state.alerts.map((alert) =>
          alert.id === id ? response.data : alert
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to update alert",
        isLoading: false,
      });
      console.error("Failed to update alert:", error);
      throw error;
    }
  },

  deleteAlert: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/alerts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to delete alert",
        isLoading: false,
      });
      console.error("Failed to delete alert:", error);
      throw error;
    }
  },
}));
