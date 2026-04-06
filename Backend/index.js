import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import generateRoutes from "./src/routes/generateRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import { testDBConnection } from "./src/config/db.js";

// Load environment variables first — before anything else
dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // You can add more strict checking here for production
    return callback(null, true);
  },
  credentials: true, // Required so cookies are sent/received cross-origin
}));

app.use(express.json());     // Parse JSON request bodies
app.use(cookieParser());     // Parse cookies from incoming requests (needed for refresh token cookie)

// ── Routes ────────────────────────────────────────────────
app.use("/api", generateRoutes);       // POST /api/generate        (public)
app.use("/api/auth", authRoutes);      // POST /api/auth/*          (public)
app.use("/api/user", userRoutes);      // GET|PUT /api/user/profile (protected)
app.use("/api/chats", chatRoutes);     // Chat interactions         (protected)

// ── Health check ──────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("🚀 AI Cursor Backend Running...");
});

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await testDBConnection();
});