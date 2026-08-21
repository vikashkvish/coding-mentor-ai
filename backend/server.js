// This is the entry point of our backend server.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const codeRoutes = require("./routes/codeRoutes");
const { progressRouter, pathsRouter } = require("./routes/progressRoutes");

const app = express();

// Middleware
app.use(cors()); // allows our frontend (different URL) to call this backend
app.use(express.json()); // lets us read JSON from request bodies

// Connect to the database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/paths", pathsRouter);       // GET /api/paths
app.use("/api/progress", progressRouter); // GET /api/progress, PUT /api/progress/toggle

// Simple health check route
app.get("/", (req, res) => {
  res.send("Coding Mentor AI backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});