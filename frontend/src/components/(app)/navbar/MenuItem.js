"use client";

export const MenuItem = ({ onClick, label, disabled = false }) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`px-2 py-1 text-sm font-semibold transition-colors rounded-lg mx-2 ${
        disabled
          ? "text-neutral-400 cursor-not-allowed"
          : "text-neutral-700  hover:text-primary-600 cursor-pointer"
      }`}
    >
      {label}
    </div>
  );
};
