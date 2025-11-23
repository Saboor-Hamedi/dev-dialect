// Read the full post

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

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
      .select("*")
      .eq("id", postId)
      .single(); // .single() ensures we get one object, not an array

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
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Projects
        </button>

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
          <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Full Content */}
        {/* whitespace-pre-wrap preserves your line breaks/paragraphs from the database */}
        <div className="prose dark:prose-invert max-w-none text-lg text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
    </article>
  );
};

export default Show;
