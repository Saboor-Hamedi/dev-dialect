// Dashboard post viewer with markdown support

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  ExternalLink,
  Github,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../ui/CodeBlock";
import { Skeleton } from "../ui/Skeleton";

const Show = ({ postId, onBack }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  async function fetchPost() {
    setLoading(true);
    try {
      // Get current user session for security check
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No active session");
        setPost(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(full_name, avatar_url)")
        .eq("id", postId)
        .eq("user_id", session.user.id) // Security: Only fetch posts owned by current user
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } else {
        setPost(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <article className="relative">
        {/* Banner Skeleton */}
        <Skeleton className="w-full h-[150px]" />

        {/* Content Container */}
        <div className="container mx-auto px-4 -mt-8 relative z-10 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Main Content Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 md:p-10 max-w-4xl mx-auto">
              {/* Back Button Skeleton */}
              <Skeleton className="w-20 h-6 mb-6" />

              {/* Title Skeleton */}
              <Skeleton className="w-3/4 h-12 mb-6" />

              {/* Meta Info Skeleton */}
              <div className="flex items-center gap-6 pb-6 mb-8 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
              </div>

              {/* Content Skeletons */}
              <div className="space-y-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-4/5 h-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Post not found
          </h2>
          <button onClick={onBack} className="text-primary hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="relative">
      {/* Banner Image - Full Width, 150px Height */}
      <div className="w-full h-[150px] bg-gradient-to-r from-primary/20 to-green-600/20 dark:from-primary/30 dark:to-green-600/30 relative overflow-hidden">
        <img
          src={post.image_url || "https://placehold.co/1200x150"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Content Container - Wider container with centered article card */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Card - Centered with max-w-4xl */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 md:p-10 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-6 transition-colors group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-medium">Back to Posts</span>
            </button>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200 dark:border-slate-700">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-green-600 overflow-hidden ring-2 ring-white dark:ring-slate-800 flex-shrink-0">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                      {(post.profiles?.full_name?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {post.profiles?.full_name || "Unknown Author"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Author
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock size={16} />
                <span>
                  {Math.max(
                    1,
                    Math.ceil((post.content?.split(" ").length || 0) / 200)
                  )}{" "}
                  min read
                </span>
              </div>

              <div className="ml-auto flex gap-2">
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                  <Share2 size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>

            {/* Project Details: Tags & Links */}
            {(post.tags?.length > 0 || post.demo_url || post.repo_url) && (
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 mb-8 border border-gray-100 dark:border-slate-700">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-slate-600 shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {post.demo_url && (
                      <a
                        href={post.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-green-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        <ExternalLink size={18} />
                        Live Demo
                      </a>
                    )}
                    {post.repo_url && (
                      <a
                        href={post.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-black text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        <Github size={18} />
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Markdown Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-green-600 prose-img:rounded-xl prose-img:shadow-md">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Show;
