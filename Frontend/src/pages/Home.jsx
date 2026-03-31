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

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showOptions]);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    setPrompt("");
    setMessages([{ role: "user", content: userPrompt }]);
    setShowOptions(true);
    setLoading(true);
    setCode("");

    try {
      // console.log("Sending prompt to backend:", userPrompt);
      const res = await apiGenerateCode(userPrompt);
      setCode(res.data.message);
    } catch (err) {
      console.error(err);
      setCode("Error generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-[#0f172a] to-black text-white font-sans">
      <Navbar />

      <div className="flex-1 overflow-hidden flex flex-col">
        {showOptions ? (
          <div className="flex-1 flex flex-col pt-6 pb-2 px-4 max-w-6xl mx-auto w-full gap-4 overflow-y-auto">
            <ChatHistory messages={messages} />

            <div className="flex flex-col flex-1 bg-gray-800/30 border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm mb-4 min-h-[400px]">
              {/* TABS */}
              <div className="flex bg-gray-900/50 border-b border-gray-700/50">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex-1 py-3 text-sm font-medium transition-all duration-200 flex justify-center items-center gap-2 ${
                    activeTab === "code"
                      ? "bg-gray-800/50 text-emerald-400 border-b-2 border-emerald-400 bg-opacity-100"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  Code
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 py-3 text-sm font-medium transition-all duration-200 flex justify-center items-center gap-2 ${
                    activeTab === "preview"
                      ? "bg-gray-800/50 text-cyan-400 border-b-2 border-cyan-400 bg-opacity-100"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  Preview
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="flex-1 relative bg-[#0d1117]/80">
                {loading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
                      <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-emerald-400 font-medium animate-pulse">Crafting your code...</p>
                  </div>
                )}

                {activeTab === "code" ? (
                  <Editor code={code} setCode={setCode} loading={loading} />
                ) : (
                  <Preview code={code} loading={loading} />
                )}
              </div>
            </div>
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <EmptyState setPrompt={setPrompt} />
        )}
      </div>

      <PromptBar
        prompt={prompt}
        setPrompt={setPrompt}
        loading={loading}
        generateCode={handleGenerateCode}
      />
    </div>
  );
};

export default Home;