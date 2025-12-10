/**
 * COLOR PALETTE QUICK REFERENCE
 * Import this file when you need color constants
 */

export const colors = {
  // Primary Orange Brand Color
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316", // Main Brand Orange
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
  },

  // Secondary Dark Blue
  secondary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#1e3a8a", // Main Dark Blue
    600: "#1e40af",
    700: "#1d4ed8",
    800: "#0f172a", // Deep Navy
    900: "#0c1427",
    950: "#020617",
  },

  // Accent Colors
  accent: {
    coral: "#ff6b6b",
    amber: "#fbbf24",
    teal: "#14b8a6",
    sky: "#38bdf8",
  },

  // Neutral Grays
  neutral: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Semantic Colors
  semantic: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
};

// Usage Examples:
//
// In JavaScript/JSX:
// style={{ backgroundColor: colors.primary[500] }}
// style={{ color: colors.secondary[800] }}
//
// In Tailwind classes:
// className="bg-primary-500 text-secondary-800"

export default colors;
