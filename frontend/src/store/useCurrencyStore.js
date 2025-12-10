import { create } from "zustand";
import axios from "@/lib/axios";

export const useCurrencyStore = create((set, get) => ({
  currencies: [],
  isLoading: false,
  error: null,

  fetchCurrencies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/currencies");
      set({ currencies: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch currencies",
        isLoading: false,
      });
      console.error("Failed to fetch currencies:", error);
    }
  },

  addCurrency: async (currencyData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/currencies", currencyData);
      set((state) => ({
        currencies: [response.data, ...state.currencies],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to add currency",
        isLoading: false,
      });
      console.error("Failed to add currency:", error);
      throw error;
    }
  },

  updateCurrency: async (id, currencyData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`/api/currencies/${id}`, currencyData);
      set((state) => ({
        currencies: state.currencies.map((currency) =>
          currency.id === id ? response.data : currency
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to update currency",
        isLoading: false,
      });
      console.error("Failed to update currency:", error);
      throw error;
    }
  },

  deleteCurrency: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/currencies/${id}`);
      set((state) => ({
        currencies: state.currencies.filter((currency) => currency.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to delete currency",
        isLoading: false,
      });
      console.error("Failed to delete currency:", error);
      throw error;
    }
  },
}));
