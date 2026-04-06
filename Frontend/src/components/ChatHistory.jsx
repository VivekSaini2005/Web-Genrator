import React from 'react';

const ChatHistory = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center animate-fadeIn px-6">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-border/50 flex items-center justify-center mb-4 shadow-sm opacity-50">
           <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </div>
        <p className="text-sm font-medium text-text-secondary opacity-60 tracking-tight">
          Start building your website with AI
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isError = msg.role === 'error';
        
        return (
          <div 
            key={idx} 
            className={`flex flex-col w-full animate-fadeIn transition-all duration-300 ${isUser ? 'items-end' : 'items-start'}`}
          >
            {/* Small Role Indicator */}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 px-2 opacity-30">
               {isUser ? 'You' : 'LinearGen'}
            </span>

            {/* Message Bubble */}
            <div 
              className={`px-5 py-3.5 rounded-2xl border transition-all duration-300 selection:bg-white/20 leading-relaxed group ${
                isUser 
                  ? 'bg-primary text-white border-primary/20 shadow-lg shadow-primary/5 self-end max-w-[85%] sm:max-w-[75%]' 
                  : isError
                  ? 'bg-red-400/10 border-red-400/20 text-red-300 max-w-full italic text-sm'
                  : 'bg-surface border-border/50 text-text-primary self-start max-w-[85%] sm:max-w-[75%] shadow-sm hover:shadow-md hover:border-border transition-all cursor-default'
              }`}
            >
              <div 
                className={`text-sm tracking-tight whitespace-pre-wrap font-normal ${
                  isUser ? 'text-white' : 'text-text-primary'
                }`}
              >
                {msg.content}
              </div>
              
              {/* Dynamic pulse for the latest AI message */}
              {!isUser && !isError && idx === messages.length - 1 && (
                <span className="inline-block w-1 h-3.5 ml-1 bg-primary/40 animate-pulse rounded-full align-middle"></span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatHistory;
