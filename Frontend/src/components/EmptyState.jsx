import React from 'react';

const EmptyState = ({ setPrompt }) => {
  const suggestions = [
    "A modern landing page for a coffee shop",
    "A sleek dashboard with charts and tables",
    "A responsive pricing component with cards",
    "A glassmorphism login form"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in overflow-y-auto">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight">
        What do you want to build?
      </h2>
      <p className="text-slate-400 text-base md:text-lg max-w-2xl text-center leading-relaxed font-light">
        Describe your dream interface, component, or entire page, and let our AI generate the code instantly.
      </p>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full">
        {suggestions.map((suggestion, i) => (
          <button 
            key={i} 
            onClick={() => setPrompt(suggestion)} 
            className="group bg-slate-900/40 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/60 p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] text-left flex items-start gap-4 flex-1 shadow-sm hover:shadow-blue-500/5 group"
          >
            <span className="text-lg group-hover:scale-125 transition-transform duration-300">💡</span>
            <span className="text-slate-400 text-sm md:text-base font-medium leading-relaxed group-hover:text-slate-100 transition-colors duration-300">
              {suggestion}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
