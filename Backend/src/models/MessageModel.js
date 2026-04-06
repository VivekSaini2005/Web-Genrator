import pool from "../config/db.js";

/**
 * Creates a new message in a chat.
 * @param {string} chatId - UUID of the chat.
 * @param {string} role - Role of the message sender ('user' or 'ai').
 * @param {string} content - Content of the message.
 * @returns {Promise<Object>} The created message row.
 */
export const createMessage = async (chatId, role, content) => {
  const result = await pool.query(
    `INSERT INTO messages (chat_id, role, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [chatId, role, content]
  );
  return result.rows[0];
};

/**
 * Gets all messages for a specific chat, ordered by creation date ascending.
 * @param {string} chatId - UUID of the chat.
 * @returns {Promise<Array>} List of message rows.
 */
export const getMessagesByChat = async (chatId) => {
  const result = await pool.query(
    `SELECT * FROM messages
     WHERE chat_id = $1
     ORDER BY created_at ASC`,
    [chatId]
  );
  return result.rows;
};
