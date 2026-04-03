import express from "express";
import { generateCode } from "../controllers/generateController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/generate
// Public — guests AND logged-in users can generate.
// optionalAuth attaches req.user if a valid token is present,
// sets req.user = null for guests. Never blocks the request.
// Body: { prompt, currentCode? }
router.post("/generate", optionalAuth, generateCode);

export default router;