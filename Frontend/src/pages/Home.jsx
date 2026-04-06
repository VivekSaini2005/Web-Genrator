import React, { useState, useEffect } from "react";
import PromptBar from "../components/PromptBar";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatHistory from "../components/ChatHistory";
import EmptyState from "../components/EmptyState";
import Preview from "../components/Preview";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const Home = () => {
  const { user } = useAuth();
  const { currentChatId, loadChats, messages } = useChat();

  const [activeTab, setActiveTab] = useState("chat");
  const [promptContent, setPromptContent] = useState("");

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

  const hasChatSelected = Boolean(currentChatId);

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
          
          {/* LEFT PANE: Chat */}
          <section className="w-1/2 flex flex-col border-r border-slate-200 dark:border-white/10 relative overflow-hidden transition-all duration-500 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar pt-6 pb-32">
                <div className="w-full px-6 min-h-full flex flex-col">
                    {!hasChatSelected ? (
                        <div className="flex-1 flex flex-col justify-center py-20 text-slate-900 dark:text-white fade-in">
                           <EmptyState setPrompt={setPromptContent} />
                        </div>
                    ) : (
                        <div className="flex-1 text-slate-900 dark:text-white space-y-6">
                            {messages.length > 0 ? (
                               <ChatHistory />
                            ) : (
                               <EmptyState setPrompt={setPromptContent} />
                            )}
                        </div>
                    )}
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
          <section className="w-1/2 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
             {hasChatSelected ? (
                 activeTab === "code" ? (
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
                 )
             ) : (
                 <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <p>Select a chat or start generating to see preview</p>
                 </div>
             )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default Home;