import React from 'react';

const FeatureCard = ({ title, subtitle, buttonText, image, reversed }) => (
  <div className="flex-1 bg-green-50 dark:bg-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:shadow-xl transition-all">
    <div className="z-10 flex-1 space-y-4">
      <span className="text-primary font-medium text-sm">Learn together with</span>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
      <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
        {buttonText}
      </button>
    </div>
    <div className="flex-1 relative">
      <img src={image} alt={title} className="rounded-xl shadow-lg object-cover h-48 w-full transform group-hover:scale-105 transition-transform" />
    </div>
    {/* Decorative Circles */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-black/20 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
  </div>
);

const Features = () => {
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <FeatureCard 
          title="Expert Teacher" 
          subtitle="If you've been researching exactly what skill you want."
          buttonText="View All Courses"
          image="https://images.unsplash.com/photo-1544531696-b14266442599?auto=format&fit=crop&q=80&w=400"
        />
        <FeatureCard 
          title="For Individuals" 
          subtitle="If you've been researching exactly what skill you want."
          buttonText="Find Your Course"
          image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400"
        />
      </div>
    </section>
  );
};

export default Features;