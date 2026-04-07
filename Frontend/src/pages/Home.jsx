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
  const { currentChatId, messages, code, setCode, createNewChat, sendMessage, selectChat } = useChat();

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

  const handleCodeChange = (value) => {
    setCode(value || "");
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
    <div className="h-screen w-full flex bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans overflow-hidden transition-all duration-300">

      {/* SECTION 1: SIDEBAR (LEFT) */}
      <Sidebar />

      {/* SECTION 2: MAIN CONTENT (RIGHT) */}
      <main className="flex-1 flex flex-col relative min-w-0 transition-all duration-300">
        
        {/* Header / Workspace Navbar */}
        <Navbar 
          showOptions={hasChatSelected} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {!currentChatId ? (
            <section className="w-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white">
              <div className="w-full max-w-4xl px-6 flex flex-col justify-center py-20 text-gray-900 dark:text-white fade-in">
                 <EmptyState setPrompt={setPromptContent} />
              </div>

               {/* PromptBar - Centered at Bottom for Landing */}
               <div className="absolute bottom-10 left-0 w-full px-6 z-20 pointer-events-none transition-colors duration-300">
                  <div className="w-full max-w-3xl mx-auto pointer-events-auto hover:-translate-y-1 transition-transform duration-500">
                     <PromptBar content={promptContent} setContent={setPromptContent} onSubmit={handleInitialSubmit} />
                  </div>
               </div>
            </section>
          ) : (
            <div className="w-full h-full flex animate-in fade-in zoom-in-95 duration-500">
              {/* LEFT PANE: Chat */}
                <section className="w-[40%] flex flex-col border-r border-gray-200 dark:border-white/10 relative overflow-hidden bg-white shadow-sm text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
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
                 <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-12 bg-gradient-to-t from-white via-white/95 dark:from-slate-950 dark:via-slate-950/95 to-transparent z-20 pointer-events-none transition-colors duration-300">
                    <div className="w-full pointer-events-auto hover:-translate-y-1 transition-transform duration-500">
                       <PromptBar content={promptContent} setContent={setPromptContent} />
                    </div>
                 </div>
              </section>

              {/* RIGHT PANE: Code / Preview */}
              <section className="w-[60%] flex flex-col bg-gray-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
                 {activeTab === "code" ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                      <div className="h-full relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl overflow-hidden transition-colors duration-300">   
                        {latestAiMessageContent && code !== latestAiMessageContent && (
                          <button
                            onClick={() => setCode(latestAiMessageContent)}
                            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg shadow-sm border border-slate-200 dark:border-white/10 transition-all active:scale-95 backdrop-blur-sm group"
                            title="Reset to AI Output"
                          >
                            <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                            <span className="text-xs font-medium">Reset Code</span>
                          </button>
                        )}
                        <div className="w-full h-full pt-14 pb-2">
                          <MonacoEditor
                            height="100%"
                            language="html"
                            theme={editorTheme}
                            value={code}
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
      </main>
    </div>
  );
};

export default Home;