import { runAgent } from "../services/agentService.js";
import { saveGeneration } from "../models/generationModel.js";
import { createMessage } from "../models/MessageModel.js";

// ─────────────────────────────────────────────
// POST /api/generate
// Public — works for both logged-in users and guests.
// Uses optionalAuth middleware so req.user is set
// when a token is present, null otherwise.
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

    // ── Save to DB ────────────────────────────
    // req.user is set by optionalAuth if a valid token was found.
    // null = guest user → generation saved anonymously.
    const userId = req.user?.id || null;

    let savedGeneration = null;
    // Only save to generations table if there is no chatId
    if (!chatId) {
      try {
        savedGeneration = await saveGeneration(
          userId,              // $1 — null for guests
          prompt.trim(),       // $2 — user's prompt text
          currentCode || null, // $3 — existing code (optional edit)
          generatedCode        // $4 — AI output HTML
        );
      } catch (dbError) {
        // DB failure should NOT block the user from getting their code.
        // Log the error but still return the generated output.
        console.error("[GENERATE] DB save error:", dbError.message);
      }
    }

    // ── Respond ───────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Code generated successfully.",
      generationId: savedGeneration?.id || null, // null if DB save failed
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