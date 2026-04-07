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
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-8 w-14 h-14 rounded-full bg-white dark:bg-white text-gray-900 flex items-center justify-center shadow-lg border border-gray-200 dark:border-white/10 hover:scale-110 transition-transform duration-500">
        <Sparkles size={28} strokeWidth={2.5} />
      </div>

      <h1 className="text-3xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
        {user ? "What should I build today?" : "Welcome to LinearGen"}
      </h1>

      <p className="text-gray-500 dark:text-slate-400 text-[15px] max-w-md mb-12 font-medium leading-relaxed">
        {user ? "Describe your dream website or UI component. LinearGen transforms your ideas into pixel-perfect production code." : "Log in to start generating pixel-perfect React components, building user interfaces, and organizing your conversations."}
      </p>

      {user ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((item, i) => (
            <button
              key={i}
              onClick={() => setPrompt && setPrompt(item.text)}
              className="group p-4 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-white/5 dark:border-white/5 dark:shadow-none text-left flex items-start gap-4 hover:border-gray-300 hover:shadow-md dark:hover:bg-white/10 dark:hover:border-white/10 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-white/5 group-hover:scale-110 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors leading-relaxed line-clamp-2">
                   {item.text}
                 </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-8 py-3.5 bg-gray-900 border border-gray-900 text-white dark:bg-white dark:border-white dark:text-slate-950 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-slate-200 transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-gray-900/10 dark:shadow-xl dark:shadow-white/5"
        >
          <LogIn size={20} strokeWidth={2.5} />
          Sign In to Continue
        </button>
      )}
    </div>
  );
};

export default EmptyState;
