import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// ─────────────────────────────────────────────
// ALL USER ROUTES ARE PROTECTED
// verifyToken applied at router level — no route
// in this file is accessible without a valid JWT.
// ─────────────────────────────────────────────
router.use(verifyToken);

// GET /api/user/profile  — fetch authenticated user's full profile
router.get("/profile", getProfile);

// PUT /api/user/profile  — update name and/or avatar_url
// Body: { name?, avatar_url? }  (at least one required)
router.put("/profile", updateProfile);

export default router;
