import { createMessage, getMessagesByChat } from "../models/MessageModel.js";
import { getChatByIdAndUser } from "../models/ChatModel.js";
import { ai, systemInstruction } from "../config/gemini.js";

/**
 * Retrieves all messages for a specific chat.
 * Expects chatId as a route parameter.
 */
export const getMessages = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user.id;

    // Check ownership of the chat
    const chat = await getChatByIdAndUser(chatId, userId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized." });
    }

    const messages = await getMessagesByChat(chatId);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Sends a message in a chat, gets an AI response, and stores both.
 * Expects { chatId, content } in req.body.
 */
export const sendMessage = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!chatId || !content) {
      return res.status(400).json({ error: "chatId and content are required." });
    }

    // Check ownership of the chat
    const chat = await getChatByIdAndUser(chatId, userId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized." });
    }

    // Get previous messages to maintain conversation context
    const previousMessages = await getMessagesByChat(chatId);
    const history = previousMessages.map((msg) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Add the current prompt
    history.push({
      role: "user",
      parts: [{ text: content }],
    });

    // 1. Store USER message
    const userMessage = await createMessage(chatId, "user", content);

    // 2. Call Gemini API
    // Ensure we send it to an appropriate model. We use gemini-1.5-flash as the standard fast text model.
    let aiTextResponse = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: history,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      aiTextResponse = response.text || "Sorry, I couldn't generate a response.";
      
      // Clean up the AI response: strip markdown fences if the AI included them
      if (aiTextResponse.startsWith("```html")) {
        aiTextResponse = aiTextResponse.replace("```html", "").trim();
        aiTextResponse = aiTextResponse.replace(/```$/, "").trim();
      } else if (aiTextResponse.startsWith("```")) {
        aiTextResponse = aiTextResponse.replace("```", "").trim();
        aiTextResponse = aiTextResponse.replace(/```$/, "").trim();
      }

      // Ensure valid HTML or auto-wrap
      const lowerResponse = aiTextResponse.toLowerCase();
      if (!lowerResponse.includes("<html")) {
        // Auto-wrap response if missing tags
        aiTextResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Content</title>
</head>
<body>
  ${aiTextResponse}
</body>
</html>`;
      }
    } catch (aiError) {
      console.error("Gemini API Error:", aiError);
      return res.status(502).json({ error: "Failed to communicate with AI provider." });
    }

    // 3. Store AI response
    const aiMessage = await createMessage(chatId, "ai", aiTextResponse);

    // 4. Return both messages
    return res.status(201).json({
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
