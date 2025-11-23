import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Trash2, Edit, Eye, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../ui/ConfirmModal";

const Index = ({ onEdit, onView }) => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    postId: null,
  });

  // Pagination state - shows 5 posts per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // 1. Fetch Data with pagination
  useEffect(() => {
    fetchPosts();
  }, [currentPage]); // Re-fetch when page changes

  async function fetchPosts() {
    setLoading(true);

    // Calculate range for pagination
    const from = (currentPage - 1) * postsPerPage;
    const to = from + postsPerPage - 1;

    // Fetch total count
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    setTotalPosts(count || 0);

    // Fetch paginated posts
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .range(from, to); // Limit to 5 posts per page

    if (error) console.error("Error:", error);
    else setPosts(data);
    setLoading(false);
  }

  // Open Delete Modal
  const confirmDelete = (id) => {
    setDeleteModal({ isOpen: true, postId: id });
  };

  // 2. Delete Function
  async function deletePost() {
    const id = deleteModal.postId;
    if (!id) return;

    // Optimistic update: Remove locally first for instant feedback
    setPosts((current) => current.filter((post) => post.id !== id));

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      showToast("Error deleting post", "error");
      fetchPosts(); // Revert on error
    } else {
      showToast("Post deleted successfully", "success");
      // Re-fetch posts to fill the gap from the next page
      fetchPosts();

      // If this was the last post on the page and not the first page, go back one page
      if (posts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  }

  // Skeleton Row Component
  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-100 dark:border-slate-700">
      <td className="p-4">
        <div className="h-4 w-8 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-12 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="p-4">
        <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      </td>
      <td className="p-4">
        <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded ml-auto"></div>
      </td>
    </tr>
  );

  return (
    <>
      {/* Data Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
        {loading && posts.length === 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    ID
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    Image
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    Title
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    Status
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className={`w-full text-left border-collapse transition-opacity duration-300 ${
                loading ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    ID
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    Image
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    Title
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700">
                    Status
                  </th>
                  <th className="p-4 font-semibold border-b dark:border-slate-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="p-4 text-gray-500 font-mono text-xs">
                      #{post.id}
                    </td>
                    <td className="p-4">
                      <div className="h-12 w-20 rounded overflow-hidden bg-gray-200 border border-gray-300 dark:border-slate-600">
                        <img
                          src={post.image_url || "https://placehold.co/150x100"}
                          alt="Thumb"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-white">
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {post.content}
                      </div>
                    </td>
                    <td className="p-4">
                      {post.is_public ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle size={12} /> Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircle size={12} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView && onView(post.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit && onEdit(post.id)}
                          className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(post.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <p>No posts found. Click "Add New Post" to get started.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls - only show if there are posts */}
      {(totalPosts > 0 || loading) && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-200 dark:border-slate-700">
          {/* Page info */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {loading && posts.length === 0 ? (
              <span className="animate-pulse bg-gray-200 dark:bg-slate-700 h-4 w-32 rounded inline-block"></span>
            ) : (
              <>
                Showing {(currentPage - 1) * postsPerPage + 1} to{" "}
                {Math.min(currentPage * postsPerPage, totalPosts)} of{" "}
                {totalPosts} posts
              </>
            )}
          </div>

          {/* Page navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {loading && posts.length === 0 ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              ) : (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={deletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default Index;
