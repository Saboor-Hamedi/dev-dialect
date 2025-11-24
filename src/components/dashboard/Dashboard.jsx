import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import {
  LayoutDashboard,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Plus,
  MessageSquare,
  Heart,
  User,
} from "lucide-react";
import Overview from "./Overview";
import Show from "../posts/Show";
import Index from "../posts/Index";
import Create from "../posts/Create";
import Update from "../posts/Update";
import Contacts from "./Contacts";
import Bookmarks from "./Bookmarks";

import Settings from "./settings/Settings";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(
    localStorage.getItem("dashboardView") || "overview"
  );
  const [editingPostId, setEditingPostId] = useState(
    localStorage.getItem("editingPostId") || null
  );
  const [viewingPostId, setViewingPostId] = useState(
    localStorage.getItem("viewingPostId") || null
  );
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread contacts count
  useEffect(() => {
    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUnreadCount() {
    try {
      const { count, error } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }

  const handleViewChange = (view) => {
    setActiveView(view);
    localStorage.setItem("dashboardView", view);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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

      {/* Sidebar - Left Side - Sticky/Fixed */}
      <aside
        className={`fixed lg:sticky inset-y-0 left-0 top-0 z-30 w-64 h-screen bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
            <span className="text-lg font-bold text-primary">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links - Scrollable */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
            >
              <LayoutDashboard size={18} />
              Home
            </Link>

            <button
              onClick={() => {
                handleViewChange("overview");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeView === "overview"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>

            <button
              onClick={() => {
                handleViewChange("posts");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeView === "posts"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <FileText size={18} />
              All Posts
            </button>

            <button
              onClick={() => {
                handleViewChange("create");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeView === "create"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <Plus size={18} />
              Create Post
            </button>

            <button
              onClick={() => {
                handleViewChange("bookmarks");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeView === "bookmarks"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <Heart size={18} />
              Saved Posts
            </button>

            <button
              onClick={async () => {
                const {
                  data: { session },
                } = await supabase.auth.getSession();
                if (session) {
                  navigate(`/profile/${session.user.id}`);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <User size={18} />
              View My Profile
            </button>

            <button
              onClick={() => {
                handleViewChange("contacts");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeView === "contacts"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <MessageSquare size={18} />
              <span className="flex-1 text-left">Contact Messages</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                handleViewChange("settings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeView === "settings"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <SettingsIcon size={18} />
              Settings
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              Exit Dashboard
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Right Side */}
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
          <div className="w-6" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Conditional Rendering based on activeView */}
            {activeView === "overview" && (
              <Overview onNavigate={handleViewChange} />
            )}

            {activeView === "posts" && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                      Posts
                    </h1>
                  </div>
                  <button
                    onClick={() => handleViewChange("create")}
                    className="bg-primary hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all text-sm font-semibold"
                  >
                    <Plus size={18} /> Add New Post
                  </button>
                </div>
                <Index
                  onEdit={(postId) => {
                    setEditingPostId(postId);
                    handleViewChange("update");
                  }}
                  onView={(postId) => {
                    setViewingPostId(postId);
                    localStorage.setItem("viewingPostId", postId);
                    handleViewChange("show");
                  }}
                />
              </>
            )}

            {activeView === "create" && (
              <Create
                onSuccess={() => {
                  handleViewChange("posts");
                }}
              />
            )}

            {activeView === "contacts" && (
              <Contacts onCountChange={fetchUnreadCount} />
            )}

            {activeView === "bookmarks" && (
              <Bookmarks
                onView={(postId) => {
                  setViewingPostId(postId);
                  localStorage.setItem("viewingPostId", postId);
                  handleViewChange("show");
                }}
              />
            )}

            {activeView === "update" && (
              <Update
                postId={editingPostId}
                onSuccess={() => {
                  handleViewChange("posts");
                }}
                onCancel={() => {
                  handleViewChange("posts");
                }}
              />
            )}

            {activeView === "show" && (
              <Show
                postId={viewingPostId}
                onBack={() => handleViewChange("posts")}
                onEdit={(postId) => {
                  setEditingPostId(postId);
                  handleViewChange("update");
                }}
              />
            )}

            {activeView === "settings" && <Settings />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
