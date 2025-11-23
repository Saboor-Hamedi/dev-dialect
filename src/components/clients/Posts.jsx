import React, { useEffect, useState } from "react";
import { BookOpen, Heart } from "lucide-react";
// import "../assets/Posts.css";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      // Fetch only 4 posts, ordered by creation date
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="text-center py-20">Loading your amazing work...</div>
    );

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Top Posts
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* If no projects found */}
        {posts.length === 0 && <p>No projects found in the database.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="course-card bg-white dark:bg-slate-800 rounded-2xl 
              overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="relative">
                {/* Use a default image if image_url is empty */}
                <img
                  src={post.image_url || "https://placehold.co/400"}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  {/* <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {course.category}
                  </span> */}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.content}
                </p>

                <hr className="border-gray-100 dark:border-slate-700 mb-4" />

                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-green-500">
                    {post.price || "Free"}
                  </span>
                  <Link
                    to={`/show/${post.id}`}
                    className="text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-primary transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Posts;
