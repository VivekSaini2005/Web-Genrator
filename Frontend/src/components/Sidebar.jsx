import React from 'react';

const Sidebar = ({ chats = [], activeChatId, onSelectChat, onNewChat }) => {
  // Mock data for display purposes if no chats are passed
  const displayChats = chats.length > 0 ? chats : [
    { id: 1, title: 'Authentication Logic' },
    { id: 2, title: 'Landing Page UI' },
    { id: 3, title: 'API Integration' }
  ];

  return (
    <aside className="w-[260px] bg-slate-950 h-screen flex-shrink-0 flex-col hidden md:flex z-20 border-r border-white/10 text-slate-300 font-sans shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
      
      {/* Top Header & New Chat */}
      <div className="p-4 pb-5">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium bg-white/5 text-slate-100 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out border border-white/10 group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>New Chat</span>
          </div>
          <svg className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
      </div>

      {/* Subtle Divider */}
      <div className="px-5">
         <div className="h-px w-full bg-white/5"></div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5 custom-scrollbar">
        <div className="px-4 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
           Recent
        </div>
        
        {displayChats.map(chat => {
          const isActive = activeChatId ? chat.id === activeChatId : chat.id === 1; 

          return (
            <button
              key={chat.id}
              onClick={() => onSelectChat && onSelectChat(chat.id)}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left truncate border ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-100 border-blue-500/20 shadow-[0_2px_10px_rgba(59,130,246,0.1)]' 
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 border-transparent hover:border-white/5 hover:translate-x-1'
              }`}
            >
              <svg className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <span className="truncate">{chat.title}</span>
            </button>
          )
        })}
      </div>

      {/* Bottom Profile/Settings */}
      <div className="p-4 border-t border-white/5 mt-auto">
         <button className="group w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.03] hover:text-slate-100 transition-all duration-200 border border-transparent hover:border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-slate-700 group-hover:to-slate-800 transition-all duration-300 flex items-center justify-center text-slate-200 flex-shrink-0 text-xs shadow-inner border border-white/10 group-hover:border-white/20">
               US
            </div>
            <span className="truncate text-left flex-1 text-slate-400 group-hover:text-slate-100 transition-colors">My Workspace</span>
            <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
         </button>
      </div>

    </aside>
  );
};

export default Sidebar;
