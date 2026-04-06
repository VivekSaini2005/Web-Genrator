import React from 'react';

const EmptyState = ({ setPrompt }) => {
  const suggestions = [
    "A modern landing page for a coffee shop",
    "A sleek dashboard with charts and tables",
    "A responsive pricing component with cards",
    "A glassmorphism login form"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fadeIn max-w-4xl mx-auto w-full">
      <div className="mb-8 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/5 border border-primary/20">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>
      
      <h1 className="text-3xl font-semibold text-text-primary tracking-tight mb-4">
        What will you <span className="text-primary italic">generate</span> today?
      </h1>
      
      <p className="text-text-secondary text-sm max-w-lg mb-12 opacity-80 leading-relaxed">
        Describe any interface, component, or entire page in plain English, and our AI will build the code for you in real-time.
      </p>
      
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suggestions.map((suggestion, i) => (
          <button 
            key={i} 
            onClick={() => setPrompt(suggestion)} 
            className="group p-5 rounded-2xl bg-surface/50 border border-border/50 text-left flex items-start gap-4 cursor-pointer hover:bg-surface/80 hover:border-primary/30 transition-all duration-200 active:scale-[0.99]"
          >
            <div className="shrink-0 w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-sm border border-border/50 group-hover:scale-110 transition-transform">
              💡
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors leading-snug">
                 {suggestion}
               </p>
            </div>
            <svg className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
