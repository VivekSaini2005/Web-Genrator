import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="px-6 py-4 border-b border-border/50 bg-bg/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between transition-all duration-300">
      <Link to="/" className="flex items-center gap-3 group tracking-tight">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <span className="text-lg font-semibold text-text-primary hidden sm:inline-block">LinearGen</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-bg transition-all border border-transparent hover:border-border/40 group">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
               {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                  user.name?.charAt(0).toUpperCase()
               )}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-text-primary leading-tight">{user.name}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-text-secondary opacity-40 leading-tight">Settings</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/20"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-4 py-2 text-sm font-bold text-text-secondary uppercase tracking-widest hover:text-text-primary transition-all rounded-xl hover:bg-white/5">Log In</Link>
          <Link to="/register" className="btn-primary px-5 py-2 text-sm shadow-lg shadow-primary/10">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;