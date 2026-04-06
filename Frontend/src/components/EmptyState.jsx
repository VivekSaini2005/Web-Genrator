import React from 'react';
import { Zap, Layout, Palette, Sparkles } from 'lucide-react';

const EmptyState = ({ setPrompt }) => {
  const suggestions = [
    { text: "A modern food delivery landing page with high-quality images", icon: <Layout size={18} /> },
    { text: "A sleek fintech dashboard with dark mode and glassmorphism", icon: <Palette size={18} /> },
    { text: "A colorful travel booking platform with card layouts", icon: <Sparkles size={18} /> },
    { text: "A minimal personal portfolio for a creative developer", icon: <Zap size={18} /> }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-8 w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl border border-white/10 hover:scale-110 transition-transform duration-500">
        <Sparkles size={28} strokeWidth={2.5} />
      </div>

      <h1 className="text-3xl md:text-3xl font-bold text-white tracking-tight mb-4">
        What should I build today?
      </h1>

      <p className="text-slate-400 text-[15px] max-w-md mb-12 font-medium leading-relaxed">
        Describe your dream website or UI component. LinearGen transforms your ideas into pixel-perfect production code.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => setPrompt(item.text)}
            className="group p-4 rounded-2xl bg-white/5 border border-white/5 text-left flex items-start gap-4 hover:bg-white/10 hover:border-white/10 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 border border-white/5 group-hover:scale-110 group-hover:text-white transition-all duration-500">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed line-clamp-2">
                 {item.text}
               </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
