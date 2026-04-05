import React from 'react';

const ChatHistory = ({ messages }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="flex flex-col w-full pb-10 space-y-2">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        
        return (
          <div 
            key={idx} 
            className={`w-full flex justify-center animate-fadeIn ${
              isUser ? 'py-6' : 'py-10 border-y border-white/[0.03] bg-white/[0.02] shadow-inner'
            }`}
          >
            <div className={`w-full flex gap-6 md:gap-8 px-6 md:px-0 ${
              isUser ? 'max-w-[640px]' : 'max-w-[720px]'
            }`}>
              
              {/* Avatar */}
              <div className="shrink-0 mt-1">
                {isUser ? (
                  <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center text-sm font-bold shadow-sm border border-white/10">
                    U
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-blue-600/90 text-white flex items-center justify-center shadow-md border border-white/10">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Message Text Block */}
              <div className="flex-1 min-w-0">
                <div 
                  className={`text-[16px] md:text-[17px] leading-[1.8] md:leading-[1.9] tracking-[0.01em] whitespace-pre-wrap ${
                    isUser 
                      ? 'text-slate-100 font-medium' 
                      : msg.role === 'error' 
                        ? 'text-red-400 font-normal leading-relaxed' 
                        : 'text-slate-300 font-normal leading-relaxed'
                  }`}
                >
                  {msg.content}
                </div>
                
                {/* Optional dynamic cursor/indicator for the latest AI message */}
                {!isUser && idx === messages.length - 1 && (
                  <span className="inline-block w-2 h-4 mt-3 bg-blue-500/50 animate-pulse rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                )}
              </div>
              
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatHistory;
