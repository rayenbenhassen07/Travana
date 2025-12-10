// components/(auth)/InputField.js
import { forwardRef } from "react";

const InputField = forwardRef(({ icon: Icon, error, label, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 pl-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
        )}
        <input
          ref={ref}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 border-2 rounded-xl focus:outline-none text-sm transition ${
            error
              ? "border-red-300 focus:border-red-500 bg-red-50"
              : "border-neutral-200 focus:border-primary-500 bg-white"
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-600 text-xs pl-1 animate-fadeIn">{error}</p>
      )}
    </div>
  );
});

InputField.displayName = "InputField";

export default InputField;
