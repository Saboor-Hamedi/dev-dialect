import React from "react";
import {
  Code2,
  Palette,
  Database,
  Smartphone,
  Globe,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Web Development",
    icon: <Code2 />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    count: "120+ Projects",
  },
  {
    name: "UI/UX Design",
    icon: <Palette />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    count: "85+ Projects",
  },
  {
    name: "Backend & APIs",
    icon: <Database />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    count: "95+ Projects",
  },
  {
    name: "Mobile Apps",
    icon: <Smartphone />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    count: "60+ Projects",
  },
  {
    name: "Full Stack",
    icon: <Globe />,
    color: "from-teal-500 to-green-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    count: "110+ Projects",
  },
  {
    name: "DevOps & Cloud",
    icon: <Cpu />,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    count: "45+ Projects",
  },
  {
    name: "Frameworks",
    icon: <Layers />,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    count: "75+ Projects",
  },
  {
    name: "AI & ML",
    icon: <Sparkles />,
    color: "from-pink-500 to-purple-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    count: "30+ Projects",
  },
];

const Categories = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 backdrop-blur-sm mb-4">
            <Sparkles className="text-primary" size={16} />
            <span className="text-sm font-semibold text-primary">
              Explore Categories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Popular Development
            <br />
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Categories
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover projects across various technologies and frameworks
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-xl ${cat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div
                    className={`bg-gradient-to-br ${cat.color} bg-clip-text text-transparent`}
                  >
                    {React.cloneElement(cat.icon, { size: 28, strokeWidth: 2 })}
                  </div>
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>

                {/* Project Count */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cat.count}
                </p>

                {/* Arrow Icon */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              ></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            View All Categories
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
