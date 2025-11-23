import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/categories/Categories";
import Features from "./components/Features";
import Posts from "./components/clients/Posts";
import Dashboard from "./components/dashboard/Dashboard";
import Projects from "./components/Projects";
import Show from "./components/posts/Show";
import Update from "./components/posts/Update";
import "./index.css";

import { ToastProvider } from "./context/ToastContext";

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
    <ToastProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 font-sans">
        <Routes>
          {/* Main Layout Route */}
          <Route
            path="/"
            element={
              <>
                {/* Top Notification Bar */}

                <Header toggleTheme={toggleTheme} darkMode={darkMode} />

                <main>
                  <Hero />
                  <Categories />
                  {/* <Features /> */}
                  <Posts />
                </main>

                {/* Simple Footer Placeholder */}
                <footer className="bg-gray-100 dark:bg-slate-800 py-8 text-center text-gray-600 dark:text-gray-300 mt-12">
                  <p>© 2025 Upstudy. All rights reserved.</p>
                </footer>
              </>
            }
          />

          {/* Projects Route */}
          <Route
            path="/projects"
            element={
              <>
                <Header toggleTheme={toggleTheme} darkMode={darkMode} />
                <Projects />
                <footer className="bg-gray-100 dark:bg-slate-800 py-8 text-center text-gray-600 dark:text-gray-300 mt-12">
                  <p>© 2025 Upstudy. All rights reserved.</p>
                </footer>
              </>
            }
          />
          <Route path="/show/:id" element={<Show />} />
          <Route path="/posts/:id/update" element={<Update />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
