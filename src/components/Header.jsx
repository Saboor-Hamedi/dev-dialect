import React, { useState } from "react";
import { Search, ShoppingCart, Menu, X, Moon, Sun, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Import Link
import "../assets/Header.css";
import HeaderSearch from "./HeaderSearch";
import Projects from "./Projects";

const Header = ({ toggleTheme, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Helper to check if link is active
  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800 dark:text-white">
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

          <a href="#" className="nav-link">
            About
          </a>
          <a href="#" className="nav-link">
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* SEARCH BUTTON: Takes user to Projects page to search */}

          <HeaderSearch />
          <button onClick={toggleTheme} className="icon-btn text-primary">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/dashboard"
            className="text-sm font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-slate-800 dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-700 p-4 flex flex-col gap-4 shadow-lg">
          <Link
            to="/"
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          {/* <Link
            to="/projects"
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Read Project
          </Link> */}
          <Link
            to="/dashboard"
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin Dashboard
          </Link>
          <hr className="dark:border-slate-700" />
          <div className="flex justify-between items-center">
            <button
              onClick={toggleTheme}
              className="text-slate-800 dark:text-white flex gap-2 items-center"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
