import React, { useState, useEffect } from "react";
import {
  X,
  Moon,
  Sun,
  Monitor,
  Bell,
  User,
  Shield,
  Palette,
} from "lucide-react";

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Monitor className="text-primary" size={24} />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 bg-gray-50 dark:bg-slate-900/50 border-r border-gray-100 dark:border-slate-700 p-4 space-y-2 hidden sm:block">
            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "appearance"
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <Palette size={18} />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bell size={18} />
              General
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "account"
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <User size={18} />
              Account
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Theme Preference
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="w-full h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Sun className="text-gray-500" size={24} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        Light
                      </span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="w-full h-20 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
                        <Moon className="text-gray-400" size={24} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        Dark
                      </span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        theme === "system"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                        <Monitor
                          className="text-gray-500 dark:text-gray-400"
                          size={24}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        System
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                          <Bell size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">
                            Push Notifications
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Receive alerts about new comments
                          </div>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                        <input
                          type="checkbox"
                          className="absolute w-6 h-6 opacity-0 cursor-pointer"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                        />
                        <span
                          className={`block w-12 h-6 rounded-full transition-colors ${
                            notifications
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        ></span>
                        <span
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            notifications ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Profile Information
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                          A
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white">
                            Admin User
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            admin@example.com
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Shield size={16} />
                          <span>Administrator Access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
