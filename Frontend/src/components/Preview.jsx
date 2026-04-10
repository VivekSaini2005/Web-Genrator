import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { RefreshCw, MonitorPlay } from 'lucide-react';
import PreviewShimmer from './PreviewShimmer';

const Preview = () => {
  const { messages, code, isPreviewLoading, isGenerating } = useChat();
  const containerRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1); 
  
  const assembleSrcDoc = () => { 
    let fallbackCode = code;
    try { 
      let codeToParse = code;
      let extracted = false;
      
      if (typeof codeToParse === 'string') {
        const jsonMatch = codeToParse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          codeToParse = jsonMatch[1];
          extracted = true;
        } else {
          const sIdx = codeToParse.indexOf('{');
          const eIdx = codeToParse.lastIndexOf('}');
          if (sIdx !== -1 && eIdx !== -1 && eIdx > sIdx) {
            codeToParse = codeToParse.substring(sIdx, eIdx + 1);
            extracted = true;
          }
        }
      }
      
      if (extracted) {
        fallbackCode = codeToParse;
      }
      
      let parsed = null;
      try {
        parsed = JSON.parse(codeToParse);
      } catch (e1) {
        let cleanEscapes = codeToParse.replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');
        cleanEscapes = cleanEscapes.replace(/,\s*([\]}])/g, '$1');
        cleanEscapes = cleanEscapes.replace(/"\s*\n\s*"/g, '",\n"');
        parsed = JSON.parse(cleanEscapes);
      }
      
      if (parsed && parsed.files) { 
        let doc = parsed.files["index.html"] || "<html><body></body></html>"; 
        const css = parsed.files["style.css"] || ""; 
        const js = parsed.files["script.js"] || ""; 
        if (css) { 
          if (doc.includes("</head>")) { 
            doc = doc.replace("</head>", `<style>${css}</style></head>`); 
          } else { 
            doc = doc.replace("</body>", `<style>${css}</style></body>`); 
          } 
        } 
        if (js) { 
          doc = doc.replace("</body>", `<script>${js}</script></body>`); 
        } 
        return doc; 
      } 
    } catch {
      // Ignore parse errors, fallback to extracted/raw code
    } 
    return fallbackCode; 
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isPreviewLoading || isGenerating) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--bg-tertiary)] overflow-hidden transition-colors duration-300 p-2 sm:p-3 md:p-4">
        <div className="flex h-full w-full max-w-[1600px] flex-col bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-[var(--shadow-sm)]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shrink-0">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <MonitorPlay size={16} className="text-[var(--accent)]" />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">Live Preview</span>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden bg-[var(--bg-primary)]">
            <PreviewShimmer />
          </div>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0 || !code) {        
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--bg-tertiary)] overflow-hidden transition-colors duration-300 p-2 sm:p-3 md:p-4">
        <div className="flex h-full w-full max-w-[1600px] flex-col bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-[var(--shadow-sm)]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shrink-0">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <MonitorPlay size={16} className="text-[var(--accent)]" />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">Live Preview</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-secondary)]">
            <p className="text-[13px] font-medium">No preview available yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--bg-tertiary)] overflow-hidden transition-colors duration-300 p-2 sm:p-3 md:p-4">
      <div className="flex h-full w-full max-w-[1600px] flex-col bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-[var(--shadow-sm)]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shrink-0">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <MonitorPlay size={16} className="text-[var(--accent)]" />
            <span className="text-[13px] font-medium text-[var(--text-primary)]">Live Preview</span>
          </div>
          
          <button 
            onClick={handleRefresh}
            className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
            title="Refresh Preview"
          >
            <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Frame Container */}
        <div className="flex-1 relative bg-white dark:bg-white overflow-hidden">
          <iframe
            key={refreshKey}
            srcDoc={assembleSrcDoc()}
            className="absolute inset-0 w-full h-full border-none"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;

