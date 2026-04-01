import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import PromptBar from "../components/PromptBar";
import ChatHistory from "../components/ChatHistory";
import EmptyState from "../components/EmptyState";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import { generateCode as apiGenerateCode } from "../services/api";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [messages, setMessages] = useState([]);
  const [mobileView, setMobileView] = useState("chat"); // 'chat' or 'editor'
  const [isFullScreen, setIsFullScreen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showOptions]);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    const currentCode = code; // Capture current code before resetting
    
    setPrompt("");
    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setShowOptions(true);
    setLoading(true);
    setCode("");

    try {
      // console.log("Sending prompt to backend:", userPrompt);
      const res = await apiGenerateCode(userPrompt, currentCode);
      setCode(res.data.message);
      setActiveTab("preview");
      setMobileView("editor"); // Auto switch to editor on mobile to show the new code
      setMessages(prev => [...prev, { role: "assistant", content: "I've updated the code based on your request. Check the preview to see the changes!" }]);
    } catch (err) {
      console.error(err);
      setCode("Error generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0b0f19] text-white font-sans overflow-hidden bg-gradient-to-br from-gray-900 via-[#0f172a] to-black">
      <Navbar />

      {showOptions ? (
        <div className="flex-1 flex w-full max-w-[1800px] mx-auto gap-0 md:gap-6 p-0 md:p-6 overflow-hidden h-[calc(100vh-64px)]">
          {/* LEFT SIDEBAR: Chats and Prompt */}
          <div className={`${mobileView === 'chat' ? 'flex' : 'hidden'} ${isFullScreen ? 'md:hidden' : 'md:flex'} w-full h-full md:h-auto md:w-[400px] lg:w-[450px] flex-shrink-0 flex-col bg-[#111827] md:bg-[#111827]/60 border-0 md:border border-gray-700/50 md:rounded-2xl shadow-none md:shadow-2xl backdrop-blur-md overflow-hidden z-10 transition-all duration-300`}>
            <div className="border-b border-gray-700/50 bg-gray-800/40 p-3 md:p-4 flex justify-between items-center">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                AI Assistant
              </h2>
              <button 
                onClick={() => setMobileView("editor")}
                className="md:hidden px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                Preview
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 relative">
              <ChatHistory messages={messages} />
              <div ref={messagesEndRef} className="h-4" />
            </div>

            <div className="mt-auto border-t border-gray-700/50 bg-[#111827]/90 relative">
              <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-[#111827]/90 to-transparent pointer-events-none"></div>
              <PromptBar
                prompt={prompt}
                setPrompt={setPrompt}
                loading={loading}
                generateCode={handleGenerateCode}
              />
            </div>
          </div>

          {/* RIGHT MAIN AREA: Editor/Preview */}
          <div className={`${mobileView === 'editor' ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-[#1e1e1e] md:border border-gray-700/60 md:rounded-2xl overflow-hidden min-h-0 relative transition-all duration-300 w-full`}>
            {/* TABS + MAC WINDOW BUTTONS */}
            <div className="flex items-center justify-between bg-[#2d2d2d] border-b border-gray-700/80 px-2 md:px-4 flex-shrink-0 min-h-[50px] overflow-x-auto custom-scrollbar">
              <div className="hidden sm:flex gap-2 w-24 shrink-0 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-sm"></div>
                <div 
                  role="button" 
                  title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  onClick={() => setIsFullScreen(!isFullScreen)} 
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors shadow-sm cursor-pointer hover:scale-110 flex items-center justify-center group"
                >
                  <svg className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 00-.5.5v4a.5.5 0 01-1 0v-4A1.5 1.5 0 011.5 0h4a.5.5 0 010 1h-4zM10 .5a.5.5 0 01.5-.5h4A1.5 1.5 0 0116 1.5v4a.5.5 0 01-1 0v-4a.5.5 0 00-.5-.5h-4a.5.5 0 01-.5-.5zM.5 10a.5.5 0 01.5.5v4a.5.5 0 00.5.5h4a.5.5 0 010 1h-4A1.5 1.5 0 010 14.5v-4a.5.5 0 01.5-.5zm15 0a.5.5 0 01.5.5v4a1.5 1.5 0 01-1.5 1.5h-4a.5.5 0 010-1h4a.5.5 0 00.5-.5v-4a.5.5 0 01.5-.5z"/></svg>
                </div>
              </div>

              <div className="md:hidden shrink-0 mr-2 flex items-center">
                <button 
                  onClick={() => setMobileView("chat")}
                  className="px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Chat
                </button>
              </div>

              <div className="flex flex-1 justify-center gap-2">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 relative ${
                    activeTab === "preview"
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <svg className="w-4 h-4"  fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  Preview
                  {activeTab === "preview" && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-400 rounded-t-md shadow-[0_-2px_8px_rgba(96,165,250,0.5)]"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 relative ${
                    activeTab === "code"
                      ? "text-emerald-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  Code
                  {activeTab === "code" && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-400 rounded-t-md shadow-[0_-2px_8px_rgba(52,211,153,0.5)]"></span>
                  )}
                </button>
              </div>

              <div className="w-24 flex justify-end shrink-0">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="hidden md:flex px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-colors items-center text-xs font-medium gap-1.5"
                  title={isFullScreen ? "Show Assistant Sidebar" : "Expand to Full Page"}
                >
                  {isFullScreen ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                      Sidebar
                    </>
                  ) : (
                    <>
                      Expand
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    </>
                  )}
                </button>
              </div> {/* Spacer for centering with controls */}
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
              {loading && (
                <div className="absolute inset-0 z-10 p-6 bg-[#1e1e1e] flex flex-col gap-4 overflow-hidden">
                  {/* Shimmer Effect Skeleton Loader */}
                  <div className="w-3/4 h-8 bg-gray-700/30 rounded-md animate-pulse relative overflow-hidden shimmer"></div>
                  <div className="w-1/2 h-6 bg-gray-700/30 rounded-md animate-pulse relative overflow-hidden shimmer" style={{ animationDelay: "0.1s"}}></div>
                  <div className="w-full h-32 bg-gray-700/30 rounded-md animate-pulse relative overflow-hidden shimmer" style={{ animationDelay: "0.2s"}}></div>
                  <div className="w-5/6 h-6 bg-gray-700/30 rounded-md animate-pulse relative overflow-hidden shimmer" style={{ animationDelay: "0.3s"}}></div>
                  <div className="w-2/3 h-6 bg-gray-700/30 rounded-md animate-pulse relative overflow-hidden shimmer" style={{ animationDelay: "0.4s"}}></div>
                  
                  {/* Inject custom shimmer animation styles directly */}
                  <style>{`
                    .shimmer::after {
                      content: '';
                      position: absolute;
                      top: 0;
                      right: 0;
                      bottom: 0;
                      left: 0;
                      transform: translateX(-100%);
                      background-image: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0,
                        rgba(255, 255, 255, 0.05) 20%,
                        rgba(255, 255, 255, 0.1) 60%,
                        rgba(255, 255, 255, 0)
                      );
                      animation: shimmer 2s infinite;
                    }
                    @keyframes shimmer {
                      100% {
                        transform: translateX(100%);
                      }
                    }
                  `}</style>
                </div>
              )}

              <div className={`absolute inset-0 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                {activeTab === "code" ? (
                  <Editor code={code} setCode={setCode} loading={loading} />
                ) : (
                  <Preview code={code} loading={loading} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative h-[calc(100vh-64px)] overflow-hidden">
          <div className="flex-1 overflow-y-auto w-full">
            <EmptyState setPrompt={setPrompt} />
          </div>
          <div className="absolute bottom-0 left-0 w-full pb-4 md:pb-6 z-20 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pt-10 px-2 md:px-0">
            <div className="max-w-4xl mx-auto">
              <PromptBar
                prompt={prompt}
                setPrompt={setPrompt}
                loading={loading}
                generateCode={handleGenerateCode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;