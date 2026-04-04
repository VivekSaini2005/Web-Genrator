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
    <div className="px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm flex items-center justify-between">
      <Link to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        AI Web Generator
      </Link>
      
      {user && (
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors cursor-pointer">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-sm text-right">
              <div className="font-semibold text-slate-200 leading-tight">{user.name}</div>
              <div className="text-xs text-slate-500 leading-tight">{user.email}</div>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      )}
      {!user && (
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors">Sign Up</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;