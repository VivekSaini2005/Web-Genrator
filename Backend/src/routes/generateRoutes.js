import express from "express";
import { generateCode, getHistory } from "../controllers/generateController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All generation routes require authentication
router.use(verifyToken);

// POST /api/generate
// Body: { prompt, projectId, currentCode? }
// Runs the AI, saves prompt + generation to DB
router.post("/generate", generateCode);

// GET /api/generate/history/:projectId
// Returns all prompts + generations for a project  
router.get("/generate/history/:projectId", getHistory);

export default router;