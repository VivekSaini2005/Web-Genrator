import React from "react";

const Editor = ({ code, setCode }) => {
  return (
    <div className="h-full bg-[#0d1117] text-green-400">
      <div className="p-2 border-b border-gray-700 text-sm">
        editor.js
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-[calc(100%-40px)] p-3 bg-transparent outline-none font-mono text-sm"
      />
    </div>
  );
};

export default Editor;