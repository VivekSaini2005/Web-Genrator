import React, { useRef, useEffect } from 'react';
import { ArrowUp, Plus, Paperclip, MoreHorizontal } from 'lucide-react';

const PromptBar = ({ prompt, setPrompt, loading, generateCode }) => {
  const textareaRef = useRef(null);

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
    <div className="w-full max-w-3xl mx-auto px-4 group">
      <div className="relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-none rounded-3xl transition-all duration-500 hover:shadow-primary/5 dark:hover:border-white/20 focus-within:border-slate-300 dark:focus-within:border-white/20 focus-within:shadow-xl dark:focus-within:shadow-white/5">
        
        {/* Input Area */}
        <div className="flex items-end gap-2 px-4 py-3">
          <button className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 shrink-0 mb-0.5 active:scale-90">
            <Plus size={20} strokeWidth={2.5} />
          </button>

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none py-2 text-[15px] text-slate-900 dark:text-white focus:ring-0 outline-none resize-none max-h-[200px] overflow-y-auto placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed font-medium transition-premium"
            rows={1}
            disabled={loading}
          />

          <button
            onClick={generateCode}
            disabled={loading || !prompt.trim()}
            className={`p-2 rounded-xl transition-all shrink-0 flex items-center justify-center mb-0.5 transform-gpu ${
              prompt.trim() 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:scale-110 active:scale-90 shadow-lg shadow-black/20 dark:shadow-white/10 rotate-0 hover:rotate-3' 
                : 'text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            {loading ? (
              <div className={`animate-spin h-5 w-5 border-2 rounded-full ${prompt.trim() ? 'border-white dark:border-slate-950 border-t-transparent' : 'border-slate-400 dark:border-slate-600 border-t-transparent'}`} />
            ) : (
              <ArrowUp size={20} strokeWidth={3} />   
            )}
          </button>
        </div>

        {/* Dynamic Footer Info (ChatGPT style) */}
        {/* {!prompt.trim() && !loading && (
          <div className="flex items-center gap-4 px-6 pb-3 overflow-x-auto no-scrollbar opacity-60 animate-in fade-in slide-in-from-bottom-2 duration-700">
             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-sm">
               <Paperclip size={12} /> Search
             </button>
             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-sm">
               <MoreHorizontal size={12} /> Reason 
             </button>
          </div>
        )} */}
      </div>
      
      <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 mt-3 font-medium tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        LinearGen can make mistakes. Check important info.
      </p>
    </div>
  );
};

export default PromptBar;
