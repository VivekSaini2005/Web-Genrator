import { useState } from "react";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import PromptBar from "../components/PromptBar";
import FileExplorer from "../components/FileExplorer";
import Navbar from "../components/Navbar";
import { generateCode } from "../services/api";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");

  const handleGenerate = async () => {
    const res = await generateCode(prompt);
    setCode(res.data.message);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white">
      <Navbar />
      <PromptBar
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={handleGenerate}
      />

      <div className="flex flex-1">
        <FileExplorer setCode={setCode} />

        <div className="w-1/2">
          <Editor code={code} setCode={setCode} />
        </div>

        <div className="w-1/2">
          <Preview code={code} />
        </div>
      </div>
    </div>
  );
};

export default Home;