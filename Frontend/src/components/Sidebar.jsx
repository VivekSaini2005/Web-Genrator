import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Sidebar = ({ chats = [], activeChatId, onSelectChat }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-surface border-r border-border h-full p-4 flex flex-col text-text-primary">
      
      {/* Sidebar Header */}
      <div className="flex flex-col gap-1 mb-8 px-2">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span className="text-sm font-bold tracking-tight uppercase">LinearGen</span>
         </div>
         <h1 className="text-xs font-medium text-text-secondary opacity-60 ml-1">AI Web Generator</h1>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar -mx-2 px-2">
        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] px-3 mb-3 opacity-40">
           Recent Projects
        </div>
        
        {!user ? (
          <div className="px-3 py-10 text-center">
            <p className="text-[11px] font-medium text-text-secondary opacity-50 leading-relaxed px-2 tracking-tight">
              Login to save your projects
            </p>
          </div>
        ) : chats.length === 0 ? (
          <div className="px-3 py-10 text-center text-text-secondary opacity-50">
            <p className="text-[11px] font-medium leading-relaxed px-2 tracking-tight">
              No projects yet. Start generating!
            </p>
          </div>
        ) : (
          chats.map(chat => {
            const isActive = activeChatId ? chat.id === activeChatId : false; 

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat && onSelectChat(chat.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-sm transition-all cursor-pointer text-left group ${
                  isActive 
                    ? 'bg-bg text-text-primary shadow-sm ring-1 ring-border/50' 
                    : 'text-text-secondary hover:bg-bg/50 hover:text-text-primary'
                }`}
              >
                <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary/40 group-hover:text-text-secondary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <span className="truncate text-xs font-medium">{chat.title}</span>
              </button>
            )
          })
        )}
      </div>

      {/* User Section */}
      <div className="mt-auto pt-6 border-t border-border/50">
         {user ? (
            <div className="flex items-center gap-2">
               <Link 
                 to="/profile" 
                 className="flex-1 flex items-center gap-3 p-2.5 rounded-2xl hover:bg-bg transition-all group overflow-hidden border border-transparent hover:border-border/50"
               >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold text-text-primary truncate">{user.name}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary opacity-50">Settings</div>
                  </div>
               </Link>
               <button 
                  onClick={handleLogout}
                  className="p-2.5 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/20"
                  title="Logout"
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
               </button>
            </div>
         ) : (
            <Link to="/login" className="btn-primary w-full text-sm">
               Sign In
            </Link>
         )}
      </div>
    </aside>
  );
};

export default Sidebar;
