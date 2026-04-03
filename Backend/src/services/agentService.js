// ─────────────────────────────────────────────
// agentService.js
// This file talks to the Gemini AI API.
// It sends the user's prompt and gets back HTML code.
// ─────────────────────────────────────────────

import { ai } from "../config/gemini.js";


// ─────────────────────────────────────────────
// FUNCTION: runAgent
// ─────────────────────────────────────────────
// This function does 3 things:
//   1. Builds the message to send to the AI
//   2. Calls the Gemini AI API
//   3. Cleans up the response and returns HTML code
//
// Parameters:
//   userPrompt   = what the user typed (e.g. "make a todo app")
//   currentCode  = the existing HTML code (only sent when user is EDITING)
//                  if the user is making something new, this is null
// ─────────────────────────────────────────────
export async function runAgent(userPrompt, currentCode = null) {

  // ── STEP 1: Build the message for the AI ──────────────────
  // If the user already has code and wants to edit it,
  // we send the existing code as context so the AI knows what to change.
  // If it's a fresh request, we just send the prompt as-is.

  let messageToSend;

  if (currentCode) {
    // User is editing existing code → include the old code for context
    messageToSend = `
Here is the current HTML code:
\`\`\`html
${currentCode}
\`\`\`

Now update it based on this request: ${userPrompt}
    `.trim();
  } else {
    // Fresh request → just send the prompt
    messageToSend = userPrompt;
  }


  // ── STEP 2: Call the Gemini AI API ───────────────────────
  // We send the message and a "system instruction" which tells
  // the AI how to behave (like a rule it must follow).

  const systemInstruction = `
You are an expert AI frontend web developer.
Create a full frontend project (HTML, CSS, JS) inside a single HTML file.
The file must work when loaded directly in an iframe.

Rules you MUST follow:
- Return ONLY raw HTML code. Nothing else.
- Do NOT wrap it in markdown like \`\`\`html — just plain HTML.
- Always start with <!DOCTYPE html> or <html>.
- Do NOT add any text explanation before or after the code.
- Style it beautifully using modern CSS or Tailwind CSS via CDN.
  `.trim();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: messageToSend,
    config: {
      systemInstruction: systemInstruction,
    },
  });


  // ── STEP 3: Clean up the AI response ─────────────────────
  // Sometimes the AI wraps the code in markdown fences like:
  //   ```html
  //   ... code here ...
  //   ```
  // Even though we told it not to. So we strip those off.

  let code = response.text || "";

  // Remove ```html at the start and ``` at the end
  if (code.startsWith("```html")) {
    code = code.replace("```html", "").trim(); // remove the opening fence
    code = code.replace(/```$/, "").trim();    // remove the closing fence
  }
  // Remove just ``` if there's no "html" label
  else if (code.startsWith("```")) {
    code = code.replace("```", "").trim();     // remove the opening fence
    code = code.replace(/```$/, "").trim();    // remove the closing fence
  }

  // If the AI returned nothing at all, throw an error
  if (!code) {
    throw new Error("AI returned an empty response. Please try again.");
  }

  // Return the clean HTML string
  return code;
}