import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Calendar, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const [newPosts, setNewPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [oldPosts, setOldPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    setLoading(true);
    try {
      // Fetch all public posts
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        // Categorize posts
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 60)); // 90 days total

        // News Posts: Last 30 days (limit to 6)
        const recent = data
          .filter((post) => new Date(post.created_at) >= thirtyDaysAgo)
          .slice(0, 6);

        // Most Read Posts: Sort by ID (as proxy for popularity) - limit to 6
        // If you have a views column, replace this with: .sort((a, b) => b.views - a.views)
        const popular = [...data].sort((a, b) => b.id - a.id).slice(0, 6);

        // Old Posts: Older than 90 days (limit to 6)
        const old = data
          .filter((post) => new Date(post.created_at) < ninetyDaysAgo)
          .slice(0, 6);

        setNewPosts(recent);
        setPopularPosts(popular);
        setOldPosts(old);
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const PostCard = ({ post }) => (
    <Link
      to={`/show/${post.id}`}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={post.image_url || "https://placehold.co/600x400"}
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Calendar size={14} />
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-1">
          {post.content}
        </p>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            All Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore my technical projects and teaching materials
          </p>
          <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        {/* News Posts Section */}
        {newPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-primary" size={28} />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Latest Posts
              </h2>
              <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                New
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Most Read Posts Section */}
        {popularPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-orange-500" size={28} />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Most Popular
              </h2>
              <span className="bg-orange-500/10 text-orange-500 text-sm font-semibold px-3 py-1 rounded-full">
                Trending
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Old Posts Section */}
        {oldPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="text-blue-500" size={28} />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Classic Posts
              </h2>
              <span className="bg-blue-500/10 text-blue-500 text-sm font-semibold px-3 py-1 rounded-full">
                Archive
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oldPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* No Posts Message */}
        {newPosts.length === 0 &&
          popularPosts.length === 0 &&
          oldPosts.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
              <p className="text-xl text-gray-500">
                No public posts available yet.
              </p>
            </div>
          )}
      </div>
    </section>
  );
};

export default Projects;
