import express from "express";
import { generateCode } from "../controllers/generateController.js";

const router = express.Router();

// POST /api/generate
// Public — guests AND logged-in users can generate code.
// Body: { prompt, currentCode?, chatId? }
router.post("/generate", generateCode);

export default router;