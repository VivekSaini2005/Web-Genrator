import React, { useState, useEffect } from "react";
import PromptBar from "../components/PromptBar";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatHistory from "../components/ChatHistory";
import EmptyState from "../components/EmptyState";
import Preview from "../components/Preview";
import { useChat } from "../context/ChatContext";
import { RotateCcw } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";

const Home = () => {
  const { currentChatId, messages, code, setCode, createNewChat, sendMessage, selectChat, isGenerating } = useChat();

  const handleEnhanceUI = async () => {
    if (!currentChatId || isGenerating) return;
    const prompt = "Improve the UI of this project to make it modern, premium, and visually stunning. Do not break functionality. Please improve colors, spacing, add animations, and upgrade the layout.";
    await sendMessage(prompt, currentChatId);
  };

  const [activeTab, setActiveTab] = useState("preview");
  const [promptContent, setPromptContent] = useState("");
  const [editorTheme, setEditorTheme] = useState(() => 
    document.documentElement.classList.contains("dark") ? "vs-dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setEditorTheme(document.documentElement.classList.contains("dark") ? "vs-dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const hasChatSelected = Boolean(currentChatId);

  const latestAiMessage = messages?.filter((m) => m.role === "ai").slice(-1)[0];
  const latestAiMessageContent = latestAiMessage?.content;
  const latestAiMessageId = latestAiMessage?.id;

  useEffect(() => {
    if (latestAiMessageContent) {
      setCode(latestAiMessageContent);
    }
  }, [latestAiMessageId, latestAiMessageContent, setCode]);

  /* eslint-disable react-hooks/set-state-in-effect */
  // Subscribe to navigation events from sidebar "New Chat" click to reset prompt
  useEffect(() => {
    if (messages.length === 0 && Boolean(currentChatId)) {
      setPromptContent("");
    }
  }, [currentChatId, messages.length]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleInitialSubmit = async (promptText) => {
    // 1. call createNewChat()
    const result = await createNewChat(promptText.substring(0, 30));
    if (!result || !result.chat) return;

    // ensure chat is selected before sending message
    await selectChat(result.chat.id);

    setPromptContent("");
    
    // 2. sendMessage(prompt)
    await sendMessage(promptText, result.chat.id);
  };

  const [activeFileTab, setActiveFileTab] = useState("index.html");

  let parsedCode = { files: { "index.html": code } };
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
    
    // Update fallback if we successfully isolated a potential JSON block
    if (extracted) {
      parsedCode = { files: { "index.html": codeToParse } };
    }
    
    let parsed = null;
    try {
      parsed = JSON.parse(codeToParse);
    } catch (e1) {
      let cleanEscapes = codeToParse.replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');
      cleanEscapes = cleanEscapes.replace(/,\s*([\]}])/g, '$1');
      parsed = JSON.parse(cleanEscapes);
    }

    if (parsed && parsed.files) {
      parsedCode = parsed;
    }
  } catch (e) {
    // legacy HTML code block
  }

  const fileNames = Object.keys(parsedCode.files || {});
  const currentFileContent = parsedCode.files[activeFileTab] ?? "";

  const handleCodeChange = (value) => {
    const updated = { ...parsedCode };
    if (!updated.files) updated.files = {};
    updated.files[activeFileTab] = value || "";
    setCode(JSON.stringify(updated));
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem("theme", "dark");
    }
  }, []);

  return (
    <div className="h-screen w-full flex bg-[var(--bg-primary)] font-sans overflow-hidden transition-colors duration-300">

      {/* SECTION 1: SIDEBAR (LEFT) */}
      <Sidebar />

      {/* SECTION 2: MAIN CONTENT (RIGHT) */}
      <main className="flex-1 flex flex-col relative min-w-0 transition-colors duration-300">
        
        {/* Header / Workspace Navbar */}
        <Navbar 
          showOptions={hasChatSelected} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onEnhanceUI={handleEnhanceUI}
        />
        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative flex justify-center">
          <div className="w-full max-w-[1400px] h-full flex flex-col">
            {!currentChatId ? (
              <section className="flex-1 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
                <div className="w-full max-w-3xl px-6 flex flex-col justify-center py-20 fade-in">
                   <EmptyState setPrompt={setPromptContent} />
                </div>

                 {/* PromptBar - Centered at Bottom for Landing */}
                 <div className="absolute bottom-8 left-0 w-full px-6 z-20 pointer-events-none transition-colors duration-300">
                    <div className="w-full max-w-2xl mx-auto pointer-events-auto hover:-translate-y-1 transition-transform duration-500 shadow-lg rounded-xl">
                       <PromptBar content={promptContent} setContent={setPromptContent} onSubmit={handleInitialSubmit} />
                    </div>
                 </div>
              </section>
            ) : (
              <div className="flex-1 flex animate-in fade-in zoom-in-95 duration-500 border-x border-[var(--border-color)] bg-[var(--bg-primary)] shadow-sm my-4 rounded-xl overflow-hidden min-h-0 mx-4">
                {/* LEFT PANE: Chat */}
                  <section className="w-[40%] flex flex-col border-r border-[var(--border-color)] relative overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-300">
                  <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar pt-6 pb-32">
                    <div className="w-full px-6 min-h-full flex flex-col">
                        <div className="flex-1 text-slate-900 dark:text-white space-y-6">
                            {messages.length > 0 ? (
                                <ChatHistory />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-slate-400 mt-20 opacity-60">
                                   <p className="text-lg font-medium tracking-tight">Start a new conversation</p>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>

                 {/* PromptBar - Fixed at Bottom of Left Pane */}
                 <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-12 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/95 to-transparent z-20 pointer-events-none transition-colors duration-300">
                    <div className="w-full pointer-events-auto hover:-translate-y-1 transition-transform duration-500 shadow-[var(--shadow-md)] rounded-xl">
                       <PromptBar content={promptContent} setContent={setPromptContent} />
                    </div>
                 </div>
              </section>

              {/* RIGHT PANE: Code / Preview */}
              <section className="w-[60%] flex flex-col bg-[var(--bg-tertiary)] overflow-hidden transition-colors duration-300 relative">
                 {activeTab === "code" ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                      <div className="h-full relative bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] rounded-xl overflow-hidden transition-colors duration-300 flex flex-col"><div className="flex items-center gap-1 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 shrink-0">{fileNames.map(fileName => (<button key={fileName} onClick={() => setActiveFileTab(fileName)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${activeFileTab === fileName ? "bg-[var(--bg-primary)] text-[var(--accent)] shadow-sm" : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"}`}>{fileName}</button>))}</div>{latestAiMessageContent && code !== latestAiMessageContent && (<button onClick={() => setCode(latestAiMessageContent)} className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg shadow-sm border border-[var(--border-color)] transition-all active:scale-95 backdrop-blur-sm group" title="Reset to AI Output"><RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" /><span className="text-xs font-medium">Reset Code</span></button>)}<div className="flex-1 w-full pb-2 relative"><MonacoEditor height="100%" language={activeFileTab.endsWith(".css") ? "css" : activeFileTab.endsWith(".js") ? "javascript" : "html"} theme={editorTheme} value={currentFileContent}
                            onChange={handleCodeChange}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              wordWrap: "on",
                              scrollBeyondLastLine: false,
                              readOnly: false,
                              padding: { top: 16, bottom: 16 },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                 ) : (
                    <Preview />
                 )}
              </section>
            </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;

