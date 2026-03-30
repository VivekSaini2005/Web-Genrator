import React from "react";

const PromptBar = ({ prompt, setPrompt, onGenerate }) => {
  return (
    <div className="flex gap-2 p-3 bg-[#161b22] border-b border-gray-700">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Build a modern website..."
        className="flex-1 p-2 rounded bg-[#0d1117] border border-gray-600 outline-none"
      />

      <button
        onClick={onGenerate}
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
      >
        Generate
      </button>
    </div>
  );
};

export default PromptBar;