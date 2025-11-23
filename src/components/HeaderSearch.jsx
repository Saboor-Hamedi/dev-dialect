import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const HeaderSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // 1. Redirect to Projects page with the query parameter
      navigate(`/projects?q=${encodeURIComponent(query)}`);
      // Optional: Clear input or keep it to show what was searched
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden lg:block group">
      {/* Icon */}
      <Search
        size={18}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
      />

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-full text-sm outline-none transition-all w-48 focus:w-64 focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-gray-200 shadow-inner"
      />
    </form>
  );
};

export default HeaderSearch;
