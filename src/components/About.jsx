import React from "react";
import { Code, Users, Globe, Heart, Coffee, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-20 pb-12">
      {/* Hero Section - Reused Style but New Content */}
      <div className="relative bg-primary/5 dark:bg-primary/10 py-24 mb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            We Are Building the <br />
            <span className="text-primary">Future of Devs</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            DevDialect is a community-driven platform where developers share
            knowledge, showcase projects, and inspire the next generation of
            coders.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 mb-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            To empower developers worldwide by providing a space to learn, grow,
            and connect. We believe that knowledge should be free, accessible,
            and shared openly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
              <Code size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Clean Code
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Promoting best practices and clean, maintainable code standards
              across all languages.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Community First
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Built by developers, for developers. A supportive environment for
              everyone.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Global Impact
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Connecting minds from every corner of the globe to solve
              real-world problems.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 text-white py-20 mb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                10k+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">
                500+
              </div>
              <div className="text-gray-400">Projects Shared</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">
                50+
              </div>
              <div className="text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                24/7
              </div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            The passionate minds behind DevDialect
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Alex Johnson",
              role: "Founder & CEO",
              color: "bg-blue-500",
            },
            {
              name: "Sarah Chen",
              role: "Lead Developer",
              color: "bg-green-500",
            },
            {
              name: "Mike Ross",
              role: "Product Designer",
              color: "bg-purple-500",
            },
          ].map((member, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/5] bg-gray-200 dark:bg-slate-800 relative">
                {/* Placeholder for team image */}
                <div
                  className={`absolute inset-0 ${member.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Users size={64} className="opacity-20" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-300 text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <Heart className="mx-auto mb-6 text-white/80" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Journey
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Be part of a growing community that values innovation,
              collaboration, and creativity.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
