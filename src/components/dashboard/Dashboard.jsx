import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HousePlus,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";
import Posts from "./Posts";
import CreatePost from "./CreatePost";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("posts"); // 'posts', 'create', 'settings'

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700">
            <span className="text-xl font-bold text-primary">DevDialect</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/10 rounded-lg font-medium"
            >
              <HousePlus size={20} />
              Home
            </Link>

            <button
              onClick={() => {
                setActiveView("posts");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === "posts"
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              <FileText size={20} />
              All Posts
            </button>

            <button
              onClick={() => {
                setActiveView("create");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === "create"
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              <Plus size={20} />
              Create Post
            </button>

            <button
              onClick={() => {
                setActiveView("settings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === "settings"
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              <Settings size={20} />
              Settings
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Exit Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center px-4 justify-between">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800 dark:text-white">
            Dashboard
          </span>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Conditional Rendering based on activeView */}
            {activeView === "posts" && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                      Overview
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Manage your projects and posts
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView("create")}
                    className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all w-full sm:w-auto justify-center"
                  >
                    <Plus size={20} /> Add New Post
                  </button>
                </div>
                <Posts />
              </>
            )}

            {activeView === "create" && (
              <CreatePost
                onCancel={() => setActiveView("posts")}
                onSuccess={() => setActiveView("posts")}
              />
            )}

            {activeView === "settings" && (
              <div className="text-center py-20 text-gray-500">
                Settings panel coming soon...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
