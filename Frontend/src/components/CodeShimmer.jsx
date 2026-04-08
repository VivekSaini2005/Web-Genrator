import React, { useState, useEffect } from 'react';
import './Shimmer.css';

const codeSnippets = [
  "<!DOCTYPE html>",
  "<html lang='en'>",
  "<head>",
  "  <meta charset='UTF-8' />",
  "  <meta name='viewport' content='width=device-width, initial-scale=1.0' />",
  "  <title>AI Magic UI</title>",
  "  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap' rel='stylesheet'>",
  "  <style>",
  "    * { margin: 0; padding: 0; box-sizing: border-box; }",
  "    body {",
  "      font-family: 'Inter', sans-serif;",
  "      background: linear-gradient(135deg, #0f172a, #1e293b);",
  "      color: white;",
  "    }",
  "    nav {",
  "      display: flex;",
  "      justify-content: space-between;",
  "      padding: 20px 40px;",
  "      background: rgba(255,255,255,0.05);",
  "      backdrop-filter: blur(10px);",
  "    }",
  "    nav h1 { font-size: 20px; }",
  "    nav ul { display: flex; gap: 20px; list-style: none; }",
  "    nav ul li { cursor: pointer; opacity: 0.8; }",
  "    nav ul li:hover { opacity: 1; }",
  "",
  "    .hero {",
  "      text-align: center;",
  "      padding: 100px 20px;",
  "    }",
  "    .hero h2 {",
  "      font-size: 48px;",
  "      font-weight: 700;",
  "      background: linear-gradient(90deg, #38bdf8, #6366f1);",
  "      -webkit-background-clip: text;",
  "      color: transparent;",
  "    }",
  "    .hero p {",
  "      margin-top: 20px;",
  "      font-size: 18px;",
  "      color: #cbd5f5;",
  "    }",
  "    .btn {",
  "      margin-top: 30px;",
  "      padding: 12px 24px;",
  "      border-radius: 8px;",
  "      border: none;",
  "      background: linear-gradient(90deg, #6366f1, #8b5cf6);",
  "      color: white;",
  "      cursor: pointer;",
  "      transition: 0.3s;",
  "    }",
  "    .btn:hover { transform: scale(1.05); }",
  "",
  "    .cards {",
  "      display: grid;",
  "      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));",
  "      gap: 20px;",
  "      padding: 60px;",
  "    }",
  "    .card {",
  "      background: rgba(255,255,255,0.05);",
  "      padding: 20px;",
  "      border-radius: 12px;",
  "      backdrop-filter: blur(10px);",
  "      transition: 0.3s;",
  "    }",
  "    .card:hover {",
  "      transform: translateY(-10px);",
  "      background: rgba(255,255,255,0.1);",
  "    }",
  "    .card h3 { margin-bottom: 10px; }",
  "    .card p { font-size: 14px; color: #94a3b8; }",
  "  </style>",
  "</head>",
  "<body>",
  "",
  "  <nav>",
  "    <h1>✨ AI Builder</h1>",
  "    <ul>",
  "      <li>Home</li>",
  "      <li>Features</li>",
  "      <li>Pricing</li>",
  "      <li>Contact</li>",
  "    </ul>",
  "  </nav>",
  "",
  "  <section class='hero'>",
  "    <h2>Create Websites with AI</h2>",
  "    <p>Generate stunning UI instantly with just one prompt.</p>",
  "    <button class='btn'>Get Started 🚀</button>",
  "  </section>",
  "",
  "  <section class='cards'>",
  "    <div class='card'>",
  "      <h3>⚡ Fast Generation</h3>",
  "      <p>Create full websites in seconds using AI.</p>",
  "    </div>",
  "    <div class='card'>",
  "      <h3>🎨 Beautiful Design</h3>",
  "      <p>Modern UI with gradients, glassmorphism and animations.</p>",
  "    </div>",
  "    <div class='card'>",
  "      <h3>🧠 Smart AI</h3>",
  "      <p>Understands your prompt and builds exactly what you need.</p>",
  "    </div>",
  "  </section>",
  "",
  "</body>",
  "</html>"
];
const CodeShimmer = () => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // If all lines are written, wait and reset (Looping)
    if (lineIndex >= codeSnippets.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine("");
        setLineIndex(0);
        setCharIndex(0);
        setIsDeleting(false);
      }, 1500); // Small delay before restart
      return () => clearTimeout(timeout);
    }

    const fullLine = codeSnippets[lineIndex];
    let timeoutId;

    if (isDeleting) {
      // Deleting state (Mistake simulation)
      timeoutId = setTimeout(() => {
        setCurrentLine((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
        
        // Stop deleting if we deleted 3-6 chars roughly, or if we go too far back
        if (charIndex <= 2 || Math.random() < 0.25) {
          setIsDeleting(false);
        }
      }, Math.random() * 30 + 20); // Fast delete speed
    } else {
      // Typing state
      if (charIndex < fullLine.length) {
        // Random chance (about 2% per keystroke) to trigger a mistake IF we have enough characters
        const shouldMistake = Math.random() < 0.02 && charIndex > 4 && charIndex < fullLine.length - 2;

        if (shouldMistake) {
          setIsDeleting(true);
          timeoutId = setTimeout(() => {}, 100); // Tiny pause before deleting
        } else {
          timeoutId = setTimeout(() => {
            setCurrentLine(fullLine.substring(0, charIndex + 1));
            setCharIndex((prev) => prev + 1);
          }, Math.random() * 60 + 20); // 20ms–80ms typing speed
        }
      } else {
        // Line finishes typing
        timeoutId = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, fullLine]);
          setCurrentLine("");
          setCharIndex(0);
          setLineIndex((prev) => prev + 1);
        }, Math.random() * 500 + 300); // 300ms–800ms pause per line
      }
    }
    
    return () => clearTimeout(timeoutId);
  }, [lineIndex, charIndex, isDeleting]);

  return (
    <div className="code-typing-container">
      {/* Completed lines */}
      {displayedLines.map((line, i) => (
        <div key={i} className="editor-line">
          <span className="line-number">{i + 1}</span>
          <span className="line-content">{line}</span>
        </div>
      ))}
      
      {/* Actively typing line */}
      {lineIndex < codeSnippets.length && (
        <div className="editor-line">
          <span className="line-number">{displayedLines.length + 1}</span>
          <span className="line-content">
            {currentLine}
            <span className="typing-cursor" />
          </span>
        </div>
      )}
    </div>
  );
};

export default CodeShimmer;
