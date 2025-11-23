// Client-side post viewer with markdown support

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const ShowPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
    }
    setLoading(false);
  }

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <article className="min-h-screen bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>

        {/* Header Section */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(post.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>5 min read</span>
          </div>
        </div>

        {/* Hero Image */}
        {post.image_url && (
          <div className="rounded-3xl overflow-hidden mb-10 shadow-lg max-h-[500px]">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Full Content - Markdown Rendered */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 leading-relaxed [&>pre]:my-6 [&>p]:my-4 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:mt-6 [&>h3]:mb-3">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
};

export default ShowPost;
