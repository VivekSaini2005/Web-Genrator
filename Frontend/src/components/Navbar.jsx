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

const Navbar = ({ showOptions, activeTab, setActiveTab, onEnhanceUI, isGenerating }) => {
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
    <nav className="h-14 w-full bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-5 flex items-center justify-between sticky top-0 z-30 shrink-0 transition-colors duration-300">

      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        <h2 className="text-[13px] font-medium text-[var(--text-secondary)]">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center: Tabs if options shown */}
      {showOptions && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-[var(--bg-secondary)] p-0.5 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] transition-colors duration-300">
          <button 
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-[11px] font-medium rounded-sm transition-colors ${activeTab === 'code' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Code
          </button>
          <button 
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-[11px] font-medium rounded-sm transition-colors ${activeTab === 'preview' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Preview
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {showOptions && onEnhanceUI && (
          <button 
            onClick={onEnhanceUI} 
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--accent)] hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="w-px h-3.5 bg-[var(--border-color)] mx-1" />
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


