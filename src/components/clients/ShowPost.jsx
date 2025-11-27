// Client-side post viewer with markdown support

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  ArrowUp,
  ExternalLink,
  Github,
  BarChart2,
  Edit,
  Trash2,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../ui/CodeBlock";
import { Skeleton } from "../ui/Skeleton";
import ConfirmModal from "../ui/ConfirmModal";
import { Helmet } from "react-helmet-async";

const ShowPost = () => {
  const { slug } = useParams(); // Changed from id to slug
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [session, setSession] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Track reading progress and scroll position
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY;

          // Calculate reading progress
          const totalHeight = documentHeight - windowHeight;
          const progress = (scrollTop / totalHeight) * 100;
          setReadingProgress(Math.min(progress, 100));

          // Show scroll to top button after scrolling 300px
          setShowScrollTop(scrollTop > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Share post with Web Share API
  const handleShare = async () => {
    const shareData = {
      title: post?.title || "Check out this post",
      text: post?.title || "Check out this post on DevDialect",
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      // User cancelled or error occurred
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
      }
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bookmark functionality
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    if (post?.id) {
      checkIfBookmarked();
    }
  }, [post?.id]);

  const checkIfBookmarked = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data, error } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) {
        setIsBookmarked(true);
      }
    } catch (error) {
      // Not bookmarked or error
      setIsBookmarked(false);
    }
  };

  const handleBookmark = async () => {
    try {
      setBookmarking(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if not authenticated
        navigate("/login");
        return;
      }

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", session.user.id);

        if (error) throw error;
        setIsBookmarked(false);
      } else {
        // Add bookmark
        const { error } = await supabase.from("bookmarks").insert({
          post_id: post.id,
          user_id: session.user.id,
        });

        if (error) throw error;
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
    } finally {
      setBookmarking(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post: " + error.message);
    }
  };

  async function fetchPost() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(full_name, avatar_url)")
        .eq("slug", slug)
        .eq("is_public", true) // Security: Only fetch public posts
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
      <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
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
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Dynamic Meta Tags for Social Media Previews */}
      <Helmet>
        <title>{post.title} | DevDialect</title>
        <meta
          name="description"
          content={post.content?.substring(0, 160).replace(/[#*`]/g, "")}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.content?.substring(0, 160).replace(/[#*`]/g, "")}
        />
        <meta
          property="og:image"
          content={post.image_url || "https://dev-dialect.com/logo.svg"}
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={post.title} />
        <meta
          property="twitter:description"
          content={post.content?.substring(0, 160).replace(/[#*`]/g, "")}
        />
        <meta
          property="twitter:image"
          content={post.image_url || "https://dev-dialect.com/logo.svg"}
        />
      </Helmet>

      {/* Banner Image - Full Width, 150px Height */}
      <div className="w-full h-[150px] bg-gradient-to-r from-primary/20 to-green-600/20 dark:from-primary/30 dark:to-green-600/30 relative overflow-hidden">
        <img
          src={post.image_url || "https://placehold.co/1200x150"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 md:p-10 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors group"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="font-medium">Back</span>
              </button>

              {/* Owner Controls */}
              {session?.user?.id === post.user_id && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg transition-colors"
                    title="View Statistics"
                  >
                    <BarChart2 size={16} />
                    <span className="hidden sm:inline">Stats</span>
                  </button>

                  <button
                    onClick={() => {
                      localStorage.setItem("dashboardView", "update");
                      localStorage.setItem("editingPostId", post.id);
                      navigate("/dashboard");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-green-600 rounded-lg transition-all"
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (post.profiles?.full_name?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div>
                  {session ? (
                    <Link
                      to={`/profile/${post.user_id}`}
                      className="font-semibold text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {post.profiles?.full_name || "Unknown Author"}
                    </Link>
                  ) : (
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {post.profiles?.full_name || "Unknown Author"}
                    </p>
                  )}
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
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                  title="Share this post"
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked
                      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                  title={
                    isBookmarked ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Bookmark
                    size={20}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>

            {/* Project Details: Tags & Links */}
            {(post.tags?.length > 0 || post.demo_url || post.repo_url) && (
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-2 mb-8 border border-gray-100 dark:border-slate-700">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-slate-600 shadow-sm"
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
                        className="flex-1 md:flex-none flex items-center justify-center gap-1 px-2.5 py-1 bg-primary hover:bg-green-600 text-white text-xs rounded-md font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        <ExternalLink size={12} />
                        Live Demo
                      </a>
                    )}
                    {post.repo_url && (
                      <a
                        href={post.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none flex items-center justify-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-black text-white text-xs rounded-md font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        <Github size={12} />
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
                  pre: ({ children }) => <>{children}</>,
                  p: ({ children, node }) => {
                    // Check if paragraph contains a code block
                    if (
                      node?.children?.some((child) => child.tagName === "code")
                    ) {
                      return <div>{children}</div>;
                    }
                    return <p>{children}</p>;
                  },
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        {children}
                      </table>
                    </div>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-green-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-primary hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone and all data will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </article>
  );
};

export default ShowPost;
