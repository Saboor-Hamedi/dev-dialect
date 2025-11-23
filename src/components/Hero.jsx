import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Sparkles,
  Users,
  BookOpen,
  TrendingUp,
  Zap,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 backdrop-blur-sm">
              <Sparkles className="text-primary" size={16} />
              <span className="text-sm font-semibold text-primary">
                Welcome to DevDialect
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Build Amazing
                <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                    Projects
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10C50 5 100 2 198 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-primary/50"
                    />
                  </svg>
                </span>
                <br />
                Together
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover cutting-edge development tutorials, share your
                projects, and connect with a community of passionate developers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Explore Projects
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                <Code2 size={20} />
                Start Creating
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-slate-700">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Users className="text-primary" size={20} />
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    2K+
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Developers
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <BookOpen className="text-primary" size={20} />
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    500+
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Projects
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <TrendingUp className="text-primary" size={20} />
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    98%
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 transform hover:scale-105 transition-transform duration-500">
              {/* Code Editor Mockup */}
              <div className="bg-slate-900 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-xs text-gray-400 font-mono">
                    App.jsx
                  </span>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-purple-400">
                    <span className="text-pink-400">import</span> React{" "}
                    <span className="text-pink-400">from</span>{" "}
                    <span className="text-green-400">'react'</span>;
                  </div>
                  <div className="text-blue-400">
                    <span className="text-pink-400">const</span>{" "}
                    <span className="text-yellow-300">App</span> = () =&gt;{" "}
                    {"{"}
                  </div>
                  <div className="pl-4 text-pink-400">
                    <span className="text-pink-400">return</span> (
                  </div>
                  <div className="pl-8 text-green-400">
                    &lt;<span className="text-blue-400">div</span>&gt;Hello
                    World&lt;/<span className="text-blue-400">div</span>&gt;
                  </div>
                  <div className="pl-4 text-pink-400">);</div>
                  <div className="text-blue-400">{"}"}</div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="p-8 bg-gradient-to-br from-primary/5 to-green-50 dark:from-primary/10 dark:to-slate-800">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
                      <Zap className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Live Preview
                      </h3>
                      <p className="text-xs text-gray-500">Real-time updates</p>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-green-100 dark:from-primary/30 dark:to-green-900/30 rounded-lg flex items-center justify-center">
                    <p className="text-2xl font-bold text-primary">
                      Hello World
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Code2 className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Active Now
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    250+ Devs
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 animate-float delay-1000">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Sparkles className="text-yellow-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    New Project
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Just Posted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              currentColor 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
};

export default Hero;
