import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router-dom"; // 1. Import this to read URL

const Projects = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Read the query parameter from URL (e.g., ?q=python)
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // 3. Initialize state with that query
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // 4. Update searchTerm if the URL changes (e.g. searching again from header while already on projects page)
  useEffect(() => {
    const queryFromUrl = searchParams.get("q");
    if (queryFromUrl !== null) {
      setSearchTerm(queryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    // Add a small delay so we don't spam the database while typing
    const delayDebounce = setTimeout(() => {
      fetchPosts(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  async function fetchPosts(query = "") {
    setLoading(true);
    try {
      let supabaseQuery = supabase
        .from("posts")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (query) {
        // Search in Title OR Content
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${query}%,content.ilike.%${query}%`
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              My Projects
            </h2>
            <p className="text-gray-500">
              {searchTerm
                ? `Showing results for "${searchTerm}"`
                : "Explore my technical projects and teaching materials."}
            </p>
          </div>

          {/* <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filter these results..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            <p className="text-xl text-gray-500">
              No projects found matching "{searchTerm}".
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={
                    post.image_url ||
                    "https://via.placeholder.com/600x400?text=Project"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Calendar size={14} />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6 flex-1">
                  {post.content}
                </p>

                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
                  View Project <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
