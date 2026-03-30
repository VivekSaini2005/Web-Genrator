import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoutes from "./routes/generateRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", generateRoutes);

app.get("/", (req, res) => {
  res.send("🚀 AI Cursor Backend Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});