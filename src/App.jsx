import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Features from "./components/Features";
import Courses from "./components/Courses";
import "./index.css";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Routes>
        {/* Main Layout Route */}
        <Route
          path="/"
          element={
            <>
              {/* Top Notification Bar */}
              <div className="bg-slate-900 text-white text-xs py-2 text-center px-4">
                Your learning journey begins here - now with an exclusive
                discount!{" "}
                <span className="text-secondary font-bold cursor-pointer">
                  Hurry, offer ends soon!
                </span>
              </div>

              <Header toggleTheme={toggleTheme} darkMode={darkMode} />

              <main>
                <Hero />
                <Categories />
                <Features />
                <Courses />
              </main>

              {/* Simple Footer Placeholder */}
              <footer className="bg-gray-100 dark:bg-slate-800 py-8 text-center text-gray-600 dark:text-gray-300 mt-12">
                <p>© 2025 Upstudy. All rights reserved.</p>
              </footer>
            </>
          }
        />

        {/* Dashboard Route - No Header/Footer */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
