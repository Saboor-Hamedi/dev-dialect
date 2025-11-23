import React, { useState } from "react";
import { Palette, Bell, User, ChevronRight } from "lucide-react";
import Appearance from "./Appearance";
import General from "./General";
import Account from "./Account";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("appearance");

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "general", label: "General", icon: Bell },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[600px]">
      {/* Settings Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden sticky top-4 lg:top-24 z-10">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 hidden lg:block">
            <h2 className="font-bold text-slate-800 dark:text-white">
              Settings
            </h2>
          </div>

          {/* Mobile: Horizontal Scroll, Desktop: Vertical List */}
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-2 space-x-2 lg:space-x-0 lg:space-y-1 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 lg:w-full flex items-center justify-between px-4 py-2.5 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 bg-gray-50/50 lg:bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {tab.label}
                  </div>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="opacity-75 hidden lg:block"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 lg:p-8 min-h-full">
          {activeTab === "appearance" && <Appearance />}
          {activeTab === "general" && <General />}
          {activeTab === "account" && <Account />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
