"use client";
import React from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

/**
 * Alert Component for displaying messages
 *
 * @param {String} type - Alert type: 'success', 'error', 'warning', 'info'
 * @param {String} title - Alert title
 * @param {String} message - Alert message
 * @param {Function} onClose - Optional close callback
 */
const Alert = ({ type = "info", title, message, onClose }) => {
  const styles = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: <FaCheckCircle className="text-green-600" />,
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: <FaExclamationCircle className="text-red-600" />,
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: <FaExclamationTriangle className="text-yellow-600" />,
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <FaInfoCircle className="text-blue-600" />,
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`border rounded-xl p-4 ${style.container}`}>
      <div className="flex items-start gap-3">
        <div className="text-xl flex-shrink-0 mt-0.5">{style.icon}</div>
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
