import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/categories/Categories";
import Features from "./components/Features";
import Posts from "./components/clients/Posts";
import ShowPost from "./components/clients/ShowPost";
import Dashboard from "./components/dashboard/Dashboard";
import Projects from "./components/Projects";
import Update from "./components/posts/Update";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import Contact from "./components/Contact";
import About from "./components/About";
import "./index.css";

import { ToastProvider } from "./context/ToastContext";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">
        Loading...
      </div>
    );
  if (!session) return <Navigate to="/" replace />;

  return children;
};

function App() {
  // Initialize theme from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Theme Logic
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Accent Color Logic
    const savedAccent = localStorage.getItem("accentColor");
    if (savedAccent) {
      document.documentElement.style.setProperty(
        "--color-primary",
        savedAccent
      );
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

          {/* Client-side Post Viewer - Using slug for SEO */}
          <Route
            path="/show/:slug"
            element={
              <>
                <Header toggleTheme={toggleTheme} darkMode={darkMode} />
                <ShowPost />
                <footer className="bg-gray-100 dark:bg-slate-800 py-8 text-center text-gray-600 dark:text-gray-300 mt-12">
                  <p>© 2025 Upstudy. All rights reserved.</p>
                </footer>
              </>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/contact"
            element={
              <>
                <Header toggleTheme={toggleTheme} darkMode={darkMode} />
                <Contact />
                <footer className="bg-gray-100 dark:bg-slate-800 py-8 text-center text-gray-600 dark:text-gray-300">
                  <p>© 2025 Upstudy. All rights reserved.</p>
                </footer>
              </>
            }
          />

          <Route
            path="/about"
            element={
              <>
                <Header toggleTheme={toggleTheme} darkMode={darkMode} />
                <About />
                <footer className="bg-gray-100 dark:bg-slate-800 py-8 text-center text-gray-600 dark:text-gray-300">
                  <p>© 2025 Upstudy. All rights reserved.</p>
                </footer>
              </>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Update route should also be protected */}
          <Route
            path="/posts/:id/update"
            element={
              <ProtectedRoute>
                <Update />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
