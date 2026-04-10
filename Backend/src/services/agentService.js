import { ai, systemInstruction } from "../config/gemini.js";

export async function runAgent(userPrompt, currentCode = null) {
  let messageToSend;

  if (currentCode) {
    messageToSend = `
Here is the current codebase context:
\`\`\`json
${currentCode}
\`\`\`

Now update it based on this request: ${userPrompt}
    `.trim();
  } else {
    messageToSend = userPrompt;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messageToSend,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  let code = response.text || "";
  code = code.trim();

  // Sometimes Gemini adds conversation text before or after the JSON.
  // We can try to extract the outermost JSON object if there's any.
  try {
    const startIdx = code.indexOf('{');
    const endIdx = code.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      code = code.substring(startIdx, endIdx + 1);
       code = code.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();
    }
  } catch (e) {
    console.log("Error stripping non-JSON prefix/suffix:", e);
  }

  if (!code) {
    throw new Error("AI returned an empty response. Please try again.");
  }

  try {
    const parsed = JSON.parse(code);
    if (parsed && typeof parsed === "object" && parsed.files) {
      return JSON.stringify(parsed);
    }
  } catch (err) {
    console.error("JSON parse failed. Code was: ", code.substring(0, 100));
  }

  const lowerCode = code.toLowerCase();
  let finalHtml = code;
  if (!lowerCode.includes("<html")) {
    finalHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated Content</title>\n</head>\n<body>\n  ${code}\n</body>\n</html>`;
  }

  const fallbackJson = {
    title: "Generated Content",
    description: "Fallback generation",
    plan: "Fallback generation",
    improvements: [],
    files: {
      "index.html": finalHtml,
      "style.css": "",
      "script.js": ""
    }
  };
  
  return JSON.stringify(fallbackJson);
}
