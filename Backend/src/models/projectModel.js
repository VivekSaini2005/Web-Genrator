import pool from "../config/db.js";

// ─────────────────────────────────────────────
// PROJECT QUERIES
// All queries are scoped to user_id to prevent
// any cross-user data access.
// ─────────────────────────────────────────────

/**
 * Get all projects belonging to a specific user.
 * Returned in descending order (most recent first).
 */
export const getProjectsByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT id, title, created_at
     FROM projects
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Get a single project by its ID — only if it belongs to the user.
 * Returns undefined if not found or if user doesn't own it.
 */
export const getProjectById = async (projectId, userId) => {
  const { rows } = await pool.query(
    `SELECT id, title, created_at
     FROM projects
     WHERE id = $1 AND user_id = $2`,
    [projectId, userId]
  );
  return rows[0];
};

/**
 * Get a project with its full chat session context:
 * project metadata + prompt count (in one query, no N+1).
 * Used for the "open session" view on the frontend.
 *
 * @param {string} projectId - UUID of the project
 * @param {string} userId    - UUID of the owner
 * @returns {object|null} project row with prompt_count field
 */
export const getProjectSession = async (projectId, userId) => {
  const { rows } = await pool.query(
    `SELECT
       p.id,
       p.title,
       p.created_at,
       COUNT(pr.id)::int AS prompt_count
     FROM projects p
     LEFT JOIN prompts pr ON pr.project_id = p.id
     WHERE p.id = $1 AND p.user_id = $2
     GROUP BY p.id`,
    [projectId, userId]
  );
  return rows[0];
};

/**
 * @param {string} userId - UUID of the authenticated user
 * @param {string} title  - Project title
 */
export const createProject = async (userId, title) => {
  const { rows } = await pool.query(
    `INSERT INTO projects (user_id, title)
     VALUES ($1, $2)
     RETURNING id, title, created_at`,
    [userId, title]
  );
  return rows[0];
};

/**
 * Update the title of an existing project.
 * Scoped to user_id to prevent unauthorized updates.
 */
export const updateProject = async (projectId, userId, title) => {
  const { rows } = await pool.query(
    `UPDATE projects
     SET title = $1
     WHERE id = $2 AND user_id = $3
     RETURNING id, title, created_at`,
    [title, projectId, userId]
  );
  return rows[0]; // undefined if not found or not owned
};

/**
 * Delete a project by ID — only if it belongs to the user.
 * CASCADE DELETE in the schema will also remove related prompts + generations.
 */
export const deleteProject = async (projectId, userId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM projects
     WHERE id = $1 AND user_id = $2`,
    [projectId, userId]
  );
  return rowCount > 0; // true = deleted, false = not found / not owned
};
