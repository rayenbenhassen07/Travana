import { create } from "zustand";
import axios from "@/lib/axios";

export const useLanguageStore = create((set, get) => ({
  languages: [],
  isLoading: false,
  error: null,

  // Fetch all active languages
  fetchLanguages: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/languages");
      set({ languages: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch languages",
        isLoading: false,
      });
      console.error("Failed to fetch languages:", error);
    }
  },

  // Get default language
  getDefaultLanguage: () => {
    const { languages } = get();
    return languages.find((lang) => lang.is_default) || languages[0];
  },

  // Get language by code
  getLanguageByCode: (code) => {
    const { languages } = get();
    return languages.find((lang) => lang.code === code);
  },

  // Add a new language
  addLanguage: async (languageData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/languages", languageData);
      set((state) => ({
        languages: [response.data, ...state.languages],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add language",
        isLoading: false,
      });
      console.error("Failed to add language:", error);
      throw error;
    }
  },

  // Update a language
  updateLanguage: async (id, languageData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/languages/${id}`, languageData);
      set((state) => ({
        languages: state.languages.map((lang) =>
          lang.id === id ? response.data : lang
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update language",
        isLoading: false,
      });
      console.error("Failed to update language:", error);
      throw error;
    }
  },

  // Delete a language
  deleteLanguage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/languages/${id}`);
      set((state) => ({
        languages: state.languages.filter((lang) => lang.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete language",
        isLoading: false,
      });
      console.error("Failed to delete language:", error);
      throw error;
    }
  },
}));
