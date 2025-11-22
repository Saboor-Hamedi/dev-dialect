import React, { useState } from "react";
import { Search, ShoppingCart, Menu, X, Moon, Sun, User } from "lucide-react";
import "../assets/Header.css";
import Portfolio from "./Portfolio";

const Header = ({ toggleTheme, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white">
            Upstudy
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#" className="nav-link active">
            Home
          </a>
          <a href="#" className="nav-link">
            Courses
          </a>
          <a href="#" className="nav-link">
            Pages
          </a>
          <a href="#" className="nav-link">
            Shop
          </a>
          <a href="#" className="nav-link">
            Blog
          </a>
          <a href="#" className="nav-link">
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* <Portfolio /> */}

          <button onClick={toggleTheme} className="icon-btn text-primary">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="flex items-center gap-2 text-slate-600 dark:text-gray-300 font-medium hover:text-primary">
            <User size={20} /> Login
          </button>
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
          <a href="#" className="mobile-nav-link">
            Home
          </a>
          <a href="#" className="mobile-nav-link">
            Courses
          </a>
          <a href="#" className="mobile-nav-link">
            Blog
          </a>
          <a href="#" className="mobile-nav-link">
            Contact
          </a>
          <hr className="dark:border-slate-700" />
          <div className="flex justify-between items-center">
            <button
              onClick={toggleTheme}
              className="text-slate-800 dark:text-white flex gap-2 items-center"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="text-primary font-bold">Login</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
