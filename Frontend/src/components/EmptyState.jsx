import React from 'react';

const EmptyState = ({ setPrompt }) => {
  const suggestions = [
    "A modern landing page for a coffee shop",
    "A sleek dashboard with charts and tables",
    "A responsive pricing component with cards",
    "A glassmorphism login form"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in overflow-y-auto">
      <div className="relative group mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative w-24 h-24 bg-gray-900 ring-1 ring-gray-800 flex items-center justify-center rounded-full">
          <span className="text-5xl">✨</span>
        </div>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">What do you want to build?</h2>
      <p className="text-gray-400 md:text-lg max-w-2xl text-center leading-relaxed">
        Describe your dream interface, component, or entire page, and let our AI generate the code instantly.
      </p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm max-w-3xl w-full">
        {suggestions.map((suggestion, i) => (
          <div key={i} onClick={() => setPrompt(suggestion)} className="bg-gray-800/40 border border-gray-700/50 hover:border-emerald-500/50 hover:bg-gray-800/60 p-4 rounded-xl cursor-pointer transition-all duration-200 text-left flex items-start gap-3 flex-1">
            <span className="text-emerald-400 mt-0.5">💡</span>
            <span className="text-gray-300">{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
