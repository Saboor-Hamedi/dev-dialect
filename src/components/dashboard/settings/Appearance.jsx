import React, { useState } from "react";
import { Sun, Moon, Monitor, Palette, Check } from "lucide-react";

const Appearance = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [accentColor, setAccentColor] = useState(
    localStorage.getItem("accentColor") || "#00B894"
  );

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleColorChange = (color) => {
    setAccentColor(color);
    localStorage.setItem("accentColor", color);
    document.documentElement.style.setProperty("--color-primary", color);
  };

  const colors = [
    { name: "Teal", hex: "#00B894", class: "bg-[#00B894]" },
    { name: "Blue", hex: "#3b82f6", class: "bg-blue-500" },
    { name: "Purple", hex: "#a855f7", class: "bg-purple-500" },
    { name: "Orange", hex: "#f97316", class: "bg-orange-500" },
    { name: "Pink", hex: "#ec4899", class: "bg-pink-500" },
    { name: "Red", hex: "#ef4444", class: "bg-red-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
          Theme Preference
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Choose how the dashboard looks to you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange("light")}
            className={`group flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              theme === "light"
                ? "border-primary bg-primary/5"
                : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="w-full h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sun className="text-gray-500" size={28} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
              Light
            </span>
          </button>

          <button
            onClick={() => handleThemeChange("dark")}
            className={`group flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              theme === "dark"
                ? "border-primary bg-primary/5"
                : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="w-full h-24 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Moon className="text-gray-400" size={28} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
              Dark
            </span>
          </button>

          <button
            onClick={() => handleThemeChange("system")}
            className={`group flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              theme === "system"
                ? "border-primary bg-primary/5"
                : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="w-full h-24 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-gray-50"></div>
                <div className="w-1/2 bg-slate-800"></div>
              </div>
              <Monitor
                className="text-gray-500 dark:text-gray-400 relative z-10"
                size={28}
              />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
              System
            </span>
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
          Accent Color
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Select a primary color for buttons and links.
        </p>

        <div className="flex flex-wrap gap-4">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color.hex)}
              className={`w-12 h-12 rounded-full ${
                color.class
              } flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 dark:ring-offset-slate-900 ${
                accentColor === color.hex
                  ? "ring-gray-400 dark:ring-gray-500 scale-110"
                  : "ring-transparent"
              }`}
              title={color.name}
            >
              {accentColor === color.hex && (
                <Check className="text-white" size={20} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appearance;
