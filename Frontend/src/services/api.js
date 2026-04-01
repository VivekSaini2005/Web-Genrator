import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const generateCode = (prompt, currentCode) =>
  API.post("/generate", { prompt, currentCode });