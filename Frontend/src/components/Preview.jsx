import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { RefreshCw, MonitorPlay } from 'lucide-react';

const Preview = () => {
  const { messages, code } = useChat();
  const containerRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);


  if (!messages || messages.length === 0 || !code) {        
    return (
      <div className="flex-1 flex flex-col w-full h-full bg-slate-100 dark:bg-[#0a0a0a]">
        {/* Header Bar */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MonitorPlay size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold tracking-tight">Live Preview</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
          <p className="text-lg font-medium">No preview yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-slate-100 dark:bg-[#0a0a0a]">
      {/* Header Bar */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <MonitorPlay size={16} className="text-indigo-500" />
          <span className="text-sm font-semibold tracking-tight">Live Preview</span>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
          title="Refresh Preview"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Frame Container */}
      <div className="flex-1 p-2 md:p-4 overflow-hidden">
        <iframe
          key={refreshKey}
          srcDoc={code}
          className="w-full h-full border-none rounded-xl bg-white shadow-xl ring-1 ring-slate-200/50 dark:ring-white/10"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default Preview;