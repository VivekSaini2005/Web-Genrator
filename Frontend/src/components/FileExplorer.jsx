import React, { useState } from 'react';
import {
  FileCode,
  FileJson,
  FileType,
  FileText,
  FileCode2,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Files,
  Search,
  Plus,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';

const FileIcon = ({ name, className }) => {
  const ext = name.split('.').pop();
  switch (ext) {
    case 'js':
    case 'jsx':
      return <FileCode size={16} className={`text-yellow-400/80 ${className}`} />; 
    case 'json':
      return <FileJson size={16} className={`text-blue-400/80 ${className}`} />;   
    case 'css':
      return <FileType size={16} className={`text-blue-300/80 ${className}`} />;   
    case 'html':
      return <FileCode2 size={16} className={`text-orange-400/80 ${className}`} />;
    default:
      return <FileText size={16} className={`text-slate-400/80 ${className}`} />;  
  }
};

const FileItem = ({ name, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all group relative active:scale-95 ${
      active
        ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
    }`}
  >
    <FileIcon name={name} className="shrink-0 transition-transform group-hover:scale-110" />
    <span className="truncate font-medium flex-1 text-left transition-colors">{name}</span>
    
    <div className="hidden group-hover:flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
      <button className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
        <Edit2 size={12} />
      </button>
      <button className="p-1 hover:bg-red-500/10 rounded-md text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
        <Trash2 size={12} />
      </button>
    </div>

    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900 dark:bg-white rounded-full shadow-[0_0_8px_rgba(15,23,42,0.3)] dark:shadow-[0_0_8px_white]" />
    )}
  </button>
);

const FolderItem = ({ name, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-all group active:scale-98"
      >
        <div className="shrink-0 transition-transform duration-300 transform-gpu" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <ChevronRight size={14} className="opacity-60" />
        </div>
        <div className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors">
          {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
        </div>
        <span className="truncate font-semibold text-[11px] uppercase tracking-wider opacity-70 group-hover:opacity-100">
          {name}
        </span>
      </button>

      {isOpen && (
        <div className="ml-3 pl-2 border-l border-slate-100 dark:border-white/5 space-y-0.5 mt-0.5 animate-in slide-in-from-top-1 fade-in duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

const FileExplorer = ({ setCode, currentFile = "main.jsx" }) => {
  const structuralFiles = {
    'src': ['main.jsx', 'App.jsx', 'index.css'],
    'public': ['index.html', 'favicon.svg'],
    'config': ['package.json', 'vite.config.js']
  };

  return (
    <div className="w-64 h-full bg-slate-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all">
      {/* Search Header */}
      <div className="p-4 border-b border-white/5 bg-white/2 shrink-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Files size={14} className="text-white/60" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><Plus size={14} /></button>        
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><Search size={14} /></button>
          </div>
        </div>
        
        <div className="relative group">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white/40 transition-colors" />
          <input
            type="text"
            placeholder="Find files..."
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all font-medium"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2 scroll-smooth no-scrollbar">
        <div className="space-y-1">
          {Object.entries(structuralFiles).map(([folder, files]) => (
            <FolderItem
              key={folder}
              name={folder}
              defaultOpen={folder === 'src'}
            >
              {files.map(file => (
                <FileItem
                  key={file}
                  name={file}
                  active={currentFile === file}
                  onClick={() => setCode(`// Content for ${file}`)}
                />
              ))}
            </FolderItem>
          ))}
        </div>
      </div>

      {/* Footer Status */}
      <div className="p-3 border-t border-white/5 bg-white/1 shrink-0">
         <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 letter-spacing-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />        
               Vite App
            </div>
            <div className="flex items-center gap-3 text-[9px] font-bold text-slate-700">
               <span>Main branch</span>
               <span className="text-slate-500">100%</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FileExplorer;