import { runAgent } from "../services/agentService.js";
import { getProjectById } from "../models/projectModel.js";
import { savePrompt, saveGeneration, getGenerationHistory } from "../models/promptModel.js";

// ─────────────────────────────────────────────
// POST /api/generate
// Orchestrates the full generation pipeline:
//
//   [1] Validate input
//   [2] Verify project ownership (user → project)
//   [3] Save prompt to DB       (project → prompt)
//   [4] Run AI agent            (prompt → HTML code)
//   [5] Save generation to DB   (prompt → generation)
//   [6] Respond with full trace
//
// Requires: Authorization: Bearer <access_token>  (verifyToken middleware)
// Body:     { prompt, projectId, currentCode? }
// ─────────────────────────────────────────────
export const generateCode = async (req, res) => {
  try {
    const { prompt, projectId, currentCode } = req.body;

    // ── [1] Validate required inputs ──────────
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required.",
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "projectId is required. Create or select a project first.",
      });
    }

    // ── [2] Verify project ownership ──────────
    // Ensures the project belongs to the authenticated user (req.user set by verifyToken)
    // Returns undefined if project not found OR belongs to a different user
    const project = await getProjectById(projectId, req.user.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found or you do not have access to it.",
      });
    }

    // ── [3] Save prompt to DB ─────────────────
    // Record the user's input before running the AI, so it's never lost
    const savedPrompt = await savePrompt(projectId, prompt.trim());

    // ── [4] Run AI agent ──────────────────────
    // Pure AI layer — throws on API failure or empty response
    let generatedCode;
    try {
      generatedCode = await runAgent(prompt.trim(), currentCode || null);
    } catch (aiError) {
      console.error("[GENERATE] AI agent error:", aiError.message);

      // Still return a 502 — the prompt was saved, but the AI failed
      return res.status(502).json({
        success: false,
        error: "AI generation failed. Please try again.",
        promptId: savedPrompt.id, // Let frontend know the prompt was saved
      });
    }

    // ── [5] Save generation to DB ─────────────
    // Link generated code to the prompt row (prompt_id FK)
    const savedGeneration = await saveGeneration(savedPrompt.id, generatedCode);

    // ── [6] Respond ───────────────────────────
    return res.status(200).json({
      success: true,
      message: "Code generated successfully.",

      // Full lineage trace — user → project → prompt → generation
      projectId: project.id,
      prompt: {
        id: savedPrompt.id,
        content: savedPrompt.content,
        created_at: savedPrompt.created_at,
      },
      generation: {
        id: savedGeneration.id,
        output_code: savedGeneration.output_code,
        created_at: savedGeneration.created_at,
      },
    });

  } catch (error) {
    console.error("[GENERATE] Unexpected error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
};


// ─────────────────────────────────────────────
// GET /api/generate/history/:projectId
// Returns the full prompt + generation history
// for a project (most recent first).
// Requires: Authorization: Bearer <access_token>
// ─────────────────────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify the project exists and belongs to this user before exposing history
    const project = await getProjectById(projectId, req.user.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found or you do not have access to it.",
      });
    }

    // Fetch joined prompt + generation rows for this project
    const history = await getGenerationHistory(projectId);

    return res.status(200).json({
      success: true,
      projectId,
      count: history.length,
      history,
    });

  } catch (error) {
    console.error("[GENERATE] History error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch generation history.",
    });
  }
};