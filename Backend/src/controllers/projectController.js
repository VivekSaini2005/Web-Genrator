import {
  getProjectsByUser,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../models/projectModel.js";

// ─────────────────────────────────────────────
// GET /api/projects
// List all projects for the authenticated user
// ─────────────────────────────────────────────
export const listProjects = async (req, res) => {
  try {
    // req.user is guaranteed to exist — set by verifyToken middleware
    const projects = await getProjectsByUser(req.user.id);

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("[PROJECTS] List error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to fetch projects." });
  }
};


// ─────────────────────────────────────────────
// GET /api/projects/:id
// Get a single project (must be owned by the user)
// ─────────────────────────────────────────────
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await getProjectById(id, req.user.id);

    if (!project) {
      // Return 404 whether not found OR not owned — never leak existence to other users
      return res.status(404).json({ success: false, error: "Project not found." });
    }

    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("[PROJECTS] Get error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to fetch project." });
  }
};


// ─────────────────────────────────────────────
// POST /api/projects
// Create a new project for the authenticated user
// Body: { title }
// ─────────────────────────────────────────────
export const createProjectHandler = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, error: "Project title is required." });
    }

    const project = await createProject(req.user.id, title.trim());

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("[PROJECTS] Create error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to create project." });
  }
};


// ─────────────────────────────────────────────
// PUT /api/projects/:id
// Update project title (must be owned by the user)
// Body: { title }
// ─────────────────────────────────────────────
export const updateProjectHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, error: "Project title is required." });
    }

    const updated = await updateProject(id, req.user.id, title.trim());

    if (!updated) {
      return res.status(404).json({ success: false, error: "Project not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: updated,
    });
  } catch (error) {
    console.error("[PROJECTS] Update error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to update project." });
  }
};


// ─────────────────────────────────────────────
// DELETE /api/projects/:id
// Delete a project + all its prompts/generations (CASCADE)
// ─────────────────────────────────────────────
export const deleteProjectHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteProject(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Project not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("[PROJECTS] Delete error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to delete project." });
  }
};
