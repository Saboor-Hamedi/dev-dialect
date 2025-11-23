import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";

const HeaderSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const debounceTimer = useRef(null);

  // Sync input with URL query parameter
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/projects?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    // Clear any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // If we're on the projects page, clear the URL parameter
    if (location.pathname === "/projects") {
      navigate("/projects");
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only auto-search if on projects page
    if (location.pathname === "/projects") {
      // Debounce the search by 300ms
      debounceTimer.current = setTimeout(() => {
        if (newQuery.trim()) {
          navigate(`/projects?q=${encodeURIComponent(newQuery.trim())}`);
        } else {
          navigate("/projects");
        }
      }, 300);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearch} className="relative hidden lg:block group">
      {/* Search Icon */}
      <Search
        size={18}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none"
      />

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search projects..."
        value={query}
        onChange={handleInputChange}
        className="pl-10 pr-10 py-2 bg-gray-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-full text-sm outline-none transition-all w-48 focus:w-64 focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-gray-200 shadow-inner"
      />

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

export default HeaderSearch;
