import React from "react";
import {
  Calculator,
  Lightbulb,
  FlaskConical,
  Briefcase,
  Code2,
  Send,
  Telescope,
  Zap,
} from "lucide-react";

const categories = [
  {
    name: "Mathematics",
    icon: <Calculator />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Idea Generate",
    icon: <Lightbulb />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Chemistry",
    icon: <FlaskConical />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Business Analysis",
    icon: <Briefcase />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Development",
    icon: <Code2 />,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Email Marketing",
    icon: <Send />,
    color: "bg-pink-100 text-pink-600",
  },
  { name: "Astrology", icon: <Telescope />, color: "bg-red-100 text-red-600" },
  {
    name: "IT / Technology",
    icon: <Zap />,
    color: "bg-cyan-100 text-cyan-600",
  },
];

const Categories = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Top Categories
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer bg-gray-50 dark:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
            >
              <div className={`p-3 rounded-lg ${cat.color}`}>{cat.icon}</div>
              <span className="font-semibold text-slate-700 dark:text-gray-200">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
