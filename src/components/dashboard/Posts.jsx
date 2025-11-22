import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Trash2, Edit, Eye, CheckCircle, XCircle } from "lucide-react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // 1. Fetch Data
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.error("Error:", error);
    else setPosts(data);
    setLoading(false);
  }

  // 2. Delete Function
  async function deletePost(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      alert("Error deleting post");
    } else {
      setPosts(posts.filter((post) => post.id !== id));
    }
  }
  return (
    <>
      {/* Data Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading data...</div>
        ) : (
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
                          src={
                            post.image_url || "https://via.placeholder.com/150"
                          }
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
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
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
    </>
  );
};

export default Posts;
