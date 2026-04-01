import React from 'react';

const ChatHistory = ({ messages }) => {
  return (
    <div className="space-y-6">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        return (
          <div key={idx} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            
            {/* AI Avatar */}
            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mr-3 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)] mt-1">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
            )}

            {/* Message Bubble */}
            <div className={`p-4 rounded-2xl max-w-[85%] shadow-lg text-[15px] leading-relaxed relative ${
              isUser 
                ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-tr-sm shadow-emerald-900/20' 
                : 'bg-gray-800/80 border border-gray-700/60 text-gray-200 rounded-tl-sm backdrop-blur-md'
            }`}>
              <span className="whitespace-pre-wrap">{msg.content}</span>
              
              {/* Optional dynamic active marker for AI */}
              {!isUser && idx === messages.length - 1 && (
                <span className="inline-block w-1.5 h-1.5 ml-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border border-indigo-400/30 flex items-center justify-center ml-3 shrink-0 shadow-lg mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            )}
            
          </div>
        );
      })}
    </div>
  );
};

export default ChatHistory;
