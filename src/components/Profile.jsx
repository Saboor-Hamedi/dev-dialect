import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import {
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Github,
  Globe,
  Calendar,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Heart,
} from "lucide-react";
import { Skeleton } from "./ui/Skeleton";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publicPosts: 0,
    totalViews: 0,
  });

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
      setStats({
        totalPosts: data?.length || 0,
        publicPosts: data?.filter((p) => p.is_public).length || 0,
        totalViews: data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="w-full h-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Profile not found
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
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
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary/20 to-green-600/20 dark:from-primary/30 dark:to-green-600/30 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          {/* Profile Info */}
          <div className="px-6 md:px-12 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-green-600 p-1 inline-block">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-400" size={48} />
                  )}
                </div>
              </div>
            </div>

            {/* Name and Bio */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                {profile.full_name || "Anonymous Developer"}
              </h1>
              {profile.bio && (
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Social Links */}
            {(profile.twitter ||
              profile.facebook ||
              profile.github ||
              profile.website) && (
              <div className="flex flex-wrap gap-3 mb-6">
                {profile.twitter && (
                  <a
                    href={`https://twitter.com/${profile.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Twitter size={18} />
                    <span className="font-medium">Twitter</span>
                  </a>
                )}
                {profile.facebook && (
                  <a
                    href={`https://facebook.com/${profile.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Facebook size={18} />
                    <span className="font-medium">Facebook</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Github size={18} />
                    <span className="font-medium">GitHub</span>
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <Globe size={18} />
                    <span className="font-medium">Website</span>
                  </a>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200 dark:border-slate-700">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stats.totalPosts}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Projects
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                  {stats.publicPosts}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Public
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
                  {stats.totalViews}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Views
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-primary" size={24} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Published Projects
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/show/${post.slug}`)}
                className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image_url || "https://placehold.co/600x400"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {post.views > 0 && (
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{post.views} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              This user hasn't published any projects yet.
            </p>
          </div>
        )}
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-primary/10 to-green-600/10 dark:from-primary/20 dark:to-green-600/20 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
          <Sparkles className="mx-auto text-primary mb-4" size={48} />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            More Features Coming Soon!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're working on exciting new features including activity timeline,
            achievements, collaboration tools, and more. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
