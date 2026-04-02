import { findUserById, updateUserProfile } from "../models/userModel.js";

// ─────────────────────────────────────────────
// GET /api/user/profile
// Returns the full profile of the authenticated user
// ─────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    // req.user.id is guaranteed — set by verifyToken middleware
    const user = await findUserById(req.user.id);

    if (!user) {
      // Edge case: valid token but user was deleted from DB after token was issued
      return res.status(404).json({
        success: false,
        error: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user, // { id, name, email, avatar_url, provider, created_at }
    });

  } catch (error) {
    console.error("[USER] Get profile error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch profile.",
    });
  }
};


// ─────────────────────────────────────────────
// PUT /api/user/profile
// Update name and/or avatar_url of the authenticated user
// Body: { name?, avatar_url? }
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar_url } = req.body;

    // ── Validate at least one field is provided ──
    if (name === undefined && avatar_url === undefined) {
      return res.status(400).json({
        success: false,
        error: "Provide at least one field to update: name or avatar_url.",
      });
    }

    // ── Validate name if provided ─────────────
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Name cannot be empty.",
        });
      }

      if (name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          error: "Name must be 100 characters or fewer.",
        });
      }
    }

    // ── Validate avatar_url if provided ───────
    if (avatar_url !== undefined && avatar_url !== null) {
      try {
        new URL(avatar_url); // Throws if not a valid URL
      } catch {
        return res.status(400).json({
          success: false,
          error: "avatar_url must be a valid URL.",
        });
      }
    }

    // ── Perform update ────────────────────────
    const updatedUser = await updateUserProfile(req.user.id, {
      name: name !== undefined ? name.trim() : undefined,
      avatar_url,
    });

    // Shouldn't happen, but guard against unexpected DB miss
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });

  } catch (error) {
    console.error("[USER] Update profile error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to update profile.",
    });
  }
};
