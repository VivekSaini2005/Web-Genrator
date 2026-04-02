import React from 'react';

const Editor = ({ code, setCode, loading }) => {
  return (
    <textarea
      value={loading ? "" : code}
      onChange={(e) => setCode(e.target.value)}
      className="w-full h-full p-8 bg-slate-950 text-slate-300 font-mono text-[14px] md:text-[15px] resize-none outline-none focus:ring-0 leading-relaxed selection:bg-blue-500/20 custom-scrollbar border-none"
      placeholder={loading ? "" : "// Generated code will appear here..."}
      spellCheck="false"
    />
  );
};

export default Editor;