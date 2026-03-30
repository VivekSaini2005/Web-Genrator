import { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    if (!prompt) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/generate",
        { prompt }
      );

      setCode(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Error generating code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white">

      {/* TOP CHAT INPUT */}
      <div className="p-4 border-b border-gray-700 flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Build a modern login page..."
          className="flex-1 p-3 rounded bg-[#1e293b] outline-none"
        />

        <button
          onClick={generateCode}
          className="bg-green-500 px-4 rounded hover:bg-green-600"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* OUTPUT SECTION */}
      <div className="flex flex-1">

        {/* CODE */}
        <div className="w-1/2 p-2 border-r border-gray-700">
          <h2 className="text-sm mb-2">Code</h2>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-black text-green-400 p-2 font-mono"
          />
        </div>

        {/* PREVIEW */}
        <div className="w-1/2 bg-white">
          <h2 className="text-black text-sm p-2">Preview</h2>

          <iframe
            title="preview"
            srcDoc={code}
            className="w-full h-[calc(100%-30px)]"
          />
        </div>
      </div>
    </div>
  );
}

export default App;