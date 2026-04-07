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

const FormattedText = ({ text }) => {
  if (!text) return null;
  return (
    <div className="text-[15px] leading-[1.6] text-[var(--text-primary)] mb-4 whitespace-normal space-y-3">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        
        let contentClass = "m-0 leading-relaxed";
        if (line.trim().startsWith('*')) {
          contentClass += " ml-6 list-item";
        } else if (/^\d+\./.test(line.trim())) {
          contentClass += " mt-4 mb-2 font-medium";
        }

        const formattedLine = line.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-[var(--text-primary)] font-semibold">{part.slice(2, -2)}</strong>;
          } else if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={j} className="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded-md text-[13px] border border-[var(--border-color)] text-indigo-500 font-mono">{part.slice(1, -1)}</code>;
          }
          return part;
        });
        return <div key={i} className={contentClass} style={{ display: line.trim().startsWith('*') ? 'list-item' : 'block' }}>{formattedLine}</div>;
      })}
    </div>
  );
};

const renderMessageContent = (msg, isUser, isError) => {
  if (isUser || isError) {
    return (
      <div className={`px-5 py-3 rounded-[20px] text-[15px] leading-[1.6] whitespace-pre-wrap transition-colors break-words max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser
          ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tr-[4px]'
          : 'bg-red-500/10 border-red-500/20 text-red-500 italic'
      }`}>
        {msg.content}
      </div>
    );
  }

  // Attempt to parse AI JSON block to format nicely
  try {
    let codeToParse = msg.content;
    let prefixedText = "";
    
    if (typeof codeToParse === 'string') {
      // First try to extract by markdown json block
      const jsonMatch = codeToParse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      
      if (jsonMatch && jsonMatch[1]) {
        codeToParse = jsonMatch[1];
        prefixedText = msg.content.substring(0, jsonMatch.index).trim();
      } else {
        const sIdx = codeToParse.indexOf('{');
        const eIdx = codeToParse.lastIndexOf('}');
        if (sIdx !== -1 && eIdx !== -1 && eIdx > sIdx) {
          prefixedText = codeToParse.substring(0, sIdx).trim();
          codeToParse = codeToParse.substring(sIdx, eIdx + 1);
        }
      }
    }
    
    let parsed = null;
    try {
      parsed = JSON.parse(codeToParse);
    } catch (e1) {
      // 1. Fix unescaped backslashes (e.g. \ followed by spaces inside strings)
      let cleanEscapes = codeToParse.replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');
      // 2. Remove trailing commas
      cleanEscapes = cleanEscapes.replace(/,\s*([\]}])/g, '$1');
      parsed = JSON.parse(cleanEscapes);
    }
    if (parsed && typeof parsed === 'object' && (parsed.title || parsed.plan)) {
      return (
        <div className="flex flex-col w-full max-w-[700px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          {prefixedText && (
             <div className="mb-2 px-2">
               <FormattedText text={prefixedText} />
             </div>
          )}
          
          <div className="flex flex-col gap-4 px-6 py-5 rounded-[20px] rounded-tl-[4px] bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm">
            {/* Header */}
          {(parsed.title || parsed.description) && (
            <div className="pb-3 border-b border-[var(--border-color)] whitespace-normal">
              {parsed.title && <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">{parsed.title}</h3>}
              {parsed.description && <p className="text-[14px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">{parsed.description}</p>}
            </div>
          )}

          {/* Plan Section */}
          {parsed.plan && <PlanViewer plan={parsed.plan} />}

          {/* Improvements Section */}
          {parsed.improvements && Array.isArray(parsed.improvements) && parsed.improvements.length > 0 && (
            <div className="whitespace-normal mt-2">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-[14px] text-[var(--text-primary)]">
                <Lightbulb size={16} className="text-amber-500" />
                Future Improvements
              </h4>
              <ul className="list-disc pl-5 text-[14px] text-[var(--text-secondary)] space-y-1.5 marker:text-[var(--text-secondary)]">
                {parsed.improvements.map((imp, i) => (
                  <li key={i} className="leading-relaxed">{imp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Files Generated Area */}
          {parsed.files && Object.keys(parsed.files).length > 0 && (
            <div className="pt-4 mt-2 border-t border-[var(--border-color)] whitespace-normal">
               <h4 className="font-medium mb-3 flex items-center gap-2 text-[14px] text-[var(--text-primary)]">
                 <FileCode2 size={16} className="text-[var(--accent)]" />
                 Files Generated
               </h4>
               <div className="flex flex-wrap gap-2">
                  {Object.keys(parsed.files).map(file => (
                    <span key={file} className="px-2.5 py-1 text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md border border-[var(--border-color)]">
                      {file}
                    </span>
                  ))}
               </div>
            </div>
          )}
          </div>
        </div>
      );
    }
  } catch (e) {
    // If it STILL fails, just render the conversational text nicely instead of huge text block
    return (
       <div className="flex flex-col w-full max-w-[700px] animate-in fade-in slide-in-from-bottom-2 duration-300">
         <div className="px-6 py-5 rounded-[20px] rounded-tl-[4px] bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm">
            <FormattedText text={msg.content} />
         </div>
       </div>
    );
  }

  // Fallback if parsing fails structurally
  return (
    <div className="flex flex-col w-full max-w-[700px] animate-in fade-in slide-in-from-bottom-2 duration-300">
       <div className="px-6 py-5 rounded-[20px] rounded-tl-[4px] bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm">
          <FormattedText text={msg.content} />
       </div>
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
    <div className="w-full flex w-full flex-col gap-6 pb-20 transition-all duration-500">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isError = msg.role === 'error';
        const key = msg.id || `msg-${idx}`;

        return (
          <div
            key={key}
            className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 group ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-4 w-full ${isUser ? 'justify-end' : 'max-w-[100%] flex-row'}`}>
               {!isUser && (
                 <div className="w-[30px] h-[30px] rounded-md shrink-0 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm self-start border border-[var(--border-color)]">
                    <Sparkles size={14} strokeWidth={2.5} />        
                 </div>
               )}

               <div className={`flex flex-col gap-1.5 w-full ${isUser ? 'items-end' : 'items-start'}`}>
                  {renderMessageContent(msg, isUser, isError)}

                  {/* Action Bar (ChatGPT Style) */}
                  {!isUser && !isError && (
                    <div className="flex items-center gap-2 px-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-[var(--bg-secondary)]"><MoreHorizontal size={14} /></button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        );
      })}

      {isGenerating && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex gap-4 items-start w-full">
            <div className="w-[30px] h-[30px] rounded-md shrink-0 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm border border-[var(--border-color)]">
               <Sparkles size={14} strokeWidth={2.5} className="animate-pulse" />
            </div>
            <div className="pt-3 flex gap-1.5 px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[20px] rounded-tl-[4px] shadow-sm max-w-[100px] h-[46px] items-center justify-center">
               <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"></div>
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
