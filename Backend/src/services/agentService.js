import { ai } from "../config/gemini.js";
import { platform } from "../utils/osDetector.js";
import {
  executeCommand,
  executeCommandDeclaration,
} from "./commandService.js";

export async function runAgent(userProblem) {
  const History = [];

  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `You are an expert AI agent specializing in automated frontend web development.

User OS: ${platform}

Follow PLAN → EXECUTE → VALIDATE → REPEAT.

Linux/macOS:
Use cat << 'EOF'

Windows:
Use PowerShell Set-Content with @' '@

Always create full frontend project (HTML, CSS, JS).

DO NOT explain, only perform actions.
`,
        tools: [
          {
            functionDeclarations: [executeCommandDeclaration],
          },
        ],
      },
    });

    // 🔥 If AI wants to call tool
    if (response.functionCalls && response.functionCalls.length > 0) {
      const { name, args } = response.functionCalls[0];

      const result = await executeCommand(args);

      const functionResponsePart = {
        name: name,
        response: {
          result: result,
        },
      };

      // add model call
      History.push({
        role: "model",
        parts: [
          {
            functionCall: response.functionCalls[0],
          },
        ],
      });

      // add tool result
      History.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      // final response
      History.push({
        role: "model",
        parts: [{ text: response.text }],
      });

      return response.text;
    }
  }
}