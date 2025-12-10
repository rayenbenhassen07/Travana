// components/(auth)/ErrorAlert.js
import { FaExclamationCircle, FaTimes } from "react-icons/fa";

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
      <FaExclamationCircle className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-red-800 font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition flex-shrink-0"
          aria-label="Fermer"
        >
          <FaTimes className="text-sm cursor-pointer" />
        </button>
      )}
    </div>
  );
}
