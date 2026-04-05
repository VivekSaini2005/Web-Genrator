import React, { useState, useRef, useEffect } from "react";
import PromptBar from "../components/PromptBar";
import Sidebar from "../components/Sidebar";
import ChatHistory from "../components/ChatHistory";
import EmptyState from "../components/EmptyState";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
// Removed deprecated services/api import
import { useAuth } from "../context/AuthContext";
import * as projectApi from "../api/projectApi";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [messages, setMessages] = useState([]);
  const [mobileView, setMobileView] = useState("chat"); // 'chat' or 'editor'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    if (user) {
      projectApi.getProjects().then(res => {
        if (res.generations) {
          const mapped = res.generations.map(g => ({ id: g.id, title: String(g.prompt).substring(0, 40) + '...' }));
          setChats(mapped);
        }
      }).catch(console.error);
    } else {
      setChats([]);
    }
  }, [user]);

  const handleSelectChat = async (id) => {
    try {
      setLoading(true);
      setActiveChatId(id);
      const project = await projectApi.getProjectById(id);
      if (project) {
        setCode(project.output_code || "");
        setPrompt("");
        
        // Reconstruct the chat history order: Prompt -> Response
        setMessages([
          { role: "user", content: project.prompt },
          { role: "assistant", content: "I've loaded the project from your history. The code has been placed in the editor correctly!" }
        ]);

        setShowOptions(true);
        setActiveTab("preview");
        setMobileView("editor");
      }
    } catch (err) {
      console.error('Failed to load chat/project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      await projectApi.createProject(); // Optional trigger if logic expands
      setShowOptions(false);
      setMessages([]);
      setCode("");
      setPrompt("");
      setActiveChatId(null);
    } catch (err) {
      console.error(err);
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
    const currentCode = code;
    
    setPrompt("");
    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setShowOptions(true);
    setLoading(true);
    setCode("");

    try {
      const res = await projectApi.generateCode(userPrompt, currentCode, activeChatId);
      
      // Update code view safely
      setCode(res.code || "");
      
      // Refresh sidebar seamlessly to grab the newly saved generation
      if (user) {
        projectApi.getProjects().then(resData => {
           if (resData.generations) {
             setChats(resData.generations.map(g => ({ id: g.id, title: String(g.prompt).substring(0, 40) + '...' })));
             if (res.generationId) setActiveChatId(res.generationId);
           }
        }).catch(console.error);
      }

      setActiveTab("preview");
      setMobileView("editor"); 
      setMessages(prev => [...prev, { role: "assistant", content: "I've updated the project based on your request. Check the preview to see the changes!" }]);
    } catch (err) {
      console.error(err);
      setCode(currentCode); // Restore previous code
      setMessages(prev => [...prev, { role: "error", content: "Failed to generate code. Please check your network and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex bg-gradient-to-br from-slate-900 via-gray-900 to-black text-slate-100 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR (~260px) - Claude Style */}
      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex relative overflow-hidden bg-transparent">
          
          {/* CHAT AREA (flex-1, centered content) */}
          <section className={`flex-1 flex flex-col relative transition-all duration-300 w-full ${showOptions && mobileView === 'editor' ? 'hidden md:flex' : 'flex'}`}>
             
             {/* Header */}
             <header className="h-14 flex justify-between items-center px-6 sticky top-0 z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 md:border-none">
                 <div className="font-semibold text-sm text-gray-400 flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-500 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <span className="md:hidden">AI Web Generator</span>
                 </div>
                 {showOptions && (
                    <button 
                      onClick={() => setMobileView("editor")}
                      className="md:hidden px-4 py-2 bg-[#2d2d30] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3d3d40] transition-colors"
                    >
                      View Code
                    </button>
                 )}
             </header>

             {/* Messages Area with breathing space */}
             <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar pb-40">
                <div className="max-w-3xl mx-auto px-6 md:px-8 w-full h-full">
                    {!showOptions ? (
                        <div className="h-full flex flex-col justify-center pb-24">
                           <EmptyState setPrompt={setPrompt} />
                        </div>
                    ) : (
                        <div className="py-8 space-y-6">
                            <ChatHistory messages={messages} />
                            <div ref={messagesEndRef} className="h-12" />
                        </div>
                    )}
                </div>
             </div>

             {/* Fixed Bottom Input Bar */}
             <div className="absolute bottom-0 left-0 right-0 pt-20 pb-8 px-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-3xl border border-white/10">
                        <PromptBar
                          prompt={prompt}
                          setPrompt={setPrompt}
                          loading={loading}
                          generateCode={handleGenerateCode}
                        />
                    </div>
                </div>
             </div>
          </section>

          {/* RIGHT ARTIFACT PANE (Editor/Preview) */}
          {showOptions && (
              <section className={`w-full md:w-[45%] lg:w-[50%] max-w-[950px] border-l border-white/10 bg-slate-950 flex flex-col shadow-2xl z-30 transition-all duration-300 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
                 {/* Tabs Header inside Artifact */}
                 <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 lg:px-6 bg-slate-950 flex-shrink-0">
                    <div className="md:hidden flex items-center">
                        <button 
                          onClick={() => setMobileView("chat")}
                          className="p-1 px-2 text-slate-400 hover:text-slate-100 flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                    </div>

                    <div className="flex bg-slate-900 p-1 rounded-xl gap-1 border border-white/5 shadow-inner">
                        <button
                          onClick={() => setActiveTab("code")}
                          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform ${
                            activeTab === "code" 
                            ? "bg-slate-800 text-white shadow-lg scale-[1.02]" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:scale-[1.01]"
                          }`}
                        >
                          Code
                        </button>
                        <button
                          onClick={() => setActiveTab("preview")}
                          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform ${
                            activeTab === "preview" 
                            ? "bg-slate-800 text-white shadow-lg scale-[1.02]" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:scale-[1.01]"
                          }`}
                        >
                          Preview
                        </button>
                    </div>

                    <div className="hidden sm:flex gap-1.5 items-center">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                 </header>

                 {/* Content Space */}
                 <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
                    {loading && (
                        <div className="absolute inset-0 z-10 p-6 flex flex-col gap-4 bg-[#1e1e1e]">
                            <div className="w-3/4 h-8 bg-white/5 rounded-md animate-pulse"></div>
                            <div className="w-1/2 h-6 bg-white/5 rounded-md animate-pulse delay-100"></div>
                            <div className="w-full h-32 bg-white/5 rounded-md animate-pulse delay-200"></div>
                        </div>
                    )}
                    <div className={`absolute inset-0 transition-opacity duration-300 h-full w-full ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        {activeTab === "code" ? (
                          <Editor code={code} setCode={setCode} loading={loading} />
                        ) : (
                          <Preview code={code} loading={loading} />
                        )}
                    </div>
                 </div>
              </section>
          )}
      </main>
    </div>
  );
};

export default Home;