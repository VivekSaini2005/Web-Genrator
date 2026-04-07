import React from 'react';
import { Zap, Layout, Palette, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ setPrompt }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const suggestions = [
    { text: "A modern food delivery landing page with high-quality images", icon: <Layout size={18} /> },
    { text: "A sleek fintech dashboard with dark mode and glassmorphism", icon: <Palette size={18} /> },
    { text: "A colorful travel booking platform with card layouts", icon: <Sparkles size={18} /> },
    { text: "A minimal personal portfolio for a creative developer", icon: <Zap size={18} /> }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 w-12 h-12 rounded-[16px] bg-[var(--bg-secondary)] text-[var(--text-primary)] flex items-center justify-center border border-[var(--border-color)] shadow-sm">
        <Sparkles size={24} strokeWidth={2} />
      </div>

      <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-3">
        {user ? "What can I help you ship?" : "Welcome to LinearGen"}
      </h1>

      <p className="text-[var(--text-secondary)] text-[15px] max-w-lg mb-10 leading-relaxed">
        {user ? "Describe your dream UI component or full page layout. LinearGen transforms your ideas into production-ready code." : "Log in to start generating pixel-perfect React components, building user interfaces, and organizing your conversations."}
      </p>

      {user ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((item, i) => (
            <button
              key={i}
              onClick={() => setPrompt && setPrompt(item.text)}
              className="group p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-left flex items-start gap-3.5 hover:bg-[var(--bg-secondary)] transition-colors duration-200"
            >
              <div className="shrink-0 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-[13px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-relaxed">
                   {item.text}
                 </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2.5 px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <LogIn size={18} strokeWidth={2} />
          Sign In to Continue
        </button>
      )}
    </div>
  );
};

export default EmptyState;
