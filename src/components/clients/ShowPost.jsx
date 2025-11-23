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
    <article className="bg-gray-50 dark:bg-slate-900  w-[80%] mt-3 mx-auto">
      {/* Banner Image - 100px height */}

      <div className="h-[200px] bg-gray-200 dark:bg-slate-800 relative ">
        <img
          src={post.image_url || "https://placehold.co/400"}
          alt={post.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Content Card */}
      {/* container mx-auto px-4 max-w-4xl -mt-8 */}
      <div className="container">
        <div className="bg-white dark:bg-slate-800 md:p-12 ">
          {/* Back Button */}
          {/* <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Projects
          </button> */}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div
            className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8
           border-b border-gray-200 dark:border-slate-700 "
          >
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

          {/* Full Content - Markdown Rendered */}
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 leading-relaxed [&>pre]:my-6 [&>p]:my-4 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:mt-6 [&>h3]:mb-3 [&_table]:border-collapse [&_table]:w-full [&_table]:my-6 [&_th]:border [&_th]:border-gray-300 [&_th]:dark:border-slate-600 [&_th]:bg-gray-100 [&_th]:dark:bg-slate-800 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-300 [&_td]:dark:border-slate-600 [&_td]:p-3 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:mx-auto [&_img]:max-h-[500px] [&_img]:object-contain">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ShowPost;
