import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  getGenerationHistory,
  getSingleGeneration,
  deleteGenerationHandler,
} from "../controllers/userController.js";

const router = express.Router();

// All user routes require a valid JWT access token
router.use(verifyToken);

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────

// GET /api/user/profile  — fetch full user profile
router.get("/profile", getProfile);

// PUT /api/user/profile  — update name and/or avatar_url
// Body: { name?, avatar_url? }
router.put("/profile", updateProfile);


// ─────────────────────────────────────────────
// GENERATION HISTORY (authenticated users only)
// ─────────────────────────────────────────────

// GET /api/user/generations          — paginated list of past generations
// Query params: ?limit=20&offset=0
router.get("/generations", getGenerationHistory);

// GET /api/user/generations/:id      — single generation with full output_code
router.get("/generations/:id", getSingleGeneration);

// DELETE /api/user/generations/:id   — delete a generation from history
router.delete("/generations/:id", deleteGenerationHandler);

export default router;
