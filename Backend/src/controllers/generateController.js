import { runAgent } from "../services/agentService.js";

export const generateCode = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await runAgent(prompt);

    res.json({
      message: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};