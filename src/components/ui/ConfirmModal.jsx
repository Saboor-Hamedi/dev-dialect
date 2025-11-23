import React, { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        } border border-gray-100 dark:border-slate-700`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center mb-4">
          <div
            className={`p-3 rounded-full mb-4 ${
              type === "danger"
                ? "bg-red-50 text-red-500 dark:bg-red-900/20"
                : "bg-blue-50 text-blue-500 dark:bg-blue-900/20"
            }`}
          >
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h3>
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-red-500/20 transition-all transform active:scale-95 text-sm ${
              type === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
