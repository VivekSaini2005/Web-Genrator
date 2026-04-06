// ─────────────────────────────────────────────
// userModel.js
// All SQL queries for the 'users' and 'sessions' tables.
// Every function does ONE thing — easy to read and test.
//
// How $1, $2, $3 work:
//   They are placeholders for values in SQL.
//   pool.query(sql, [value1, value2]) → $1 = value1, $2 = value2
// ─────────────────────────────────────────────

import pool from "../config/db.js";


// ═════════════════════════════════════════════
//   USERS TABLE
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// FIND a user by their email address
// ─────────────────────────────────────────────
// Used during: login, registration duplicate check, Google OAuth
//
// $1 = email
// ─────────────────────────────────────────────
export const findUserByEmail = async (email) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const values = [email]; // $1 = email

  const result = await pool.query(sql, values);

  return result.rows[0]; // the matched user row, or undefined if not found
};


// ─────────────────────────────────────────────
// FIND a user by their ID (UUID)
// ─────────────────────────────────────────────
// Used by: auth middleware, profile page
// Note: password is NOT selected — never send it to the client
//
// $1 = id (UUID)
// ─────────────────────────────────────────────
export const findUserById = async (id) => {
  const sql = `
    SELECT id, name, email, avatar_url, provider, created_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const values = [id]; // $1 = id

  const result = await pool.query(sql, values);

  return result.rows[0]; // the user row, or undefined if not found
};


// ─────────────────────────────────────────────
// INSERT a new user into the database (REGISTER)
// ─────────────────────────────────────────────
// Called during: local registration, Google OAuth sign-up
// Password must already be hashed with bcrypt before calling this.
// RETURNING = gives back the saved row immediately (no second query needed)
//
// $1 = name
// $2 = email
// $3 = password  (hashed, or NULL for Google users)
// $4 = provider  ('local' or 'google')
// $5 = avatar_url (profile picture URL, or NULL)
// ─────────────────────────────────────────────
export const createUser = async (name, email, password, provider, avatar_url) => {
  const sql = `
    INSERT INTO users (name, email, password, provider, avatar_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, avatar_url, provider, created_at
  `;

  const values = [
    name,        // $1
    email,       // $2
    password,    // $3 — hashed password OR null (Google users have no password)
    provider,    // $4 — 'local' or 'google'
    avatar_url,  // $5 — profile photo URL or null
  ];

  const result = await pool.query(sql, values);

  return result.rows[0]; // the newly created user row (without password)
};


// ─────────────────────────────────────────────
// UPDATE a user's name (only)
// ─────────────────────────────────────────────
// Called by: PUT /api/user/profile when name is changed
//
// $1 = new name
// $2 = user id (UUID) — so we update the right user
// ─────────────────────────────────────────────
export const updateUserName = async (id, name) => {
  const sql = `
    UPDATE users
    SET name = $1
    WHERE id = $2
    RETURNING id, name, email, avatar_url, provider, created_at
  `;

  const values = [
    name, // $1 — new name
    id,   // $2 — which user to update
  ];

  const result = await pool.query(sql, values);

  return result.rows[0]; // the updated user row
};


// ─────────────────────────────────────────────
// UPDATE a user's avatar URL (only)
// ─────────────────────────────────────────────
// Called by: PUT /api/user/profile when avatar is changed
//
// $1 = new avatar_url
// $2 = user id (UUID)
// ─────────────────────────────────────────────
export const updateUserAvatar = async (id, avatar_url) => {
  const sql = `
    UPDATE users
    SET avatar_url = $1
    WHERE id = $2
    RETURNING id, name, email, avatar_url, provider, created_at
  `;

  const values = [
    avatar_url, // $1 — new avatar URL
    id,         // $2 — which user to update
  ];

  const result = await pool.query(sql, values);

  return result.rows[0]; // the updated user row
};


// ─────────────────────────────────────────────
// UPDATE both name AND avatar URL at once
// ─────────────────────────────────────────────
// Called by: PUT /api/user/profile when both fields are sent
//
// $1 = new name
// $2 = new avatar_url
// $3 = user id (UUID)
// ─────────────────────────────────────────────
export const updateUserNameAndAvatar = async (id, name, avatar_url) => {
  const sql = `
    UPDATE users
    SET name = $1, avatar_url = $2
    WHERE id = $3
    RETURNING id, name, email, avatar_url, provider, created_at
  `;

  const values = [
    name,       // $1
    avatar_url, // $2
    id,         // $3 — which user to update
  ];

  const result = await pool.query(sql, values);

  return result.rows[0]; // the updated user row
};


// ═════════════════════════════════════════════
//   SESSIONS TABLE  (Refresh Token Storage)
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// SAVE a refresh token after login
// ─────────────────────────────────────────────
// Called after: register, login, Google OAuth login
// Stores the token in DB so we can verify and revoke it later.
//
// $1 = user_id   (UUID — which user this session belongs to)
// $2 = token     (the refresh token string)
// $3 = expiresAt (date when this token expires — 7 days from now)
// ─────────────────────────────────────────────
export const storeRefreshToken = async (userId, token, expiresAt) => {
  const sql = `
    INSERT INTO sessions (user_id, refresh_token, expires_at)
    VALUES ($1, $2, $3)
  `;

  const values = [
    userId,    // $1
    token,     // $2
    expiresAt, // $3
  ];

  await pool.query(sql, values);
  // No return value needed — we just need to know it was saved
};


// ─────────────────────────────────────────────
// FIND a session by refresh token
// ─────────────────────────────────────────────
// Called when: user sends a refresh token to get a new access token
// We check the DB to make sure the token exists and is not revoked.
//
// $1 = refresh_token (the token string sent by the client)
// ─────────────────────────────────────────────
export const findRefreshToken = async (token) => {
  const sql = `
    SELECT *
    FROM sessions
    WHERE refresh_token = $1
    LIMIT 1
  `;

  const values = [token]; // $1 = token

  const result = await pool.query(sql, values);

  return result.rows[0]; // the session row, or undefined if not found / revoked
};


// ─────────────────────────────────────────────
// DELETE a single session (LOGOUT)
// ─────────────────────────────────────────────
// Called when: user logs out
// Deleting the token makes it permanently invalid.
//
// $1 = refresh_token (the token to remove)
// ─────────────────────────────────────────────
export const deleteRefreshToken = async (token) => {
  const sql = `
    DELETE FROM sessions
    WHERE refresh_token = $1
  `;

  const values = [token]; // $1 = token

  await pool.query(sql, values);
  // No return value needed
};


// ─────────────────────────────────────────────
// DELETE all sessions for one user (LOGOUT ALL DEVICES)
// ─────────────────────────────────────────────
// Called when: user wants to log out from every device at once
// Removes all refresh tokens for this user from the DB.
//
// $1 = user_id (UUID — all sessions for this user are removed)
// ─────────────────────────────────────────────
export const deleteAllUserSessions = async (userId) => {
  const sql = `
    DELETE FROM sessions
    WHERE user_id = $1
  `;

  const values = [userId]; // $1 = userId

  await pool.query(sql, values);
  // No return value needed
};

// ─────────────────────────────────────────────
// UPDATE a user's password
// ─────────────────────────────────────────────
// Called by: POST /api/auth/reset-password/:id/:token
// ─────────────────────────────────────────────
export const updateUserPassword = async (id, hashedPassword) => {
  const sql = `
    UPDATE users
    SET password = $1
    WHERE id = $2
  `;

  const values = [hashedPassword, id];
  await pool.query(sql, values);
};
