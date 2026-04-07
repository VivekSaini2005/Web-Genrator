import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Plus, Paperclip, MoreHorizontal, Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const PromptBar = ({ content = "", setContent = () => {}, onSubmit }) => {
  const { currentChatId, sendMessage, isGenerating, createNewChat, selectChat } = useChat();  
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isBusy = loading || isGenerating;
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!content || typeof content !== 'string' || !content.trim() || isBusy) return;

    let targetChatId = currentChatId;

    if (onSubmit && !targetChatId) {
      onSubmit(content);
      return;
    }

    if (!targetChatId) {
      const result = await createNewChat(content.substring(0, 30));
      if (!result || !result.chat) return; // Wait! If creation failed, don't crash
      
      // ensure chat is selected before sending message
      await selectChat(result.chat.id);
      targetChatId = result.chat.id;
    }

    const messageToSend = content;
    setContent("");
    setLoading(true);

    try {
      await sendMessage(messageToSend, targetChatId);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 group">
      <div className="relative flex flex-col bg-white text-gray-900 border border-gray-200 shadow-sm dark:bg-slate-800 dark:border-white/10 dark:text-white dark:shadow-none rounded-3xl transition-all duration-500 hover:shadow-primary/5 dark:hover:border-white/20 focus-within:border-slate-300 dark:focus-within:border-white/20 focus-within:shadow-md dark:focus-within:shadow-white/5">

        {/* Input Area */}
        <div className="flex items-end gap-2 px-4 py-3">
          <button className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 shrink-0 mb-0.5 active:scale-90">
            <Plus size={20} strokeWidth={2.5} />
          </button>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={!user ? "Login to start chatting..." : "What should I build today?"}
            className="flex-1 bg-transparent border-none py-2 text-[15px] text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder:text-slate-500 focus:ring-0 outline-none resize-none max-h-[200px] overflow-y-auto leading-relaxed font-medium transition-premium disabled:opacity-50"
            rows={1}
            disabled={!user || isBusy}
          />

          <button
            onClick={handleSend}
            type="button"
            disabled={!user || isBusy || !content || typeof content !== 'string' || !content.trim()}
            className={`p-2 rounded-xl transition-all shrink-0 flex items-center justify-center mb-0.5 transform-gpu ${
              content && typeof content === 'string' && content.trim() && user && !isBusy
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:scale-110 active:scale-90 shadow-lg shadow-black/20 dark:shadow-white/10 rotate-0 hover:rotate-3'
                : 'text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            {isBusy ? (
              <Loader2 size={20} strokeWidth={3} className="animate-spin text-white dark:text-slate-950" />
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
