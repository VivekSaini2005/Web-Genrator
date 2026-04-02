import pool from "../config/db.js";

// ─────────────────────────────────────────────
// USER QUERIES
// ─────────────────────────────────────────────

/**
 * Find a user by their email address.
 * Used during login and to check for duplicate registrations.
 * @param {string} email
 * @returns {object|null} user row or undefined
 */
export const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return rows[0];
};

/**
 * Find a user by their UUID.
 * Used by the auth middleware after token verification.
 * @param {string} id - UUID
 * @returns {object|null} user row or undefined
 */
export const findUserById = async (id) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, avatar_url, provider, created_at FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0];
};

/**
 * Insert a new user into the database.
 * Password should already be hashed before calling this.
 * @param {object} param0 - { name, email, password, provider, avatar_url }
 * @returns {object} newly created user row (without password)
 */
export const createUser = async ({ name, email, password, provider = "local", avatar_url = null }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, provider, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, avatar_url, provider, created_at`,
    [name, email, password, provider, avatar_url]
  );
  return rows[0];
};

/**
 * Update a user's editable profile fields (name and/or avatar_url).
 * Only updates fields that are explicitly provided (not null/undefined).
 * Password and email are intentionally NOT updatable here.
 * @param {string} id         - UUID of the user
 * @param {object} fields     - { name?, avatar_url? }
 * @returns {object|null} updated user row (without password)
 */
export const updateUserProfile = async (id, { name, avatar_url }) => {
  // Build the SET clause dynamically — only update provided fields
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }

  if (avatar_url !== undefined) {
    updates.push(`avatar_url = $${paramIndex++}`);
    values.push(avatar_url);
  }

  // Nothing to update — return early without hitting the DB
  if (updates.length === 0) return null;

  values.push(id); // Last param is always the WHERE clause id

  const { rows } = await pool.query(
    `UPDATE users
     SET ${updates.join(", ")}
     WHERE id = $${paramIndex}
     RETURNING id, name, email, avatar_url, provider, created_at`,
    values
  );

  return rows[0];
};


// ─────────────────────────────────────────────
// SESSION QUERIES (Refresh Token Store)
// ─────────────────────────────────────────────

/**
 * Store a refresh token in the sessions table.
 * Called after a successful login or token refresh.
 * @param {string} userId - UUID of the user
 * @param {string} token  - hashed refresh token
 * @param {Date}   expiresAt - expiry timestamp
 */
export const storeRefreshToken = async (userId, token, expiresAt) => {
  await pool.query(
    `INSERT INTO sessions (user_id, refresh_token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
};

/**
 * Look up a session by refresh token.
 * Used during token refresh to validate the token.
 * @param {string} token - raw refresh token from client
 * @returns {object|null} session row or undefined
 */
export const findRefreshToken = async (token) => {
  const { rows } = await pool.query(
    "SELECT * FROM sessions WHERE refresh_token = $1 LIMIT 1",
    [token]
  );
  return rows[0];
};

/**
 * Delete a session by refresh token.
 * Called on logout to invalidate the refresh token.
 * @param {string} token
 */
export const deleteRefreshToken = async (token) => {
  await pool.query(
    "DELETE FROM sessions WHERE refresh_token = $1",
    [token]
  );
};

/**
 * Delete ALL sessions for a user.
 * Useful for "logout from all devices" functionality.
 * @param {string} userId - UUID
 */
export const deleteAllUserSessions = async (userId) => {
  await pool.query(
    "DELETE FROM sessions WHERE user_id = $1",
    [userId]
  );
};
