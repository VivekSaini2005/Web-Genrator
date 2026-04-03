// ─────────────────────────────────────────────
// generationModel.js
// Direct SQL queries for the 'generations' table.
// Each function does ONE thing — easy to read and understand.
// ─────────────────────────────────────────────

import pool from "../config/db.js";

// ─────────────────────────────────────────────
// SAVE a new generation to the database
// ─────────────────────────────────────────────
// Called after the AI generates code.
// user_id can be NULL (for users who are not logged in).
//
// $1 = user_id   (UUID or null)
// $2 = prompt    (the text the user typed)
// $3 = currentCode (existing HTML sent for editing, or null)
// $4 = outputCode  (the HTML the AI generated)
// ─────────────────────────────────────────────
export const saveGeneration = async (userId, prompt, currentCode, outputCode) => {
  const sql = `
    INSERT INTO generations (user_id, prompt, current_code, output_code)
    VALUES ($1, $2, $3, $4)
    RETURNING id, user_id, prompt, output_code, created_at
  `;

  const values = [userId, prompt, currentCode, outputCode];

  const result = await pool.query(sql, values);

  // result.rows[0] = the row that was just inserted
  return result.rows[0];
};


// ─────────────────────────────────────────────
// GET all generations for a logged-in user
// ─────────────────────────────────────────────
// Returns a list of past generations (newest first).
// Does NOT include output_code to keep the response small.
// Use getGenerationById() to load the full code of one item.
//
// $1 = user_id
// ─────────────────────────────────────────────
export const getGenerationsByUser = async (userId) => {
  const sql = `
    SELECT id, prompt, created_at
    FROM generations
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(sql, [userId]);

  // result.rows = array of all matching rows
  return result.rows;
};


// ─────────────────────────────────────────────
// GET a single generation by its ID
// ─────────────────────────────────────────────
// Returns the full row including output_code.
// Also checks user_id so users cannot access each other's data.
//
// $1 = generation id (UUID)
// $2 = user_id       (must match the owner)
// ─────────────────────────────────────────────
export const getGenerationById = async (generationId, userId) => {
  const sql = `
    SELECT id, user_id, prompt, current_code, output_code, created_at
    FROM generations
    WHERE id = $1
      AND user_id = $2
  `;

  const result = await pool.query(sql, [generationId, userId]);

  // result.rows[0] = the matched row, or undefined if not found
  return result.rows[0];
};


// ─────────────────────────────────────────────
// DELETE a single generation by its ID
// ─────────────────────────────────────────────
// Only deletes if the generation belongs to the user.
// Returns true if deleted, false if not found.
//
// $1 = generation id (UUID)
// $2 = user_id       (must match the owner)
// ─────────────────────────────────────────────
export const deleteGeneration = async (generationId, userId) => {
  const sql = `
    DELETE FROM generations
    WHERE id = $1
      AND user_id = $2
  `;

  const result = await pool.query(sql, [generationId, userId]);

  // result.rowCount = number of rows deleted (1 = success, 0 = not found)
  return result.rowCount > 0;
};
