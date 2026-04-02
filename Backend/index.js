import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoutes from "./src/routes/generateRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { testDBConnection } from "./src/config/db.js";

// Load environment variables first — before anything else
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", generateRoutes);           // POST /api/generate         (protected)
app.use("/api/auth", authRoutes);          // POST /api/auth/*            (public)
app.use("/api/projects", projectRoutes);   // CRUD /api/projects/*        (protected)
app.use("/api/user", userRoutes);          // GET|PUT /api/user/profile   (protected)

// Health check
app.get("/", (req, res) => {
  res.send("🚀 AI Cursor Backend Running...");
});

// Read PORT from environment (falls back to 5000 for local dev)
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Verify PostgreSQL connection on every startup
  await testDBConnection();
});