import { runAgent } from "../services/agentService.js";
import { createMessage } from "../models/MessageModel.js";

// ─────────────────────────────────────────────
// POST /api/generate
// Public — works for both logged-in users and guests.
//
// Body: { prompt, currentCode?, chatId? }
// ─────────────────────────────────────────────
export const generateCode = async (req, res) => {
  try {
    const { prompt, currentCode, chatId } = req.body;

    // ── Validate prompt ───────────────────────
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required.",
      });
    }

    // If chat exists, save USER message
    if (chatId) {
      try {
        await createMessage(chatId, "user", prompt.trim());
      } catch (err) {
        console.error("Error storing user message:", err.message);
      }
    }

    // ── Run AI agent ──────────────────────────
    let generatedCode;
    try {
      generatedCode = await runAgent(prompt.trim(), currentCode || null);
    } catch (aiError) {
      console.error("[GENERATE] AI agent error:", aiError.message);
      return res.status(502).json({
        success: false,
        error: "AI generation failed. Please try again.",
      });
    }

    // If chat exists, save AI response as a message
    if (chatId) {
      try {
        await createMessage(chatId, "ai", generatedCode);
      } catch (err) {
        console.error("Error storing ai message:", err.message);
      }
    }

    // ── Respond ───────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Code generated successfully.",
      code: generatedCode,
    });

  } catch (error) {
    console.error("[GENERATE] Unexpected error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
};