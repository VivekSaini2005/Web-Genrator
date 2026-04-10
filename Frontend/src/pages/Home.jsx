import React, { useState, useEffect } from "react";
import PromptBar from "../components/PromptBar";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatHistory from "../components/ChatHistory";
import EmptyState from "../components/EmptyState";
import Preview from "../components/Preview";
import Editor from "../components/Editor";
import { useChat } from "../context/ChatContext";

const Home = () => {
  const { currentChatId, messages, code, setCode, createNewChat, sendMessage, selectChat, isGenerating, isPreviewLoading } = useChat();

  const handleEnhanceUI = async () => {
    if (!currentChatId || isGenerating) return;
    const prompt = "Improve the UI of this project to make it modern, premium, and visually stunning. Do not break functionality. Please improve colors, spacing, add animations, and upgrade the layout.";
    await sendMessage(prompt, currentChatId);
  };

  const [activeView, setActiveView] = useState("code");
  const [promptContent, setPromptContent] = useState("");
  const [renderedView, setRenderedView] = useState("code");
  const [viewVisible, setViewVisible] = useState(true);

  const hasChatSelected = Boolean(currentChatId);

  const latestAiMessage = messages?.filter((m) => m.role === "ai").slice(-1)[0];
  const latestAiMessageContent = latestAiMessage?.content;
  const latestAiMessageId = latestAiMessage?.id;

  useEffect(() => {
    if (latestAiMessageContent) {
      setCode(latestAiMessageContent);
    }
  }, [latestAiMessageId, latestAiMessageContent, setCode]);

  useEffect(() => {
    if (activeView === renderedView) return;

    setViewVisible(false);
    const swapTimer = setTimeout(() => {
      setRenderedView(activeView);
      requestAnimationFrame(() => {
        setViewVisible(true);
      });
    }, 80);

    return () => clearTimeout(swapTimer);
  }, [activeView, renderedView]);

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
    // console.log("Creating new chat with prompt:", promptText);
    const result = await createNewChat(promptText.substring(0, 30));
    if (!result || !result.chat) return;
    // console.log("New chat created:");
    // ensure chat is selected before sending message
    // console.log("Selecting new chat with ID:", result.chat.id);
    await selectChat(result.chat.id);
    // console.log("New chat selected with ID:", result.chat.id);
    setPromptContent("");
    
    // 2. sendMessage(prompt)
    // console.log("Sending initial message to new chat with ID:", result.chat.id);
    await sendMessage(promptText, result.chat.id);
    // console.log("Initial message sent to new chat with ID:", result.chat.id);
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
    <div className="home-layout-fluid h-screen w-full flex bg-[var(--bg-primary)] font-sans overflow-hidden transition-colors duration-300">

      {/* SECTION 1: SIDEBAR (LEFT) */}
      <Sidebar />

      {/* SECTION 2: MAIN CONTENT (RIGHT) */}
      <main className="workspace-layout-fluid flex-1 flex flex-col relative min-w-0 transition-colors duration-300">
        
        {/* Header / Workspace Navbar */}
        <Navbar 
          showOptions={hasChatSelected} 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onEnhanceUI={handleEnhanceUI}
          isGenerating={isGenerating}
        />
        {/* Content Area */}
        <div className="workspace-content-fluid flex-1 overflow-hidden relative flex justify-center">
          <div className="workspace-shell-fluid w-full max-w-[1400px] h-full flex flex-col">
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
              <div className={`workspace-panel-fluid flex-1 grid border-x border-[var(--border-color)] bg-[var(--bg-primary)] shadow-sm my-4 rounded-xl overflow-hidden min-h-0 mx-4 w-full transform transition-all duration-300 ${viewVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                {renderedView === "code" && (
                  <section className="w-full h-full min-h-0 min-w-0 bg-[var(--bg-tertiary)]">
                    <Editor code={code} setCode={setCode} loading={isGenerating || isPreviewLoading} />
                  </section>
                )}

                {renderedView === "preview" && (
                  <section className="w-full h-full min-h-0 min-w-0 bg-[var(--bg-tertiary)]">
                    <Preview />
                  </section>
                )}

                {renderedView === "chat" && (
                  <section className="w-full h-full min-h-0 min-w-0 flex flex-col overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-300">
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      {messages.length > 0 ? (
                        <ChatHistory />
                      ) : (
                        <div className="h-full flex items-center justify-center p-8 text-slate-400 opacity-60">
                          <p className="text-lg font-medium tracking-tight">Start a new conversation</p>
                        </div>
                      )}
                    </div>
                    <div className="sticky bottom-0 w-full border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4">
                      <PromptBar content={promptContent} setContent={setPromptContent} />
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;

