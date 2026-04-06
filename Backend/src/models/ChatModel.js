import pool from "../config/db.js";

/**
 * Creates a new chat for a user.
 * @param {string} userId - UUID of the user.
 * @param {string} title - Title of the chat.
 * @returns {Promise<Object>} The created chat row.
 */
export const createChat = async (userId, title) => {
  const result = await pool.query(
    `INSERT INTO chats (user_id, title)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, title]
  );
  return result.rows[0];
};

/**
 * Gets all chats for a specific user, ordered by creation date descending.
 * @param {string} userId - UUID of the user.
 * @returns {Promise<Array>} List of chat rows.
 */
export const getChatsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM chats
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

/**
 * Gets a specific chat by its ID and User ID.
 * @param {string} chatId - UUID of the chat.
 * @param {string} userId - UUID of the user.
 * @returns {Promise<Object>} The chat row if it belongs to the user, otherwise undefined.
 */
export const getChatByIdAndUser = async (chatId, userId) => {
  const result = await pool.query(
    `SELECT * FROM chats
     WHERE id = $1 AND user_id = $2`,
    [chatId, userId]
  );
  return result.rows[0];
};

/**
 * Deletes a specific chat for a user.
 * @param {string} chatId - UUID of the chat to delete.
 * @param {string} userId - UUID of the user to ensure authorization.
 * @returns {Promise<Object>} The deleted chat row, if any.
 */
export const deleteChat = async (chatId, userId) => {
  const result = await pool.query(
    `DELETE FROM chats
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [chatId, userId]
  );
  return result.rows[0];
};
