// ─────────────────────────────────────────────
// agentService.js
// This file talks to the Gemini AI API.
// It sends the user's prompt and gets back HTML code.
// ─────────────────────────────────────────────

import { ai, systemInstruction } from "../config/gemini.js";


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

  // Ensure valid HTML or auto-wrap
  const lowerCode = code.toLowerCase();
  if (!lowerCode.includes("<html")) {
    code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Content</title>
</head>
<body>
  ${code}
</body>
</html>`;
  }

  // Return the raw HTML string
  return code;
}