import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  listProjects,
  getProject,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from "../controllers/projectController.js";

const router = express.Router();

// ─────────────────────────────────────────────
// ALL PROJECT ROUTES ARE PROTECTED
// verifyToken is applied at the router level —
// every route below automatically requires auth.
// ─────────────────────────────────────────────
router.use(verifyToken);

// GET    /api/projects        → list all user's projects
router.get("/", listProjects);

// GET    /api/projects/:id    → get one project by ID
router.get("/:id", getProject);

// POST   /api/projects        → create new project  | Body: { title }
router.post("/", createProjectHandler);

// PUT    /api/projects/:id    → update project title | Body: { title }
router.put("/:id", updateProjectHandler);

// DELETE /api/projects/:id    → delete project + cascade (prompts, generations)
router.delete("/:id", deleteProjectHandler);

export default router;
