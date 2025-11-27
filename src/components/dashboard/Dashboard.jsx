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
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import Overview from "./Overview";
import Show from "../posts/Show";
import Index from "../posts/Index";
import Create from "../posts/Create";
import Update from "../posts/Update";
import Contacts from "./Contacts";
import Bookmarks from "./Bookmarks";
import Settings from "./settings/Settings";

import CommandPalette from "../CommandPalette";

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
  const [userProfile, setUserProfile] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Open sidebar by default on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch user profile
  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setUserProfile(data);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  // Fetch unread contacts count
  useEffect(() => {
    fetchUnreadCount();
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
    // Close sidebar on mobile when view changes
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-primary hover:text-green-600 transition-colors"
            >
              <LayoutDashboard size={24} />
              <span className="hidden sm:inline">DevDialect</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all group"
            >
              <Search
                size={16}
                className="group-hover:text-primary transition-colors"
              />
              <span className="flex-1 text-left">Search posts...</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-slate-500">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewChange("contacts")}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                  {userProfile?.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      alt={userProfile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (userProfile?.full_name?.[0] || "U").toUpperCase()
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className="text-gray-600 dark:text-gray-300 hidden sm:block"
                />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {userProfile?.full_name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Dashboard
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        const {
                          data: { session },
                        } = await supabase.auth.getSession();
                        if (session) {
                          navigate(`/profile/${session.user.id}`);
                          setShowUserMenu(false);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <User size={16} />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        handleViewChange("settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <SettingsIcon size={16} />
                      Settings
                    </button>
                    <div className="border-t border-gray-200 dark:border-slate-700 my-2"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-16 flex min-h-screen">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-all duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Navigation
              </h2>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
              >
                <LayoutDashboard size={18} />
                Home
              </Link>

              <button
                onClick={() => handleViewChange("overview")}
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
                onClick={() => handleViewChange("posts")}
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
                onClick={() => handleViewChange("create")}
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
                onClick={() => handleViewChange("bookmarks")}
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
                    setSidebarOpen(false);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <User size={18} />
                View My Profile
              </button>

              <button
                onClick={() => handleViewChange("contacts")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  activeView === "contacts"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                <MessageSquare size={18} />
                <span className="flex-1 text-left">Messages</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleViewChange("settings")}
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

        {/* Main Content - Expands when sidebar closes */}
        <main
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-0"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-5xl mx-auto">
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
                  onCancel={() => {
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

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
