import { ai } from "../config/gemini.js";

export async function runAgent(userProblem, currentCode) {
  let contentToSend = userProblem;
  if (currentCode) {
    contentToSend = `Current Code:\n\`\`\`html\n${currentCode}\n\`\`\`\n\nUpdate the code based on this request: ${userProblem}`;
  }

  // console.log("Running agent with problem:", userProblem);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contentToSend,
    config: {
      systemInstruction: `You are an expert AI frontend web developer. Create a full frontend project (HTML, CSS, JS) inside a single file structure suitable for direct iframe rendering.
Return ONLY valid raw HTML code. Do NOT wrap it in markdown code blocks like \`\`\`html. Start strictly with <!DOCTYPE html> or <html>. Do NOT provide any explanations overhead or trailing conversational text. Ensure it is beautifully styled with modern CSS (e.g. Tailwind via CDN).`,
    },
  });
  // console.log("Agent response received");
  // Optional: strip markdown if the model hallucinates it
  let code = response.text || "";
  if (code.startsWith("\`\`\`html")) code = code.replace("\`\`\`html", "").replace("\`\`\`", "").trim();
  else if (code.startsWith("\`\`\`")) code = code.replace("\`\`\`", "").replace("\`\`\`", "").trim();

  return code;
}