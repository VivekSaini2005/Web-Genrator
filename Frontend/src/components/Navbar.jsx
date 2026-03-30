import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#020617] border-b border-gray-800">
      <h1 className="text-lg font-semibold text-green-400">
        ⚡ AI Cursor
      </h1>

      <div className="text-sm text-gray-400">
        Gemini Powered
      </div>
    </div>
  );
};

export default Navbar;