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
      <div className="relative flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] rounded-2xl transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-slate-400 dark:focus-within:border-slate-500 focus-within:shadow-[var(--shadow-md)]">

        {/* Input Area */}
        <div className="flex items-end gap-2 px-3 py-2.5">
          <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-secondary)] shrink-0 mb-0.5">
            <Plus size={20} strokeWidth={2.5} />
          </button>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={!user ? "Login to start chatting..." : "What should I build today?"}
            className="flex-1 bg-transparent border-none py-2 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-0 outline-none resize-none max-h-[200px] overflow-y-auto leading-relaxed transition-colors disabled:opacity-50"
            rows={1}
            disabled={!user || isBusy}
          />

          <button
            onClick={handleSend}
            type="button"
            disabled={!user || isBusy || !content || typeof content !== 'string' || !content.trim()}
            className={`p-2 rounded-lg transition-transform duration-200 shrink-0 flex items-center justify-center mb-0.5 ${
              content && typeof content === 'string' && content.trim() && user && !isBusy
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:scale-105 shadow-sm'
                : 'text-[var(--text-secondary)] bg-[var(--bg-secondary)] cursor-not-allowed opacity-50'
            }`}
          >
            {isBusy ? (
              <Loader2 size={18} strokeWidth={2.5} className="animate-spin text-[var(--bg-primary)]" />
            ) : (
              <ArrowUp size={18} strokeWidth={2.5} />   
            )}
          </button>
        </div>
      </div>
      
      <p className="text-[11px] text-center text-[var(--text-secondary)] mt-3">
        WebGen can make mistakes. Consider verifying important information.
      </p>
    </div>
  );
};

export default PromptBar;
