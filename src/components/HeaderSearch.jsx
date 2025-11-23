import React, { useState, useEffect } from "react";
import { Search, Command } from "lucide-react";
import CommandPalette from "./CommandPalette";

const HeaderSearch = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCommandPaletteOpen]);

  return (
    <>
      {/* Search Button - Desktop */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-sm transition-all group w-64"
      >
        <Search
          size={16}
          className="text-gray-400 group-hover:text-primary transition-colors"
        />
        <span className="flex-1 text-left text-gray-500 dark:text-gray-400">
          Search posts...
        </span>
        <kbd className="hidden xl:inline-flex items-center gap-0.5 px-2 py-1 text-xs font-semibold text-gray-500 bg-white dark:bg-slate-900 rounded border border-gray-300 dark:border-slate-600">
          <Command size={12} />
          <span>K</span>
        </kbd>
      </button>

      {/* Search Button - Mobile */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="lg:hidden p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
        aria-label="Search"
      >
        <Search size={18} />
      </button>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};

export default HeaderSearch;
