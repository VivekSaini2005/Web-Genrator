import React from 'react';

const Navbar = () => {
  return (
    <div className="px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex justify-center items-center gap-3 tracking-tight">
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        AI Web Generator
      </h1>
    </div>
  );
};

export default Navbar;