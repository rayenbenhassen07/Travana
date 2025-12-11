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
}));
