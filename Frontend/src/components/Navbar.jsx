import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  LogOut,
  Sparkles,
  MessageCircle
} from 'lucide-react';

const Navbar = ({ showOptions, activeView, setActiveView, onEnhanceUI, isGenerating }) => {
  const { user, logout } = useAuth();
  const { continueLastChat } = useChat();
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

  const handleContinueChat = async () => {
    setActiveView("chat");
    await continueLastChat();
  };

  return (
    <nav className="w-full max-w-full min-h-14 md:h-14 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-3 md:px-5 py-2 md:py-0 flex flex-wrap items-center justify-between gap-2 md:gap-3 sticky top-0 z-30 shrink-0 overflow-x-hidden transition-colors duration-300">

      {/* Left: Page Title */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        <h2 className="hidden sm:block text-[13px] font-medium text-[var(--text-secondary)] truncate">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center: Tabs if options shown */}
      {showOptions && (
        <div className="order-3 w-full md:order-none md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
          <div className="w-full md:w-auto overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex min-w-max items-center rounded-xl border border-[var(--border-color)] bg-gray-900/90 p-0.5 sm:p-1 text-gray-300 shadow-sm transition-all duration-300">
              <button
                onClick={() => setActiveView("code")}
                className={`whitespace-nowrap px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-[11px] sm:text-[12px] md:text-[13px] font-medium rounded-lg border-b-2 transition-all duration-300 transform hover:scale-[1.03] ${activeView === 'code' ? 'border-purple-500 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white' : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveView("preview")}
                className={`whitespace-nowrap px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-[11px] sm:text-[12px] md:text-[13px] font-medium rounded-lg border-b-2 transition-all duration-300 transform hover:scale-[1.03] ${activeView === 'preview' ? 'border-purple-500 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white' : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveView("chat")}
                className={`whitespace-nowrap px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-[11px] sm:text-[12px] md:text-[13px] font-medium rounded-lg border-b-2 transition-all duration-300 transform hover:scale-[1.03] ${activeView === 'chat' ? 'border-purple-500 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white' : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Chat
              </button>
            </div>
        </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center flex-wrap justify-end gap-1.5 md:gap-2.5 shrink-0 min-w-0">
        {showOptions && (
          <button
            onClick={handleContinueChat}
            className="hidden sm:flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-sm transition-all duration-300 hover:scale-105"
          >
            <MessageCircle size={13} />
            Continue Chat
          </button>
        )}
        {showOptions && onEnhanceUI && (
          <button 
            onClick={onEnhanceUI} 
            disabled={isGenerating}
            className="hidden sm:flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-xs font-medium bg-[var(--accent)] hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={13} className={isGenerating ? "animate-pulse" : ""} />
            {isGenerating ? "Enhancing..." : "Enhance UI"}
          </button>
        )}
      {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* User Section */}
        {user ? (
          <>
            <div className="hidden sm:block w-px h-3.5 bg-[var(--border-color)] mx-1" />
            <Link
              to="/profile"
              className="flex items-center p-0.5 rounded-full hover:bg-[var(--bg-secondary)] transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center text-[10px] font-medium text-[var(--text-primary)] overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 text-xs font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-md hover:bg-[var(--text-secondary)] transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


