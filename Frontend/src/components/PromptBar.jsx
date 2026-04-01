import React from 'react';

const PromptBar = ({ prompt, setPrompt, loading, generateCode }) => {
  return (
    <div className="w-full p-2 md:p-4 relative z-20">
      <div className="w-full mx-auto flex items-end gap-2 md:gap-3 bg-gray-800/95 backdrop-blur-2xl border border-gray-700/80 p-1.5 md:p-2 rounded-2xl shadow-2xl focus-within:border-emerald-500/60 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              generateCode();
            }
          }}
          placeholder="Type your prompt here... (Press Enter to send)"
          className="flex-1 max-h-40 min-h-[44px] py-2.5 px-3 md:py-3 md:px-4 bg-transparent outline-none resize-none text-gray-100 placeholder-gray-400 text-[15px] leading-relaxed"
          disabled={loading}
          rows={1}
        />

        <button
          onClick={generateCode}
          disabled={loading || !prompt.trim()}
          className="shrink-0 p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center h-[46px] w-[46px] md:h-[52px] md:w-[52px]"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-500 mt-3 mb-1">AI can make mistakes. Please verify the code before using it in production.</p>
    </div>
  );
};

export default PromptBar;