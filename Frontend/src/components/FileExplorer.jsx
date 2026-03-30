import React from "react";

const files = ["index.html", "style.css", "script.js"];

const FileExplorer = ({ setCode }) => {
  return (
    <div className="w-48 bg-[#0d1117] border-r border-gray-700 p-2 text-sm">
      <h3 className="mb-2 text-gray-400">Explorer</h3>

      {files.map((file, i) => (
        <div
          key={i}
          className="p-2 hover:bg-gray-700 cursor-pointer rounded"
          onClick={() => setCode(`// Opened ${file}`)}
        >
          📄 {file}
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;