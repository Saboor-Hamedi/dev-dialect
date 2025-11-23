import React, { useEffect, useState } from "react";
import { Calendar, User, ArrowRight, Sparkles, Eye } from "lucide-react";
import { supabase } from "../../supabase";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/Skeleton";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      // Fetch only 4 PUBLIC posts, ordered by creation date, with author info
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(full_name, avatar_url)")
        .eq("is_public", true) // Security: Only fetch public posts
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 backdrop-blur-sm mb-4">
            <Sparkles className="text-primary" size={16} />
            <span className="text-sm font-semibold text-primary">
              Featured Projects
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Latest Developer
            <br />
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore the most recent projects from our talented community
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No projects found. Be the first to share your work!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link
                to={`/show/${post.slug}`}
                key={post.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image_url || "https://placehold.co/400x300"}
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
                        <span>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
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
            ))}
          </div>
        )}

        {/* View All Button */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
            >
              View All Projects
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;
