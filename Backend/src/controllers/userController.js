import {
  findUserById,
  updateUserName,
  updateUserAvatar,
  updateUserNameAndAvatar,
} from "../models/userModel.js";
import {
  getGenerationsByUser,
  getGenerationById,
  deleteGeneration,
} from "../models/generationModel.js";

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

    // ── Perform update ────────────────────────────────
    // Call the right SQL function based on which fields were provided
    let updatedUser;

    if (name !== undefined && avatar_url !== undefined) {
      // Both fields sent — update both in one SQL query
      updatedUser = await updateUserNameAndAvatar(req.user.id, name.trim(), avatar_url);
    } else if (name !== undefined) {
      // Only name was sent — update name only
      updatedUser = await updateUserName(req.user.id, name.trim());
    } else {
      // Only avatar_url was sent — update avatar only
      updatedUser = await updateUserAvatar(req.user.id, avatar_url);
    }

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


// ─────────────────────────────────────────────
// GET /api/user/generations
// Returns paginated generation history for the
// authenticated user (most recent first).
// Query params: ?limit=20&offset=0
// ─────────────────────────────────────────────
export const getGenerationHistory = async (req, res) => {
  try {
    // Support pagination via query params — default 20 per page
    const limit  = Math.min(parseInt(req.query.limit)  || 20, 100); // cap at 100
    const offset = Math.max(parseInt(req.query.offset) || 0,  0);

    const generations = await getGenerationsByUser(req.user.id, limit, offset);

    return res.status(200).json({
      success: true,
      count: generations.length,
      limit,
      offset,
      generations, // [ { id, prompt, created_at } ] — no output_code for list efficiency
    });

  } catch (error) {
    console.error("[USER] Generation history error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch generation history.",
    });
  }
};


// ─────────────────────────────────────────────
// GET /api/user/generations/:id
// Returns a single generation with full output_code.
// Used when re-opening a past generation.
// ─────────────────────────────────────────────
export const getSingleGeneration = async (req, res) => {
  try {
    const { id } = req.params;

    const generation = await getGenerationById(id, req.user.id);

    if (!generation) {
      return res.status(404).json({
        success: false,
        error: "Generation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      generation, // Full row including output_code
    });

  } catch (error) {
    console.error("[USER] Get generation error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch generation.",
    });
  }
};


// ─────────────────────────────────────────────
// DELETE /api/user/generations/:id
// Delete a specific generation owned by the user.
// ─────────────────────────────────────────────
export const deleteGenerationHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteGeneration(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Generation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Generation deleted successfully.",
    });

  } catch (error) {
    console.error("[USER] Delete generation error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to delete generation.",
    });
  }
};
