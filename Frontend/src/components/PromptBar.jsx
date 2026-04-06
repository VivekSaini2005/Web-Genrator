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
    <div className="w-full flex items-end gap-4 p-4 bg-surface/50 backdrop-blur-xl border border-border shadow-2xl rounded-3xl group transition-all duration-300 hover:border-primary/30">
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask LinearGen to build something..."
        className="flex-1 bg-transparent border-none px-2 py-3 text-sm text-text-primary focus:ring-0 outline-none resize-none max-h-[200px] overflow-y-auto transition-all duration-200 placeholder:text-text-secondary/40 leading-relaxed"
        rows={1}
        disabled={loading}
      />
      
      <button
        onClick={generateCode}
        disabled={loading || !prompt.trim()}
        className="w-12 h-12 bg-primary hover:bg-indigo-500 text-white rounded-2xl transition-all duration-200 flex-shrink-0 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PromptBar;