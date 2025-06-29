require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const logger = require("./logger");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/winstonedb';

// Validate environment variables
if (!DB_URL) {
  logger.error("❌ DB_URL is not defined in .env file");
  process.exit(1);
}

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`📥 ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose
  .connect(DB_URL)
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch((err) => {
    logger.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/users", userRoutes);

// 404 Handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  logger.error("❗", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// Handle unexpected exceptions
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
