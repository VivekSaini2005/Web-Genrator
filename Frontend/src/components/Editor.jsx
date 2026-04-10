import React, { useEffect, useMemo, useState } from 'react';
import { Code2, Copy, Check, Download } from 'lucide-react';
import CodeShimmer from './CodeShimmer';
import MonacoEditor from '@monaco-editor/react';

const Editor = ({ code, setCode, loading }) => {
  const [copied, setCopied] = useState(false);
  const [activeFileTab, setActiveFileTab] = useState('index.html');
  const [editorTheme, setEditorTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'
  );

  const parsedBundle = useMemo(() => {
    let fallback = {
      raw: code || '',
      data: { files: { 'index.html': code || '' } },
      hasFiles: false,
    };

    if (typeof code !== 'string' || !code.trim()) return fallback;

    try {
      let codeToParse = code;
      let extracted = false;

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

      let parsed = null;
      try {
        parsed = JSON.parse(codeToParse);
      } catch {
        let cleanEscapes = codeToParse.replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');
        cleanEscapes = cleanEscapes.replace(/,\s*([\]}])/g, '$1');
        cleanEscapes = cleanEscapes.replace(/"\s*\n\s*"/g, '",\n"');
        parsed = JSON.parse(cleanEscapes);
      }

      if (parsed && parsed.files && typeof parsed.files === 'object') {
        return {
          raw: code,
          data: parsed,
          hasFiles: true,
        };
      }

      if (extracted) {
        fallback = {
          raw: code,
          data: { files: { 'index.html': codeToParse } },
          hasFiles: false,
        };
      }
    } catch {
      // Fallback to raw content if payload parsing fails.
    }

    return fallback;
  }, [code]);

  const fileNames = useMemo(
    () => Object.keys(parsedBundle.data.files || {}),
    [parsedBundle]
  );

  useEffect(() => {
    if (!fileNames.length) {
      setActiveFileTab('index.html');
      return;
    }

    if (!fileNames.includes(activeFileTab)) {
      setActiveFileTab(fileNames[0]);
    }
  }, [fileNames, activeFileTab]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const currentFileContent = parsedBundle.data.files?.[activeFileTab] ?? '';

  const editorLanguage = useMemo(() => {
    if (activeFileTab.endsWith('.css')) return 'css';
    if (activeFileTab.endsWith('.js')) return 'javascript';
    if (activeFileTab.endsWith('.jsx')) return 'javascript';
    if (activeFileTab.endsWith('.ts')) return 'typescript';
    if (activeFileTab.endsWith('.tsx')) return 'typescript';
    if (activeFileTab.endsWith('.json')) return 'json';
    if (activeFileTab.endsWith('.md')) return 'markdown';
    return 'html';
  }, [activeFileTab]);

  const handleCopy = () => {
    if (!currentFileContent) return;
    navigator.clipboard.writeText(currentFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentFileContent) return;
    const blob = new Blob([currentFileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFileTab || 'component.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCodeChange = (nextValue) => {
    const nextCode = nextValue || '';

    if (!parsedBundle.hasFiles) {
      setCode(nextCode);
      return;
    }

    const updated = {
      ...parsedBundle.data,
      files: {
        ...(parsedBundle.data.files || {}),
        [activeFileTab]: nextCode,
      },
    };

    setCode(JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-tertiary)] overflow-hidden transition-colors duration-300 p-2 sm:p-3 md:p-4">
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
              disabled={loading || !currentFileContent}
              className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
              aria-label="Copy code"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
            <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
            <button 
              onClick={handleDownload}
              disabled={loading || !currentFileContent}
              className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Download file"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {fileNames.length > 1 && (
          <div className="flex items-center gap-1 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 py-1.5 overflow-x-auto custom-scrollbar">
            {fileNames.map((fileName) => (
              <button
                key={fileName}
                onClick={() => setActiveFileTab(fileName)}
                className={`px-2.5 py-1 rounded-md text-[12px] font-medium whitespace-nowrap transition-colors ${
                  activeFileTab === fileName
                    ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 relative bg-[var(--bg-primary)]">
          {loading ? (
            <CodeShimmer />
          ) : (
            <div className="absolute inset-0">
              <MonacoEditor
                height="100%"
                language={editorLanguage}
                theme={editorTheme}
                value={currentFileContent}
                onChange={(value) => handleCodeChange(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 14, bottom: 14 },
                  smoothScrolling: true,
                  tabSize: 2,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;