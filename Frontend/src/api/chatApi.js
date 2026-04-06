import apiClient from "./apiClient";

export const getChats = async () => {
  try {
    const response = await apiClient.get("/chats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createChat = async (title) => {
  try {
    const response = await apiClient.post("/chats", { title });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteChat = async (chatId) => {
  try {
    const response = await apiClient.delete(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await apiClient.get(`/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendMessage = async (chatId, content) => {
  try {
    const response = await apiClient.post(`/chats/${chatId}/messages`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
