import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import {
  Search,
  X,
  Command,
  TrendingUp,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const resultsRef = useRef(null);

  // Fetch trending posts on mount (only latest 5)
  useEffect(() => {
    if (isOpen && trendingPosts.length === 0) {
      fetchTrendingPosts();
    }
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Fetch trending posts (latest 5 public posts)
  const fetchTrendingPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, content, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setTrendingPosts(data || []);
    } catch (err) {
      console.error("Error fetching trending posts:", err);
      setTrendingPosts([]);
    }
  };

  // Sanitize search query
  const sanitizeQuery = (input) => {
    if (!input || typeof input !== "string") return "";

    // Remove potentially dangerous characters and limit length
    return input
      .trim()
      .replace(/[<>"'`]/g, "") // Remove HTML/script injection chars
      .replace(/[;{}()]/g, "") // Remove code injection chars
      .substring(0, 100); // Limit length
  };

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const sanitizedQuery = sanitizeQuery(query);
    if (!sanitizedQuery) return text;

    // Escape special regex characters
    const escapedQuery = sanitizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    try {
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) => {
        if (regex.test(part)) {
          return (
            <mark
              key={index}
              className="bg-yellow-200 dark:bg-yellow-900/50 text-slate-900 dark:text-white font-semibold px-0.5 rounded"
            >
              {part}
            </mark>
          );
        }
        return part;
      });
    } catch (err) {
      return text;
    }
  };

  // Improved search with better matching
  const performSearch = useCallback(async (searchQuery) => {
    const sanitized = sanitizeQuery(searchQuery);

    if (!sanitized || sanitized.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      // Split query into words for better matching
      const words = sanitized
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 0);

      // Build search pattern for each word
      const titlePattern = words.map((w) => `title.ilike.%${w}%`).join(",");
      const contentPattern = words.map((w) => `content.ilike.%${w}%`).join(",");

      // Search with OR condition for better results
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, content, created_at")
        .eq("is_public", true)
        .or(`${titlePattern},${contentPattern}`)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      // Score and sort results by relevance
      const scoredResults = (data || []).map((post) => {
        let score = 0;
        const lowerTitle = post.title.toLowerCase();
        const lowerContent = post.content.toLowerCase();

        words.forEach((word) => {
          // Exact match in title gets highest score
          if (lowerTitle === word) score += 100;
          // Title starts with word
          else if (lowerTitle.startsWith(word)) score += 50;
          // Title contains word
          else if (lowerTitle.includes(word)) score += 30;
          // Content contains word
          if (lowerContent.includes(word)) score += 10;
        });

        return { ...post, score };
      });

      // Sort by score (highest first), then by date
      scoredResults.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setResults(scoredResults.slice(0, 10));
      setSelectedIndex(0);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce search by 300ms
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle result selection
  const handleSelect = (post) => {
    if (!post || !post.slug) return;

    navigate(`/show/${post.slug}`);
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const itemCount =
        results.length > 0 ? results.length : trendingPosts.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % itemCount);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case "Enter":
          e.preventDefault();
          const items = results.length > 0 ? results : trendingPosts;
          if (items[selectedIndex]) {
            handleSelect(items[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, results, trendingPosts, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const displayItems =
    results.length > 0 ? results : query ? [] : trendingPosts;
  const showTrending = !query && trendingPosts.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[10vh] px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-slate-700">
            <Search className="text-gray-400 flex-shrink-0" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search posts, topics, or keywords..."
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-gray-400 outline-none text-lg"
              autoComplete="off"
              spellCheck="false"
            />
            {loading && (
              <Loader2 className="text-primary animate-spin" size={20} />
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-gray-400 rounded border border-gray-300 dark:border-slate-600">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Trending Posts (only when no query) */}
            {showTrending && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={14} />
                  Latest Posts
                </div>
                <div ref={resultsRef}>
                  {trendingPosts.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => handleSelect(post)}
                      className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-all text-left group ${
                        selectedIndex === index
                          ? "bg-primary/10 dark:bg-primary/20"
                          : "hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <FileText
                        size={18}
                        className={`flex-shrink-0 mt-0.5 ${
                          selectedIndex === index
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white truncate">
                          {post.title}
                        </div>
                        {post.content && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {post.content.substring(0, 80)}...
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className={`flex-shrink-0 mt-1 transition-all ${
                          selectedIndex === index
                            ? "text-primary opacity-100"
                            : "text-gray-400 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && results.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} />
                  Results ({results.length})
                </div>
                <div ref={resultsRef}>
                  {results.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => handleSelect(post)}
                      className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-all text-left group ${
                        selectedIndex === index
                          ? "bg-primary/10 dark:bg-primary/20"
                          : "hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <FileText
                        size={18}
                        className={`flex-shrink-0 mt-0.5 ${
                          selectedIndex === index
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white line-clamp-1">
                          {highlightText(post.title, query)}
                        </div>
                        {post.content && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                            {highlightText(
                              post.content.substring(0, 120),
                              query
                            )}
                            ...
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className={`flex-shrink-0 mt-1 transition-all ${
                          selectedIndex === index
                            ? "text-primary opacity-100"
                            : "text-gray-400 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query && !loading && results.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try different keywords or check spelling
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-slate-600">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-slate-600">
                  ↵
                </kbd>
                Select
              </span>
            </div>
            <span className="hidden sm:block">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-slate-600">
                ESC
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;
