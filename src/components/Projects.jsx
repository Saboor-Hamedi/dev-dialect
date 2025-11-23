import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import {
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  Search as SearchIcon,
  ArrowRight,
  Eye,
  Flame,
  History,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "./ui/Skeleton";

const Projects = () => {
  const [newPosts, setNewPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [oldPosts, setOldPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    fetchAllPosts();
  }, [searchQuery]);

  async function fetchAllPosts() {
    setLoading(true);
    try {
      // Build query
      let query = supabase
        .from("posts")
        .select("*, profiles(full_name, avatar_url)")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      // Add search filter if query exists
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // If searching, show all results in one section
        if (searchQuery) {
          setNewPosts(data);
          setPopularPosts([]);
          setOldPosts([]);
        } else {
          // Categorize posts
          const now = new Date();
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 60)); // 90 days total

          // News Posts: Last 30 days (limit to 6)
          const recent = data
            .filter((post) => new Date(post.created_at) >= thirtyDaysAgo)
            .slice(0, 6);

          // Most Read Posts: Sort by ID (as proxy for popularity) - limit to 6
          const popular = [...data].sort((a, b) => b.id - a.id).slice(0, 6);

          // Old Posts: Older than 90 days (limit to 6)
          const old = data
            .filter((post) => new Date(post.created_at) < ninetyDaysAgo)
            .slice(0, 6);

          setNewPosts(recent);
          setPopularPosts(popular);
          setOldPosts(old);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const PostCard = ({ post }) => (
    <Link
      to={`/show/${post.slug}`}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image_url || "https://placehold.co/600x400"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Price Badge */}
        {post.price && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-sm font-bold rounded-full shadow-lg">
            {post.price}
          </div>
        )}

        {/* View Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-full backdrop-blur-sm">
            <Eye className="text-primary" size={24} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {post.content}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-slate-800">
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles?.full_name || "Author"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                {(post.profiles?.full_name?.[0] || "U").toUpperCase()}
              </div>
            )}
          </div>

          {/* Author Details */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {post.profiles?.full_name || "Unknown Author"}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={12} />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="text-primary" size={20} />
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </Link>
  );

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="w-48 h-8 mx-auto mb-4" />
            <Skeleton className="w-96 h-12 mx-auto mb-2" />
            <Skeleton className="w-64 h-6 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 p-4"
              >
                <Skeleton className="w-full h-48 mb-4" />
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-5/6 h-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 backdrop-blur-sm mb-4">
            <Sparkles className="text-primary" size={16} />
            <span className="text-sm font-semibold text-primary">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "All Projects"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {searchQuery ? "Search Results" : "Explore Amazing"}
            <br />
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {searchQuery ? "" : "Projects"}
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {searchQuery
              ? `Found ${newPosts.length} project${
                  newPosts.length !== 1 ? "s" : ""
                } matching your search`
              : "Discover projects from our talented developer community"}
          </p>
        </div>

        {/* Latest Posts Section */}
        {newPosts.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Flame className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {searchQuery ? "Results" : "Latest Posts"}
              </h2>
              {!searchQuery && (
                <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Most Popular Posts Section */}
        {!searchQuery && popularPosts.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="text-orange-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Most Popular
              </h2>
              <span className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-semibold px-3 py-1 rounded-full">
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

        {/* Classic Posts Section */}
        {!searchQuery && oldPosts.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <History className="text-blue-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Classic Posts
              </h2>
              <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold px-3 py-1 rounded-full">
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
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="text-gray-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {searchQuery ? "No results found" : "No projects yet"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Be the first to share your amazing work!"}
                </p>
                {searchQuery && (
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
                  >
                    View All Projects
                  </Link>
                )}
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default Projects;
