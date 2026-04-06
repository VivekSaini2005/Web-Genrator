import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Plus,
  MessageSquare,
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Zap,
  History,
  Trash2,
  Search,
  Loader2
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { chats, currentChatId, loadChats, selectChat, createNewChat, deleteChat, loadingChats } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredChats = chats.filter(chat => 
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside 
      className={`relative h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } z-50`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-slate-900 dark:bg-white border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-white dark:text-slate-950 shadow-lg hover:scale-125 hover:shadow-xl active:scale-90 z-50 group transition-all duration-300 transform-gpu"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header Branding */}
      <div className={`p-6 mb-2 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} transition-all duration-500`}>
        <div 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-lg shadow-black/5 shrink-0 hover:rotate-12 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <Zap size={24} fill="currentColor" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden fade-in">
            <span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-white block leading-none transition-colors duration-300">LinearGen</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 block">Pro v1.0</span>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      {user && (
        <div className="px-4 mb-2">
          <button
            onClick={() => createNewChat()}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-900/5 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-900/10 dark:hover:bg-white/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : ''}`}
          >
            <Plus size={isCollapsed ? 20 : 18} strokeWidth={2.5} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-semibold tracking-tight">New Chat</span>}
          </button>
        </div>
      )}

      {/* Search Bar - Only for logged in users */}
      {user && !isCollapsed && (
        <div className="px-4 mb-4">
          <div className="relative group/search">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-slate-900 dark:group-focus-within/search:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 focus:border-slate-300 dark:focus:border-white/20 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* History List - Only for logged in users */}
      {user && (
        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] opacity-60">History</span>
              <History size={12} className="text-slate-400 dark:text-slate-500" />
            </div>
          )}

          <div className="space-y-0.5">
            {loadingChats ? (
              <div className="flex flex-col gap-2 items-center justify-center py-6 text-slate-400">
                <Loader2 size={16} className="animate-spin text-slate-500" />
                <span className="text-[10px] font-medium tracking-wide">Loading chats...</span>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className={`px-3 py-4 text-center ${isCollapsed ? 'hidden' : ''}`}>
                <p className="text-[11px] font-medium italic text-slate-400 dark:text-slate-500/60">
                  {searchQuery ? "No matching chats" : "No recent chats"}
                </p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <div key={chat.id} className="relative group px-2">
                  <button
                    onClick={() => selectChat(chat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 relative overflow-hidden group/item ${
                      currentChatId === chat.id 
                        ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 active:bg-white/10'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <MessageSquare 
                      size={isCollapsed ? 20 : 16} 
                      className={`shrink-0 transition-transform duration-300 group-hover/item:scale-110 ${currentChatId === chat.id ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} 
                    />
                    {!isCollapsed && (
                      <span className="truncate text-left font-medium flex-1 pr-6 tracking-tight">
                        {chat.title || 'Untitled Chat'}
                      </span>
                    )}
                    
                    {/* Active Indicator Dot */}
                    {currentChatId === chat.id && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-slate-900 dark:bg-white rounded-r-full" />
                    )}
                  </button>
                  
                  {!isCollapsed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform-gpu hover:scale-110 z-10"
                      title="Delete Chat"
                    >
                      <Trash2 size={13} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {!user && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4 border border-slate-200 dark:border-white/5">
            <History size={24} />
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 px-4">Login to save and keep track of your chat history.</p>
        </div>
      )}

      {/* Bottom Profile Section */}
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-white/5">
        <div className="space-y-2">
          {user ? (
            !isCollapsed ? (
              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group overflow-hidden border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                  <Link to="/profile" className="flex items-center gap-3 shrink-0 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                      {user?.avatar_url ? <img src={user.avatar_url} alt="A" className="w-full h-full rounded-xl object-cover" /> : user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden whitespace-nowrap">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">{user?.name}</div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 opacity-60">Pro Account</div>
                    </div>
                  </Link>
                <button 
                  onClick={() => navigate('/settings')}
                  className="ml-auto p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
                >
                  <Settings size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-2">
                <Link to="/profile" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 overflow-hidden shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </Link>
              </div>
            )
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 active:scale-95 transition-all font-bold text-sm ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <LogOut size={16} className={isCollapsed ? '' : 'rotate-180'} />
              {!isCollapsed && <span>Sign In</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
