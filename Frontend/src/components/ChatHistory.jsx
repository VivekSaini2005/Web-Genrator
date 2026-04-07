import React, { useRef, useEffect, useState } from 'react';
import { User, Sparkles, MoreHorizontal, LayoutList, Lightbulb, FileCode2, ChevronDown } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const PlanViewer = ({ plan }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 whitespace-normal overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors focus:outline-none"
      >
        <div className="font-semibold flex items-center gap-2 text-[15px] text-slate-800 dark:text-slate-200">
          <LayoutList size={16} className="text-indigo-500" />
          Execution Plan
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="p-4 pt-3 text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-1 fade-in duration-300">
          {plan.split('\n').map((line, i) => {
            if (!line.trim()) return null;
            const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="text-slate-900 dark:text-white font-semibold">{part.slice(2, -2)}</strong>;
              }
              return part;
            });
            return <span key={i} className="block mb-2 last:mb-0">{formattedLine}</span>;
          })}
        </div>
      )}
    </div>
  );
};

const renderMessageContent = (msg, isUser, isError) => {
  if (isUser || isError) {
    return (
      <div className={`px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed tracking-tight whitespace-pre-wrap transition-all shadow-sm ${
        isUser
          ? 'bg-gray-100 text-gray-900 border border-gray-200 shadow-sm dark:bg-white/10 dark:text-white dark:border-white/10 dark:shadow-none rounded-tr-md'
          : 'bg-red-500/10 border-red-500/20 text-red-500 italic'
      }`}>
        {msg.content}
      </div>
    );
  }

  // Attempt to parse AI JSON block to format nicely
  try {
    let codeToParse = msg.content;
    if (typeof codeToParse === 'string') {
      const sIdx = codeToParse.indexOf('{');
      const eIdx = codeToParse.lastIndexOf('}');
      if (sIdx !== -1 && eIdx !== -1 && eIdx > sIdx) {
        codeToParse = codeToParse.substring(sIdx, eIdx + 1);
      }
    }
    const parsed = JSON.parse(codeToParse);
    if (parsed && typeof parsed === 'object' && (parsed.title || parsed.plan)) {
      return (
        <div className="flex flex-col gap-4 px-6 py-5 rounded-3xl rounded-tl-md bg-white text-gray-900 border border-gray-200 shadow-sm dark:bg-slate-800 dark:text-white dark:border-white/10 dark:shadow-none w-full max-w-[600px]">
          {/* Header */}
          {(parsed.title || parsed.description) && (
            <div className="pb-3 border-b border-gray-100 dark:border-white/5 whitespace-normal">
              {parsed.title && <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 leading-snug">{parsed.title}</h3>}
              {parsed.description && <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{parsed.description}</p>}
            </div>
          )}

          {/* Plan Section */}
          {parsed.plan && <PlanViewer plan={parsed.plan} />}

          {/* Improvements Section */}
          {parsed.improvements && Array.isArray(parsed.improvements) && parsed.improvements.length > 0 && (
            <div className="whitespace-normal">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-[15px] pt-2">
                <Lightbulb size={16} className="text-amber-500" />
                Future Improvements
              </h4>
              <ul className="list-disc pl-5 text-[14px] text-slate-600 dark:text-slate-300 space-y-1.5 marker:text-slate-400">
                {parsed.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Files Generated Area */}
          {parsed.files && Object.keys(parsed.files).length > 0 && (
            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 whitespace-normal">
               <h4 className="font-semibold mb-3 flex items-center gap-2 text-[15px]">
                 <FileCode2 size={16} className="text-emerald-500" />
                 Files Generated
               </h4>
               <div className="flex flex-wrap gap-2">
                  {Object.keys(parsed.files).map(file => (
                    <span key={file} className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                      {file}
                    </span>
                  ))}
               </div>
            </div>
          )}
        </div>
      );
    }
  } catch (e) {
    // Legacy / Raw text fallback
  }

  // Fallback if parsing fails or object lacks expected shape
  return (
    <div className="px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed tracking-tight whitespace-pre-wrap transition-all shadow-sm bg-white text-gray-900 border border-gray-200 dark:bg-slate-800 dark:text-white dark:border-white/10 dark:shadow-none rounded-tl-md">
      {msg.content}
    </div>
  );
};

const ChatHistory = () => {
  const { messages, isGenerating } = useChat();
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  if (!messages || messages.length === 0) return null;

  return (
    <div className="w-full flex w-full flex-col gap-10 pb-20 transition-all duration-500">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isError = msg.role === 'error';
        const key = msg.id || `msg-${idx}`;

        return (
          <div
            key={key}
            className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 group ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
               {!isUser && (
                 <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-white text-slate-950 shadow-xl self-start border border-white/10">
                    <Sparkles size={16} strokeWidth={2.5} />        
                 </div>
               )}

               <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  {renderMessageContent(msg, isUser, isError)}

                  {/* Action Bar (ChatGPT Style) */}
                  {!isUser && !isError && (
                    <div className="flex items-center gap-3 px-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={14} /></button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        );
      })}

      {isGenerating && (
        <div className="flex justify-start animate-in fade-in duration-300">
          <div className="flex gap-5 items-start">
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-white text-slate-950 shadow-xl border border-white/10">
               <Sparkles size={16} strokeWidth={2.5} className="animate-pulse" />
            </div>
            <div className="pt-3 flex gap-1.5">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      )}

      {/* Auto scroll anchor */}
      <div ref={endRef} className="h-4" />
    </div>
  );
};

export default ChatHistory;
