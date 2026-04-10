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
    // console.log("Send to /chats");
    const response = await apiClient.post("/chats", { title });
    // console.log("Response from /chats:", response.data);
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
    // console.log("Sending message to /chats/" + chatId + "/messages with content:", content);
    const response = await apiClient.post(`/chats/${chatId}/messages`, { content });
      // console.log("Response from sending message:", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
