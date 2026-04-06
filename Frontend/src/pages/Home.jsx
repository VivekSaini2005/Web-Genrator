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
    <div className="h-screen w-full flex flex-col md:flex-row bg-bg text-text-primary font-sans overflow-hidden p-4 md:p-6 gap-4 md:gap-6">
      
      {/* SECTION 1: SIDEBAR (LEFT) - Hidden on mobile, visible from md up */}
      <div className="hidden md:flex flex-col w-64 flex-none h-full overflow-hidden">
        <Sidebar 
          chats={chats} 
          activeChatId={activeChatId} 
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* SECTION 2: CHAT + PROMPT (CENTER) - Always visible */}
      <section className="flex-1 flex flex-col min-w-0 bg-surface/30 rounded-[2.5rem] border border-border/40 relative shadow-2xl shadow-black/20 overflow-hidden h-full">
         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar pb-32">
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 h-full flex flex-col">
                {!showOptions ? (
                    <div className="flex-1 flex flex-col justify-center py-12">
                       <EmptyState setPrompt={setPrompt} />
                    </div>
                ) : (
                    <div className="py-8 space-y-6 flex-1">
                        <ChatHistory messages={messages} />
                        <div ref={messagesEndRef} className="h-8" />
                    </div>
                )}
            </div>
         </div>

         {/* Centered PromptBar */}
         <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-bg via-bg/95 to-transparent z-20">
            <div className="max-w-3xl mx-auto w-full">
               <PromptBar
                 prompt={prompt}
                 setPrompt={setPrompt}
                 loading={loading}
                 generateCode={handleGenerateCode}
               />
            </div>
         </div>
      </section>

      {/* SECTION 3: ARTIFACT PANE (RIGHT) - Hidden on mobile/tablet, visible from lg up */}
      {showOptions && activeTab === 'preview' && (
          <div className="hidden lg:flex flex-none w-[40%] h-full overflow-hidden">
             <Preview code={code} loading={loading} />
          </div>
      )}
      {showOptions && activeTab === 'code' && (
          <div className="hidden lg:flex flex-none w-[40%] h-full overflow-hidden">
             <Editor code={code} setCode={setCode} loading={loading} />
          </div>
      )}
    </div>
  );
};

export default Home;