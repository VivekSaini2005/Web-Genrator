import React, { useState } from 'react';
import { Code2, Copy, Check, Download } from 'lucide-react';

const Editor = ({ code, setCode, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'component.jsx'; // Default name, can be made dynamic
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-tertiary)] overflow-hidden transition-colors duration-300 p-4">
      <div className="flex-1 flex flex-col bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-[var(--shadow-sm)]">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] shrink-0">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-[var(--accent)]" />
            <span className="text-[13px] font-medium text-[var(--text-primary)]">Source Code</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handleCopy}
              disabled={loading || !code}
              className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
              aria-label="Copy code"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
            <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
            <button 
              onClick={handleDownload}
              disabled={loading || !code}
              className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Download file"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative bg-[var(--bg-primary)]">
          <textarea
            value={loading ? "" : (code || "")}
            onChange={(e) => setCode(e.target.value)}
            className="absolute inset-0 w-full h-full p-5 bg-transparent text-[var(--text-primary)] font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-0 custom-scrollbar border-none placeholder:text-[var(--text-secondary)]/50"
            placeholder={loading ? "" : "// Generated component code will appear here..."}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;