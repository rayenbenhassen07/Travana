import axios from "@/lib/axios";
import { create } from "zustand";
import { translateError, translateErrors } from "@/lib/translations";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isHydrating: false,
  isLoggingOut: false,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    set({ token });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, token: null, isLoggingOut: false });
  },

  login: async (credentials) => {
    try {
      const response = await axios.post("/api/login", credentials);
      const { token, user } = response.data;

      // Only save token and user if email is verified
      if (user.email_verified_at) {
        get().setToken(token);
        set({ user });
        return { success: true, user, token, verified: true };
      } else {
        // Email not verified - don't save token/user
        return {
          success: true,
          user,
          token,
          verified: false,
          needsVerification: true,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = translateError(
        error.response?.data?.message || "Échec de la connexion"
      );
      const fieldErrors = translateErrors(error.response?.data?.errors || {});

      return {
        success: false,
        error: errorMessage,
        errors: fieldErrors,
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post("/api/register", userData);
      const { token, user } = response.data;

      // DO NOT save token/user if email is not verified
      // User must verify email first before being logged in
      return {
        success: true,
        user,
        token,
        needsVerification: !user.email_verified_at,
      };
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage = translateError(
        error.response?.data?.message || "Échec de l'inscription"
      );
      const fieldErrors = translateErrors(error.response?.data?.errors || {});

      return {
        success: false,
        error: errorMessage,
        errors: fieldErrors,
      };
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    } finally {
      get().clearAuth();
    }
  },

  hydrateAuth: async () => {
    const { isHydrating } = get();
    if (isHydrating) return;

    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    set({ isHydrating: true });
    try {
      const response = await axios.get("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const user = response.data;
        set({ user, token });
      } else {
        get().clearAuth();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      get().clearAuth();
    } finally {
      set({ isHydrating: false });
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const response = await axios.post(
        "/api/email/verification-notification",
        {
          email,
        }
      );

      if (response.data.verified) {
        return {
          success: true,
          alreadyVerified: true,
          message: "Email already verified",
        };
      }

      return {
        success: true,
        message: "Verification email sent",
      };
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to send verification email",
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post("/api/forgot-password", { email });
      return {
        success: true,
        message: response.data.status || "Password reset link sent",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage = translateError(
        error.response?.data?.message || "Failed to send reset link"
      );
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  resetPassword: async (token, email, password, password_confirmation) => {
    try {
      const response = await axios.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });
      return {
        success: true,
        message: response.data.status || "Password reset successful",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = translateError(
        error.response?.data?.message || "Failed to reset password"
      );
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
}));

export default useAuthStore;
