import { runAgent } from "../services/agentService.js";

export const generateCode = async (req, res) => {
  try {
    const { prompt } = req.body;
    // console.log("Received prompt:", prompt);
    const result = await runAgent(prompt);
    // console.log("Generated code:", result);
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