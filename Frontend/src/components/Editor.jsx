import React from 'react';

const Editor = ({ code, setCode, loading }) => {
  return (
    <div className="artifact-pane">
      <div className="pane-header">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
        Source Code
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden shadow-soft bg-bg relative border border-border/50 selection:bg-primary/30">
        <textarea
          value={loading ? "" : code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-6 bg-transparent text-text-primary font-mono text-sm md:text-sm resize-none outline-none focus:ring-0 leading-relaxed custom-scrollbar border-none"
          placeholder={loading ? "" : "// Generated code will appear here..."}
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Editor;