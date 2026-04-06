import express from "express";
import { createChat, getChats, deleteChat } from "../controllers/chatController.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
// Chat Routes
router.post("/", createChat);
router.get("/", getChats);
router.delete("/:id", deleteChat);

// Message Routes
router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);

export default router;
