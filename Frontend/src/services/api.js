import apiClient from "../api/apiClient";

export const generateCode = (prompt, currentCode) =>
  apiClient.post("/generate", { prompt, currentCode });