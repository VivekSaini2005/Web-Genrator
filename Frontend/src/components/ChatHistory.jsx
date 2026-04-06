import React, { useRef, useEffect } from 'react';
import { User, Sparkles, MoreHorizontal } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatHistory = ({ loading }) => {
  const { messages, isGenerating } = useChat();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (!messages || messages.length === 0) return null;

  return (
    <div className="w-full flex w-full flex-col gap-10 pb-20 transition-all duration-500">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isError = msg.role === 'error';
        const key = msg.id || `msg-${idx}`;

        return (
          <div
            key={key}
            className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 group ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
               {!isUser && (
                 <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-white text-slate-950 shadow-xl self-start border border-white/10">
                    <Sparkles size={16} strokeWidth={2.5} />        
                 </div>
               )}

               <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed tracking-tight whitespace-pre-wrap transition-all shadow-sm ${     
                    isUser
                      ? 'bg-slate-900 border border-white/5 text-slate-100 rounded-tr-md'
                      : isError
                      ? 'bg-red-500/10 border border-red-500/20 text-red-500 italic'
                      : 'text-slate-200'   
                  }`}>
                    {msg.content}
                  </div>
                  
                  {/* Action Bar (ChatGPT Style) */}
                  {!isUser && !isError && (
                    <div className="flex items-center gap-3 px-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={14} /></button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        );
      })}

      {isGenerating && (
        <div className="flex justify-start animate-in fade-in duration-300">
          <div className="flex gap-5 items-start">
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-white text-slate-950 shadow-xl border border-white/10">
               <Sparkles size={16} strokeWidth={2.5} className="animate-pulse" />
            </div>
            <div className="pt-3 flex gap-1.5">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      )}

      {/* Auto scroll anchor */}
      <div ref={endRef} className="h-4" />
    </div>
  );
};

export default ChatHistory;
