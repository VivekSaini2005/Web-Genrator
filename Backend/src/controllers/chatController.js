import { createChat as createChatModel, getChatsByUser, deleteChat as deleteChatModel } from "../models/ChatModel.js";

/**
 * Creates a new chat for the authenticated user.
 * Expects { title } in req.body and req.user to be set.
 */
export const createChat = async (req, res) => {
  try {
    // console.log("call to createChat route");
    // console.log("Creating chat for user:", req.user.id);
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required to create a chat." });
    }

    const newChat = await createChatModel(userId, title);
    // console.log("Chat created with ID:", newChat.id);
    return res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Retrieves all chats for the authenticated user.
 */
export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await getChatsByUser(userId);
    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Deletes a specific chat for the authenticated user.
 * Expects chatId as a route parameter.
 */
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: chatId } = req.params;

    const deletedChat = await deleteChatModel(chatId, userId);

    if (!deletedChat) {
      return res.status(404).json({ error: "Chat not found or unauthorized." });
    }

    return res.status(200).json({ message: "Chat deleted successfully.", deletedChat });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
