/**
 * Admin Authentication Utilities
 * Centralized auth logic for admin panel
 */

/**
 * Check if user is authenticated and has admin role
 * @returns {boolean} - True if user is admin, false otherwise
 */
export const isAdmin = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;

    const userData = JSON.parse(user);
    return userData.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Get current admin user data
 * @returns {object|null} - User object or null if not found
 */
export const getAdminUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const userData = JSON.parse(user);
    return userData.role === "admin" ? userData : null;
  } catch (error) {
    console.error("Error getting admin user:", error);
    return null;
  }
};

/**
 * Save admin user to localStorage
 * @param {object} userData - User data object
 */
export const setAdminUser = (userData) => {
  try {
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving admin user:", error);
  }
};

/**
 * Logout admin user
 */
export const logoutAdmin = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Clear any other auth-related data
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

/**
 * Get auth token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

/**
 * Set auth token
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
};
