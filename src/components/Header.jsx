import React, { useState } from "react";
import { Menu, X, Moon, Sun, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../assets/Header.css";
import HeaderSearch from "./HeaderSearch";

const Header = ({ toggleTheme, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Helper to check if link is active
  const isActive = (path) =>
    location.pathname === path
      ? "relative text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
      : "text-slate-700 dark:text-gray-300 hover:text-primary transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div
                className="w-10 h-10 bg-gradient-to-br from-primary
               to-green-600 rounded-xl flex items-center justify-center 
               shadow-lg shadow-primary/20 group-hover:shadow-primary/40 
               transition-all duration-300 "
              >
                <Sparkles className="text-white" size={20} />
              </div>
            </div>
            <span
              className="text-xl font-bold bg-gradient-to-r 
            from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 
            bg-clip-text text-transparent"
            >
              Dev Dialect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
            <Link to="/projects" className={isActive("/projects")}>
              Projects
            </Link>
            <a
              href="#about"
              className="text-slate-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-slate-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Actions - Improved Layout */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search - More prominent */}
            <div className="mr-2">
              <HeaderSearch />
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200 dark:bg-slate-700"></div>

            {/* Theme Toggle & Admin grouped together */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                to="/dashboard"
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-green-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 "
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="px-4 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <a
              href="#about"
              className="px-4 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="px-4 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>

            <hr className="border-gray-200 dark:border-slate-700 my-2" />

            <Link
              to="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-primary to-green-600 text-white text-center font-semibold rounded-lg shadow-lg shadow-primary/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Dashboard
            </Link>

            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 rounded-lg text-slate-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
            >
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
