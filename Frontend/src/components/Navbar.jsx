import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const Navbar = ({ showOptions, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    // Initializing theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") return false;
    return true; // Default to dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Workspace';
    if (path === '/profile') return 'Profile';
    if (path.includes('/project')) return 'Editor';
    return 'Dashboard';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="h-16 w-full bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 transition-colors duration-300">

      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center: Tabs if options shown */}
      {showOptions && (
        <div className="absolute left-1/2 -translate-x-1/2 flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-colors duration-300">
          <button 
            onClick={() => setActiveTab("code")}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'code' ? 'bg-white dark:bg-white text-slate-950 dark:text-slate-950 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Code
          </button>
          <button 
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-white text-slate-950 dark:text-slate-950 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Preview
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User Section */}
        {user ? (
          <>
            <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white overflow-hidden shadow-sm group-hover:border-slate-400 dark:group-hover:border-white/20 transition-all">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl hover:opacity-90 transition-all shadow-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;