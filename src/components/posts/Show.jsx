// Dashboard post viewer with markdown support

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../ui/CodeBlock";

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
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(full_name, avatar_url)")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
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
                      alt={post.profiles?.full_name || "Author"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                      {(post.profiles?.full_name?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {post.profiles?.full_name || "Unknown Author"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />5 min read
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Bookmark"
                >
                  <Bookmark
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>

            {/* Price Badge (if exists) */}
            {post.price && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 mb-8">
                <span className="text-sm font-semibold text-primary">
                  Price: {post.price}
                </span>
              </div>
            )}

            {/* Markdown Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 leading-relaxed
              [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 
              [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-10 [&>h1]:mb-4 [&>h1]:text-slate-900 [&>h1]:dark:text-white
              [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-slate-900 [&>h2]:dark:text-white
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-slate-900 [&>h3]:dark:text-white
              [&>p]:mb-4 [&>p]:leading-relaxed
              [&>ul]:my-4 [&>ul]:space-y-2
              [&>ol]:my-4 [&>ol]:space-y-2
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6
              [&_table]:border-collapse [&_table]:w-full [&_table]:my-6
              [&_th]:border [&_th]:border-gray-300 [&_th]:dark:border-slate-600 [&_th]:bg-gray-100 [&_th]:dark:bg-slate-700 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold
              [&_td]:border [&_td]:border-gray-300 [&_td]:dark:border-slate-600 [&_td]:p-3
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:shadow-md
              [&_a]:text-primary [&_a]:hover:underline [&_a]:font-medium
              [&_hr]:my-8 [&_hr]:border-gray-200 [&_hr]:dark:border-slate-700
            "
            >
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

          {/* Author Card at Bottom */}
          <div className="mt-8 bg-gradient-to-br from-primary/5 to-green-50 dark:from-primary/10 dark:to-slate-800 rounded-2xl p-6 border border-primary/20 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-green-600 overflow-hidden ring-4 ring-white dark:ring-slate-800 flex-shrink-0">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles?.full_name || "Author"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {(post.profiles?.full_name?.[0] || "U").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Written by
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {post.profiles?.full_name || "Unknown Author"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Developer & Content Creator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Show;
