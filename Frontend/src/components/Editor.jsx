import React from 'react';

const Editor = ({ code, setCode, loading }) => {
  return (
    <textarea
      value={loading ? "" : code}
      onChange={(e) => setCode(e.target.value)}
      className="w-full h-full min-h-[400px] p-6 bg-transparent text-emerald-300 font-mono text-sm resize-none outline-none focus:ring-0 leading-relaxed"
      placeholder={loading ? "" : "Generated code will appear here..."}
      spellCheck="false"
    />
  );
};

export default Editor;