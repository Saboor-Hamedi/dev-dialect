import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import {
  FileText,
  Eye,
  Lock,
  TrendingUp,
  Plus,
  Calendar,
  BarChart3,
  Sparkles,
} from "lucide-react";

const Overview = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publicPosts: 0,
    draftPosts: 0,
    recentPosts: [],
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch user's profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user?.id)
        .single();

      if (profile) {
        setUser((prev) => ({ ...prev, full_name: profile.full_name }));
      }

      // Get all posts count
      const { count: total } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      // Get public posts count
      const { count: publicCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true);

      // Get recent posts (last 5)
      const { data: recent } = await supabase
        .from("posts")
        .select("id, title, created_at, is_public")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalPosts: total || 0,
        publicPosts: publicCount || 0,
        draftPosts: (total || 0) - (publicCount || 0),
        recentPosts: recent || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={28} />
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {user?.full_name || "Developer"}!
          </h1>
        </div>
        <p className="text-green-100 text-lg">
          Welcome back to your dashboard. Here's what's happening with your
          content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={stats.totalPosts}
          color="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={Eye}
          label="Public Posts"
          value={stats.publicPosts}
          color="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900/30"
        />
        <StatCard
          icon={Lock}
          label="Drafts"
          value={stats.draftPosts}
          color="text-orange-600"
          bgColor="bg-orange-100 dark:bg-orange-900/30"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate("create")}
            className="flex items-center gap-3 p-4 bg-primary hover:bg-green-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg group"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            <div className="text-left">
              <div className="font-semibold">Create New Post</div>
              <div className="text-xs text-green-100">
                Share your latest project
              </div>
            </div>
          </button>
          <button
            onClick={() => onNavigate("posts")}
            className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <FileText size={20} />
            <div className="text-left">
              <div className="font-semibold">View All Posts</div>
              <div className="text-xs text-gray-300">Manage your content</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 size={24} className="text-primary" />
          Recent Activity
        </h2>
        {stats.recentPosts.length > 0 ? (
          <div className="space-y-3">
            {stats.recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => onNavigate("posts")}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      post.is_public
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-orange-100 dark:bg-orange-900/30"
                    }`}
                  >
                    {post.is_public ? (
                      <Eye size={16} className="text-green-600" />
                    ) : (
                      <Lock size={16} className="text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    post.is_public
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                >
                  {post.is_public ? "Public" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p>No posts yet. Create your first post to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
