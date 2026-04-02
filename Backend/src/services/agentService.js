import { ai } from "../config/gemini.js";

// ─────────────────────────────────────────────
// AI AGENT SERVICE
// Pure AI layer — no DB logic here.
// Receives a prompt (and optional current code),
// calls Gemini, cleans the response, returns HTML.
// ─────────────────────────────────────────────

/**
 * Run the AI code generation agent.
 *
 * If currentCode is provided, the agent treats it as an edit/update request.
 * If not, it generates a fresh project from the prompt alone.
 *
 * @param {string} userProblem  - The user's prompt describing what to build
 * @param {string} [currentCode] - Existing HTML code to update (optional)
 * @returns {string} Clean HTML string ready for iframe rendering
 * @throws Will throw if the Gemini API call fails
 */
export async function runAgent(userProblem, currentCode = null) {

  // ── Build prompt content ──────────────────────
  // If editing existing code, include it as context
  const contentToSend = currentCode
    ? `Current Code:\n\`\`\`html\n${currentCode}\n\`\`\`\n\nUpdate the code based on this request: ${userProblem}`
    : userProblem;

  // ── Call Gemini API ───────────────────────────
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contentToSend,
    config: {
      systemInstruction: `You are an expert AI frontend web developer. Create a full frontend project (HTML, CSS, JS) inside a single file structure suitable for direct iframe rendering.
Return ONLY valid raw HTML code. Do NOT wrap it in markdown code blocks like \`\`\`html. Start strictly with <!DOCTYPE html> or <html>. Do NOT provide any explanations overhead or trailing conversational text. Ensure it is beautifully styled with modern CSS (e.g. Tailwind via CDN).`,
    },
  });

  // ── Clean the response ────────────────────────
  // Strip markdown fences if the model hallucinates them despite the instruction
  let code = response.text || "";

  if (code.startsWith("```html")) {
    code = code.replace(/^```html/, "").replace(/```$/, "").trim();
  } else if (code.startsWith("```")) {
    code = code.replace(/^```/, "").replace(/```$/, "").trim();
  }

  if (!code) {
    throw new Error("AI returned an empty response. Please try again.");
  }

  return code;
}