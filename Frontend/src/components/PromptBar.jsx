import React, { useRef, useEffect } from 'react';

const PromptBar = ({ prompt, setPrompt, loading, generateCode }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content for a premium feel
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && prompt.trim()) {
        generateCode();
      }
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative flex items-end w-full bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[28px] shadow-2xl transition-all duration-300 focus-within:border-blue-500/40 focus-within:ring-1 focus-within:ring-blue-500/20 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-white/20 px-5 py-4 group">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to generate or edit code..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 text-[16px] md:text-[17px] leading-relaxed resize-none py-1 max-h-[200px] overflow-y-auto custom-scrollbar transition-all duration-200"
          rows={1}
          disabled={loading}
        />
        
        <div className="flex items-center ml-3 mb-0.5">
          <button
            onClick={generateCode}
            disabled={loading || !prompt.trim()}
            className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
              prompt.trim()
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-blue-500 hover:scale-110 active:scale-95 shadow-blue-500/20'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className={`w-5 h-5 transition-all duration-300 ${prompt.trim() ? 'translate-x-0.5 -translate-y-0.5 group-hover:scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptBar;