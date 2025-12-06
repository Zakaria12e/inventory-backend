// server.js (No Sockets)

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import categoriesRoutes from "./routes/categorieRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

import createSuperAdmin from "./utils/createSuperAdmin.js";

dotenv.config();
connectDB();

const app = express();

// Define allowed origins
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// --- MIDDLEWARE ---
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Create default Super Admin (runs only once)
createSuperAdmin();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// --- ROUTES ---
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/items", itemRoutes);
app.use("/alerts", alertRoutes);
app.use("/users", userRoutes);
app.use("/activities", activityRoutes);

app.get("/", (req, res) => res.send("Server is running"));

// --- START SERVER ---
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
