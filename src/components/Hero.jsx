import React from 'react';
import '../assets/Hero.css';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-green-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-100/50 dark:bg-yellow-900/10 rounded-l-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        {/* Text Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <span className="text-sm font-bold text-yellow-500 uppercase tracking-wider">⚡ Learn From 20,000+ Quality Courses</span>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Best to <br/>
            <span className="relative inline-block">
              Platform
              <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300 -z-10 opacity-70 transform -rotate-1"></span>
            </span> <br/>
            Empower Skills
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
            Start Your Education Journey For a Better Future. Access top-tier courses from industry experts.
          </p>
          
          <button className="bg-primary hover:bg-teal-600 text-white font-bold py-4 px-8 rounded shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            Start Learning Now
          </button>
        </div>

        {/* Image Content */}
        <div className="flex-1 relative">
            {/* Image Placeholder */}
          <div className="relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600" 
              alt="Student Learning" 
              className="rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover h-[500px]"
            />
            
            {/* Floating Card */}
            <div className="absolute top-1/2 -left-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-slow">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-white font-bold">2K+</div>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">100K+</p>
                <p className="text-xs text-gray-500">Total Enrolled Students</p>
              </div>
            </div>
          </div>
          
          {/* Abstract Background Shape behind image */}
          <div className="absolute top-10 right-10 w-full h-full border-2 border-dashed border-primary/30 rounded-full -z-0 transform rotate-12"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;