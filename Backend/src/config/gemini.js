import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const systemInstruction = `You are an AI web generator.

RULES:
- ONLY return valid HTML code
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include \`\`\`html
- Output must start with <!DOCTYPE html>
- Include inline CSS if needed
- Include inline JS if needed

Generate complete working HTML page.`;