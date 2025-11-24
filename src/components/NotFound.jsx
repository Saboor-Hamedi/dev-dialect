import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft, FileQuestion } from "lucide-react";

const NotFound = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-extrabold text-gray-200 dark:text-slate-800 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
              <FileQuestion className="text-primary" size={48} />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onBack || (() => navigate(-1))}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            <Home size={20} />
            Go Home
          </button>

          <button
            onClick={() => {
              navigate("/projects");
            }}
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-semibold transition-all"
          >
            <Search size={20} />
            Browse Projects
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-primary hover:underline"
            >
              Home
            </button>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <button
              onClick={() => navigate("/projects")}
              className="text-sm text-primary hover:underline"
            >
              Projects
            </button>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <button
              onClick={() => navigate("/about")}
              className="text-sm text-primary hover:underline"
            >
              About
            </button>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <button
              onClick={() => navigate("/contact")}
              className="text-sm text-primary hover:underline"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
