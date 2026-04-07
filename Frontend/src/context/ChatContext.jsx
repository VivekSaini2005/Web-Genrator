import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  getChats as apiGetChats,
  createChat as apiCreateChat,
  deleteChat as apiDeleteChat,
  getMessages as apiGetMessages,
  sendMessage as apiSendMessage,
} from "../api/chatApi";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeChatRef = useRef(null);

  // 1. loadChats() - fetches all user chats
  const loadChats = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingChats(true);
      const data = await apiGetChats();
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoadingChats(false);
    }
  }, [user]);

  // Load chats on mount / user change
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // 2. selectChat(chatId) - sets current chat & fetches messages
  const selectChat = async (chatId) => {
    try {
      // Auto-cleanup: if we are switching away from an empty chat, delete it
      if (currentChatId && currentChatId !== chatId && messages.length === 0) {
        await apiDeleteChat(currentChatId).catch(console.error);
        setChats(prev => prev.filter(c => c.id !== currentChatId));
      }

      setCurrentChatId(chatId);
      activeChatRef.current = chatId; // Track active chat to prevent race conditions
      setMessages([]); // clear current messages immediately
      
      const data = await apiGetMessages(chatId);
      
      // Update UI only if the user hasn't switched away during the fetch
      if (activeChatRef.current === chatId) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // 3. createNewChat() - creates new chat and auto-selects it
  const createNewChat = async (title = "New Chat") => {
    // Prevent creating duplicate empty chats
    const currentChat = chats.find(c => c.id === currentChatId);
    if (currentChat && messages.length === 0) {
      setCurrentChatId(currentChat.id);
      activeChatRef.current = currentChat.id;
      setMessages([]); 
      return { reused: true, chat: currentChat };
    }

    try {
      const newChat = await apiCreateChat(title);
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      activeChatRef.current = newChat.id;
      setMessages([]); // empty messages for new chat
      return { reused: false, chat: newChat };
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  // 4. resetChat() - clears current chat and workspace to return to landing
  const resetChat = () => {
    if (currentChatId && messages.length === 0) {
      apiDeleteChat(currentChatId).catch(console.error);
      setChats(prev => prev.filter(c => c.id !== currentChatId));
    }
    setCurrentChatId(null);
    activeChatRef.current = null;
    setMessages([]);
  };

  // 4. sendMessage(content) - optimistic UI, sends to API, updates messages
  const sendMessage = async (content, chatId = null) => {
    const targetChatId = chatId || currentChatId;
    if (!targetChatId || !content.trim()) return;

    // Optimistic UI update
    const tempMessage = {
      id: Date.now().toString(), // temporary ID
      chat_id: targetChatId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setIsGenerating(true);

    try {
      const response = await apiSendMessage(targetChatId, content);
      
      if (activeChatRef.current === targetChatId) {
        setMessages((prev) => {
          // Remove temp message and add real messages
          const filtered = prev.filter((msg) => msg.id !== tempMessage.id);
          return [...filtered, response.userMessage, response.aiMessage];
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      if (activeChatRef.current === targetChatId) {
        // Remove temp message on failure
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      }
    } finally {
      if (activeChatRef.current === targetChatId) {
        setIsGenerating(false);
      }
    }
  };

  // 5. deleteChat(chatId) - deletes chat, updates state
  const deleteChat = async (chatId) => {
    try {
      await apiDeleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));

      // If we deleted the currently selected chat
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        messages,
        loadingChats,
        isGenerating,
        loadChats,
        selectChat,
        createNewChat,
        resetChat,
        sendMessage,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
