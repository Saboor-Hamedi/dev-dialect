import React, { useEffect, useState } from "react";
import { BookOpen, Heart } from "lucide-react";
import "../assets/Courses.css";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Add this import
const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      // This is the SQL equivalent: SELECT * FROM posts
      const { data, error } = await supabase.from("posts").select("*");

      if (error) throw error;

      setCourses(data || []);
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
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10">
          My Projects
        </h2>

        {/* If no projects found */}
        {courses.length === 0 && <p>No projects found in the database.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative">
                {/* Use a default image if image_url is empty */}
                <img
                  src={course.image_url || "https://via.placeholder.com/400"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  {/* <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {course.category}
                  </span> */}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2 h-14">
                  {course.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <BookOpen size={16} className="text-secondary" />
                  <span>{course.content || 0} Posts</span>
                  {/* Or change this to display Description */}
                </div>

                <hr className="border-gray-100 dark:border-slate-700 mb-4" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-500">
                    {course.price || "Free"}
                  </span>
                  <Link
                    to={`/dashboard`}
                    className="text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-primary"
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

export default Courses;
