import React from 'react';

const Navbar = () => {
  return (
    <div className="p-5 border-b border-gray-800/50 bg-gray-900/40 backdrop-blur-md sticky top-0 z-10 shadow-lg">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex justify-center items-center gap-2">
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        AI Web Generator
      </h1>
      <p className="text-xs text-center text-gray-500 mt-1 font-medium tracking-wider uppercase">Powered by Gemini</p>
    </div>
  );
};

export default Navbar;