import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Heart, Calendar, Eye, Trash2, BookOpen, Sparkles } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { Skeleton } from "../ui/Skeleton";
import ConfirmModal from "../ui/ConfirmModal";

const Bookmarks = ({ onView }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bookmarkId: null,
    postTitle: "",
  });

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      // First get bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from("bookmarks")
        .select("id, created_at, post_id")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (bookmarksError) {
        console.error("Bookmarks error:", bookmarksError);
        throw bookmarksError;
      }

      if (!bookmarksData || bookmarksData.length === 0) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      // Get all post IDs
      const postIds = bookmarksData.map((b) => b.post_id);

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, title, content, image_url, slug, created_at, tags")
        .in("id", postIds);

      if (postsError) {
        console.error("Posts error:", postsError);
        throw postsError;
      }

      // Combine bookmarks with posts
      const combinedData = bookmarksData
        .map((bookmark) => {
          const post = postsData.find((p) => p.id === bookmark.post_id);
          if (!post) return null;
          return {
            id: bookmark.id,
            created_at: bookmark.created_at,
            posts: post,
          };
        })
        .filter((item) => item !== null);

      setBookmarks(combinedData);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      showToast("Error loading bookmarks: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async () => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", deleteModal.bookmarkId);

      if (error) throw error;

      setBookmarks((prev) =>
        prev.filter((b) => b.id !== deleteModal.bookmarkId)
      );
      showToast("Bookmark removed", "success");
      setDeleteModal({ isOpen: false, bookmarkId: null, postTitle: "" });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      showToast("Error removing bookmark", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Saved Posts
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Your bookmarked projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4"
            >
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="w-3/4 h-6 mb-2" />
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-5/6 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Saved Posts
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {bookmarks.length} bookmarked{" "}
            {bookmarks.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
          <Heart
            className="text-red-600 dark:text-red-400"
            size={20}
            fill="currentColor"
          />
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            {bookmarks.length}
          </span>
        </div>
      </div>

      {/* Bookmarks Grid */}
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col"
            >
              {/* Image */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => onView(bookmark.posts.id)}
              >
                <img
                  src={
                    bookmark.posts.image_url || "https://placehold.co/600x400"
                  }
                  alt={bookmark.posts.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Bookmark Badge */}
                <div className="absolute top-3 right-3 p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Heart
                    className="text-red-600 dark:text-red-400"
                    size={16}
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3
                  className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors cursor-pointer"
                  onClick={() => onView(bookmark.posts.id)}
                >
                  {bookmark.posts.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                  {bookmark.posts.content}
                </p>

                {/* Tags */}
                {bookmark.posts.tags && bookmark.posts.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmark.posts.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(
                          bookmark.posts.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        bookmarkId: bookmark.id,
                        postTitle: bookmark.posts.title,
                      })
                    }
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start saving your favorite projects by clicking the bookmark icon
              on any post.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles size={20} />
              Explore Projects
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, bookmarkId: null, postTitle: "" })
        }
        onConfirm={handleRemoveBookmark}
        title="Remove Bookmark"
        message={`Are you sure you want to remove "${deleteModal.postTitle}" from your bookmarks?`}
        confirmText="Remove"
        confirmStyle="danger"
      />
    </div>
  );
};

export default Bookmarks;
