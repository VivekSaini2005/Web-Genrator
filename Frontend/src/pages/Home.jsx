import React, { useState, useEffect } from "react";
import PromptBar from "../components/PromptBar";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatHistory from "../components/ChatHistory";
import EmptyState from "../components/EmptyState";
import Preview from "../components/Preview";
import { useChat } from "../context/ChatContext";

const Home = () => {
  const { currentChatId, messages, createNewChat, sendMessage, selectChat } = useChat();

  const [activeTab, setActiveTab] = useState("preview");
  const [promptContent, setPromptContent] = useState("");

  const hasChatSelected = Boolean(currentChatId);

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
    <div className="h-screen w-full flex bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-all duration-300">
      
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
            <section className="w-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 bg-slate-50 dark:bg-slate-900/50">
              <div className="w-full max-w-4xl px-6 flex flex-col justify-center py-20 text-slate-900 dark:text-white fade-in">
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
              <section className="w-[40%] flex flex-col border-r border-slate-200 dark:border-white/10 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
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
                 <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-12 bg-gradient-to-t from-slate-50 via-slate-50/95 dark:from-slate-900/50 dark:via-slate-900/95 to-transparent z-20 pointer-events-none transition-colors duration-300">
                    <div className="w-full pointer-events-auto hover:-translate-y-1 transition-transform duration-500">
                       <PromptBar content={promptContent} setContent={setPromptContent} />
                    </div>
                 </div>
              </section>

              {/* RIGHT PANE: Code / Preview */}
              <section className="w-[60%] flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
                 {activeTab === "code" ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                      <div className="h-full bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                        <textarea
                          readOnly
                          value={messages.filter(msg => msg.role !== 'user').pop()?.content || ""}
                          className="w-full h-full p-6 bg-transparent text-slate-800 dark:text-slate-300 font-mono text-sm resize-none outline-none focus:ring-0 leading-relaxed custom-scrollbar"
                          placeholder="// Generated code will appear here..."
                          spellCheck="false"
                        />
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