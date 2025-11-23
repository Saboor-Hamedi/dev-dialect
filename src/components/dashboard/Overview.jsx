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
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const Overview = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publicPosts: 0,
    draftPosts: 0,
    recentPosts: [],
    chartData: [],
    pieData: [],
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

      // Get all posts
      const { data: allPosts } = await supabase
        .from("posts")
        .select("id, created_at, is_public");

      const total = allPosts?.length || 0;
      const publicCount = allPosts?.filter((p) => p.is_public).length || 0;
      const draftCount = total - publicCount;

      // Get recent posts (last 5)
      const { data: recent } = await supabase
        .from("posts")
        .select("id, title, created_at, is_public")
        .order("created_at", { ascending: false })
        .limit(5);

      // Prepare Chart Data (Last 7 Days)
      const last7Days = [...Array(7)]
        .map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split("T")[0];
        })
        .reverse();

      const chartData = last7Days.map((date) => {
        const count =
          allPosts?.filter((p) => p.created_at.startsWith(date)).length || 0;
        return {
          name: new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          posts: count,
        };
      });

      // Prepare Pie Data
      const pieData = [
        { name: "Public", value: publicCount },
        { name: "Drafts", value: draftCount },
      ];

      setStats({
        totalPosts: total,
        publicPosts: publicCount,
        draftPosts: draftCount,
        recentPosts: recent || [],
        chartData,
        pieData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#00B894", "#F59E0B"];

  const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-lg ${bgColor} group-hover:scale-110 transition-transform`}
        >
          <Icon className={color} size={24} />
        </div>
        {trend && (
          <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
            <ArrowUpRight size={12} className="mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
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
      <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={28} className="animate-pulse" />
            <h1 className="text-3xl font-bold">
              {getGreeting()}, {user?.full_name || "Developer"}!
            </h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Welcome back to your command center. You have{" "}
            <span className="font-bold text-white">
              {stats.totalPosts} posts
            </span>{" "}
            in total.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={stats.totalPosts}
          color="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          trend="+12% this month"
        />
        <StatCard
          icon={Eye}
          label="Public Posts"
          value={stats.publicPosts}
          color="text-green-600"
          bgColor="bg-green-100 dark:bg-green-900/30"
          trend="Active Content"
        />
        <StatCard
          icon={Lock}
          label="Drafts"
          value={stats.draftPosts}
          color="text-orange-600"
          bgColor="bg-orange-100 dark:bg-orange-900/30"
          trend="Work in Progress"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            Posting Activity (Last 7 Days)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B894" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00B894" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke="#00B894"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPosts)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Content Distribution
          </h2>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalPosts}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Posts
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {stats.pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 size={24} className="text-primary" />
            Recent Posts
          </h2>
          {stats.recentPosts.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
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
                      <p className="font-medium text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
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

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-primary" />
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => onNavigate("create")}
              className="w-full flex items-center gap-3 p-4 bg-primary hover:bg-green-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg group"
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
              className="w-full flex items-center gap-3 p-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-all"
            >
              <FileText size={20} />
              <div className="text-left">
                <div className="font-semibold">Manage Posts</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  View and edit content
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
