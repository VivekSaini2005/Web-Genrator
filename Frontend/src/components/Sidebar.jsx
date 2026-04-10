import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate, Link } from 'react-router-dom';
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
  const { user } = useAuth();
  const { chats, currentChatId, selectChat, resetChat, deleteChat, loadingChats } = useChat();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateNewChat = () => {
    resetChat();
  };

  const filteredChats = chats.filter(chat => 
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside 
      className={`app-sidebar-responsive relative h-full min-w-0 max-w-full overflow-auto bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'sidebar-collapsed w-16' : 'sidebar-expanded w-56'
      } z-50`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] shadow-sm z-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Workspace Header */}
      {!isCollapsed && (
        <div className="px-5 pt-5 pb-2">
          <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Workspace</p>
        </div>
      )}
      <div className={`flex items-center gap-3 border-b border-[var(--border-color)] ${isCollapsed ? 'justify-center p-4' : 'px-5 pb-4'}`}>
        {/* <div 
          onClick={handleCreateNewChat}
          className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center shrink-0 hover:bg-[var(--text-secondary)] transition-colors cursor-pointer shadow-sm"
        >
          <Zap size={16} fill="currentColor" />
        </div> */}
        <div 
          onClick={handleCreateNewChat}
          className="group w-9 h-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center shrink-0 hover:bg-[var(--bg-hover)] transition-all duration-200 cursor-pointer shadow-sm"
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-200 group-hover:scale-110"
          >
            {/* Pencil / Create */}
            <path 
              d="M4 20H8L18.5 9.5C19.3284 8.67157 19.3284 7.32843 18.5 6.5C17.6716 5.67157 16.3284 5.67157 15.5 6.5L5 17V20Z" 
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />

            {/* Minimal sparkle (AI touch) */}
            <path 
              d="M14 4L14.5 5.5L16 6L14.5 6.5L14 8L13.5 6.5L12 6L13.5 5.5L14 4Z" 
              fill="currentColor"
              className="opacity-80"
            />
          </svg>
        </div>

        {!isCollapsed && (
          <div className="overflow-hidden fade-in flex items-center gap-2">
            <span className="text-[14px] font-semibold tracking-tight text-[var(--text-primary)] leading-none">WebGen</span>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      {user && (
        <div className="px-4 py-4">
          <button
            onClick={handleCreateNewChat}
            disabled={loadingChats}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm hover:shadow-md hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <Plus size={isCollapsed ? 18 : 16} className="shrink-0 text-[var(--accent)]" />
            {!isCollapsed && <span className="text-[13px] font-medium">New Chat</span>}
          </button>
        </div>
      )}

      {/* Search Bar - Only for logged in users */}
      {user && !isCollapsed && (
        <div className="px-4 mb-3">
          <div className="relative group/search">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] focus-within:text-[var(--text-primary)]" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--border-color)] focus:bg-[var(--bg-primary)] rounded-lg py-1.5 pl-8 pr-3 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      )}

      {/* History List - Only for logged in users */}
      {user && (
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scroll-smooth custom-scrollbar">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2 mb-2 mt-1">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Chats</span>
            </div>
          )}

          <div className="space-y-0.5">
            {loadingChats ? (
              <div className="flex flex-col gap-2 items-center justify-center py-6 text-[var(--text-secondary)]">
                <Loader2 size={16} className="animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className={`px-2 py-4 text-center ${isCollapsed ? 'hidden' : ''}`}>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {searchQuery ? "No matching chats" : "No history"}
                </p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <div key={chat.id} className="relative group/chat">
                  <button
                    onClick={() => selectChat(chat.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 border ${
                      currentChatId === chat.id 
                        ? 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] shadow-sm' 
                        : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <MessageSquare 
                      size={!isCollapsed ? 14 : 16} 
                      className={`shrink-0 transition-colors ${currentChatId === chat.id ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover/chat:text-[var(--text-primary)]'}`} 
                    />
                    {!isCollapsed && (
                      <span className="truncate text-left flex-1 pr-6 tracking-tight leading-tight block w-full">
                        {chat.title || 'Untitled Chat'}
                      </span>
                    )}
                  </button>
                  
                  {!isCollapsed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-500 opacity-0 group-hover/chat:opacity-100 transition-opacity bg-[var(--bg-secondary)] shadow-sm border border-[var(--border-color)] group-hover/chat:bg-white dark:group-hover/chat:bg-slate-800"
                      title="Delete Chat"
                    >
                      <Trash2 size={13} />
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
      <div className="mt-auto p-3 border-t border-[var(--border-color)]">
        <div className="space-y-1">
          {user ? (
            !isCollapsed ? (
              <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[var(--bg-secondary)] transition-colors group">
                  <Link to="/profile" className="flex items-center gap-2.5 shrink-0 overflow-hidden flex-1">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center font-medium shrink-0">
                      {user?.avatar_url ? <img src={user.avatar_url} alt="A" className="w-full h-full rounded-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</div>
                      {/* <div className="text-[11px] text-[var(--text-secondary)]">Pro Account</div> */}
                    </div>
                  </Link>
                {/* <button 
                  onClick={() => navigate('/settings')}
                  className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md transition-colors"
                >
                  <Settings size={15} />
                </button> */}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-2">
                <Link to="/profile" className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-color)] overflow-hidden shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </Link>
              </div>
            )
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-secondary)] transition-colors font-medium text-sm ${isCollapsed ? 'justify-center px-0' : ''}`}
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
