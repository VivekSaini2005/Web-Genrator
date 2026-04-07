import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
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

export default router;
