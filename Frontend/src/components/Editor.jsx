import React from 'react';

const Editor = ({ code, setCode, loading }) => {
  return (
    <textarea
      value={loading ? "" : code}
      onChange={(e) => setCode(e.target.value)}
      className="w-full h-full min-h-[500px] p-6 bg-transparent text-[#d4d4d4] font-mono text-[15px] resize-none outline-none focus:ring-0 leading-relaxed selection:bg-blue-500/30"
      placeholder={loading ? "" : "// Generated code will appear here..."}
      spellCheck="false"
    />
  );
};

export default Editor;