import React, { useState } from "react";
import { Bell, Volume2, Mail, Globe } from "lucide-react";

const General = () => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailDigest: false,
    soundEffects: true,
    language: "English",
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
          Notifications
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Manage how you receive alerts and updates.
        </p>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Bell size={20} />
              </div>
              <div>
                <div className="font-medium text-slate-800 dark:text-white">
                  Push Notifications
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Receive alerts about new comments and likes
                </div>
              </div>
            </div>
            <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                checked={settings.pushNotifications}
                onChange={() => toggleSetting("pushNotifications")}
              />
              <span
                className={`block w-full h-full rounded-full transition-colors duration-200 ${
                  settings.pushNotifications
                    ? "bg-primary"
                    : "bg-gray-300 dark:bg-slate-600"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                  settings.pushNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </div>
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Mail size={20} />
              </div>
              <div>
                <div className="font-medium text-slate-800 dark:text-white">
                  Email Digest
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Receive a weekly summary of top posts
                </div>
              </div>
            </div>
            <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                checked={settings.emailDigest}
                onChange={() => toggleSetting("emailDigest")}
              />
              <span
                className={`block w-full h-full rounded-full transition-colors duration-200 ${
                  settings.emailDigest
                    ? "bg-primary"
                    : "bg-gray-300 dark:bg-slate-600"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                  settings.emailDigest ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
          Preferences
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Customize your dashboard experience.
        </p>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <Volume2 size={20} />
              </div>
              <div>
                <div className="font-medium text-slate-800 dark:text-white">
                  Sound Effects
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Play sounds for notifications and actions
                </div>
              </div>
            </div>
            <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                checked={settings.soundEffects}
                onChange={() => toggleSetting("soundEffects")}
              />
              <span
                className={`block w-full h-full rounded-full transition-colors duration-200 ${
                  settings.soundEffects
                    ? "bg-primary"
                    : "bg-gray-300 dark:bg-slate-600"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                  settings.soundEffects ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </div>
          </label>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                <Globe size={20} />
              </div>
              <div>
                <div className="font-medium text-slate-800 dark:text-white">
                  Language
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Select your preferred language
                </div>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, language: e.target.value }))
              }
              className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-slate-800 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
