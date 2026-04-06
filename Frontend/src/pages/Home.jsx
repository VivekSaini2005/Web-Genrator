import React, { useState, useRef, useEffect } from "react";
import PromptBar from "../components/PromptBar";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatHistory from "../components/ChatHistory";
import EmptyState from "../components/EmptyState";
import FileExplorer from "../components/FileExplorer";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import { useAuth } from "../context/AuthContext";
import * as projectApi from "../api/projectApi";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { user } = useAuth();
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_chats");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse ai_chats from localStorage", e);
      return [];
    }
  });

  // Sync chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("ai_chats", JSON.stringify(chats));
    }
  }, [chats]);

  const [activeChatId, setActiveChatId] = useState(null);

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

  // Single Source of Truth: Derive active chat and references directly from chats state
  const activeChat = chats.find(c => String(c.id) === String(activeChatId));
  const messages = activeChat ? activeChat.messages : [];
  const activeCode = activeChat ? activeChat.code : "";

  // Load chat history from backend on mount and merge with local
  useEffect(() => {
    if (user) {
      projectApi.getProjects().then(res => {
        if (res.generations) {
          const mapped = res.generations.map(g => ({ 
            id: String(g.id), 
            title: g.title || (String(g.prompt).substring(0, 30) + '...'),
            messages: [{ role: "user", content: g.prompt }, { role: "assistant", content: "Previous generation loaded." }],
            code: g.output_code
          }));
          
          setChats(prev => {
            const existingIds = new Set(prev.map(c => String(c.id)));
            const newFromBackend = mapped.filter(c => !existingIds.has(c.id));
            return [...prev, ...newFromBackend];
          });
        }
      }).catch(console.error);
    }
  }, [user]);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      code: ""
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setPrompt("");
    setShowOptions(false);
  };

  const handleSelectChat = async (id) => {
    const chatId = String(id);
    setActiveChatId(chatId);
    
    // Find chat in current state
    const chat = chats.find(c => String(c.id) === chatId);
    
    if (chat) {
      setShowOptions(chat.messages.length > 0);
      if (chat.code) setActiveTab("preview");
    }

    // If chat is a stub (no code yet), fetch full details
    if (chat && !chat.code && user) {
      try {
        setLoading(true);
        const project = await projectApi.getProjectById(chatId);
        if (project) {
          const fullCode = project.output_code || "";
          setChats(prev => prev.map(c => 
            String(c.id) === chatId 
              ? { 
                  ...c, 
                  code: fullCode, 
                  messages: [
                    { role: "user", content: project.prompt },
                    { role: "assistant", content: "Code loaded successfully." }
                  ] 
                } 
              : c
          ));
          setShowOptions(true);
          setActiveTab("preview");
        }
      } catch (err) {
        console.error('Failed to load chat details:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteChat = (e, id) => {
    e.stopPropagation();
    const chatId = String(id);
    setChats(prev => prev.filter(c => String(c.id) !== chatId));
    if (String(activeChatId) === chatId) {
      setActiveChatId(null);
      setShowOptions(false);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showOptions]);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    const currentCode = activeCode;
    const currentChatId = activeChatId; // Store current ID in scope
    
    // UI Update
    setPrompt("");
    setShowOptions(true);
    setLoading(true);

    const newUserMessage = { role: "user", content: userPrompt };

    // Update messages locally immediately
    if (currentChatId) {
      setChats(prev => prev.map(chat =>
        String(chat.id) === String(currentChatId)
          ? { ...chat, messages: [...chat.messages, newUserMessage] }
          : chat
      ));
    }

    try {
      const res = await projectApi.generateCode(userPrompt, currentCode, currentChatId || undefined);
      const generatedCode = res.code || "";
      const assistantMessage = { role: "assistant", content: "I've updated the project based on your request. Check the preview to see the changes!" };
      
      if (!currentChatId) {
        // We shouldn't really reach here if handleNewChat creates a chat first,
        // but as a fallback/safety for the first generation:
        const chatId = String(res.generationId || Date.now());
        const newChat = {
          id: chatId,
          title: userPrompt.substring(0, 30) + (userPrompt.length > 30 ? "..." : ""),
          messages: [newUserMessage, assistantMessage],
          code: generatedCode
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(chatId);
      } else {
        // Update existing chat in history
        setChats(prev => prev.map(chat =>
          String(chat.id) === String(currentChatId)
            ? { 
                ...chat, 
                messages: [...chat.messages, assistantMessage], 
                code: generatedCode,
                // Update title if it was default
                title: chat.title === "New Chat" 
                  ? userPrompt.substring(0, 30) + (userPrompt.length > 30 ? "..." : "")
                  : chat.title
              }
            : chat
        ));
      }

      setActiveTab("preview");
    } catch (err) {
      console.error(err);
      if (currentChatId) {
        setChats(prev => prev.map(chat =>
          String(chat.id) === String(currentChatId)
            ? { ...chat, messages: [...chat.messages, { role: "error", content: "Failed to generate code." }] }
            : chat
        ));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-all duration-300">
      
      {/* SECTION 1: SIDEBAR (LEFT) */}
      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* SECTION 2: MAIN CONTENT (RIGHT) */}
      <main className="flex-1 flex flex-col relative min-w-0 transition-all duration-300">
        
        {/* Header / Workspace Navbar */}
        <Navbar 
          showOptions={showOptions} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
          
          {/* Chat Section */}
          <section className={`flex-1 flex flex-col min-w-0 relative overflow-hidden transition-all duration-500 ${isFullScreen && activeTab !== 'chat' ? 'hidden' : 'flex'}`}>
            <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar pt-6 pb-48">
                <div className="w-full max-w-4xl mx-auto px-6 min-h-full flex flex-col">
                    {!showOptions ? (
                        <div className="flex-1 flex flex-col justify-center py-20 text-slate-900 dark:text-white fade-in">
                           <EmptyState setPrompt={setPrompt} />
                        </div>
                    ) : (
                        <div className="flex-1 text-slate-900 dark:text-white space-y-6">
                            {messages.length > 0 && <ChatHistory messages={messages} loading={loading} />}
                            {loading && (
                              <div className="flex flex-col gap-4 px-4 py-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-white/5 animate-in fade-in duration-700">
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
                                  <div className="space-y-3 flex-1 overflow-hidden">
                                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md animate-shimmer" />
                                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md animate-shimmer" />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />        
                        </div>
                    )}
                </div>
             </div>

             {/* Centered PromptBar - Fixed at Bottom */}
             <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 pt-16 bg-gradient-to-t from-white via-white/95 dark:from-slate-950 dark:via-slate-950/95 to-transparent z-20 pointer-events-none transition-colors duration-300">
                <div className="max-w-3xl mx-auto w-full pointer-events-auto hover:-translate-y-1 transition-transform duration-500">
                   <PromptBar
                     prompt={prompt}
                     setPrompt={setPrompt}
                     loading={loading}
                     generateCode={handleGenerateCode}
                   />
                </div>
             </div>
          </section>

          {/* Editor/Preview Section */}
          {showOptions && (
            <section className={`${isFullScreen ? 'fixed inset-0 z-50 p-6 bg-slate-950' : 'w-[45%] border-l border-white/5 bg-slate-900/40 backdrop-blur-md'} flex flex-col min-w-0 transition-shadow duration-300`}>
                <div className="flex-1 overflow-hidden flex flex-col h-full border-none shadow-none bg-transparent">
                   <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activeTab === 'code' ? 'Source' : 'Live Preview'}</span>
                      </div>
                      <button 
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
                      >
                         {isFullScreen ? (
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         ) : (
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                         )}
                      </button>
                   </div>
                   
                   <div className="flex-1 min-h-0 bg-slate-950/50 flex transition-all duration-300">
                      {activeTab === "code" ? (
                        <>
                          <div className="h-full shrink-0 hidden lg:block border-r border-white/5">
                            <FileExplorer 
                              setCode={(newCode) => setChats(prev => prev.map(c => 
                                String(c.id) === String(activeChatId) ? { ...c, code: newCode } : c
                              ))} 
                              currentFile="App.jsx" 
                            />
                          </div>
                          <div className="flex-1 h-full min-w-0">
                            <Editor 
                              code={activeCode} 
                              setCode={(newCode) => setChats(prev => prev.map(c => 
                                String(c.id) === String(activeChatId) ? { ...c, code: newCode } : c
                              ))} 
                              loading={loading} 
                            />
                          </div>
                        </>
                      ) : (
                        <Preview code={activeCode} loading={loading} />
                      )}
                   </div>
                </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;