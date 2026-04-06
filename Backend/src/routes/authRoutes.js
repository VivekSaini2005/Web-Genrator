import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  googleLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES — No token required
// ─────────────────────────────────────────────

// Create a new account | Body: { name, email, password }
router.post("/register", register);

// Login with email + password | Body: { email, password }
router.post("/login", login);

// Logout and invalidate session | Body: { refreshToken }
router.post("/logout", logout);

// Issue a new access token | Body: { refreshToken }
router.post("/refresh", refreshToken);

// Google OAuth login | Body: { idToken }  ← the credential from Google Sign-In
router.post("/google", googleLogin);

// Request password reset link | Body: { email }
router.post("/forgot-password", forgotPassword);

// Reset password with token | Body: { newPassword } | Params: { id, token }
router.post("/reset-password/:id/:token", resetPassword);


// ─────────────────────────────────────────────
// PROTECTED ROUTES — Requires: Authorization: Bearer <token>
// ─────────────────────────────────────────────

// Return the authenticated user's profile (decoded from access token)
router.get("/me", verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user, // Set by verifyToken middleware: { id, email }
  });
});

export default router;
