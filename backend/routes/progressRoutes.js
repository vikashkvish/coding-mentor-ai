const express = require("express");
const Progress = require("../models/Progress");
const protect = require("../middleware/auth");
const learningPaths = require("../data/learningPaths");

const router = express.Router();

// NOTE: this router is mounted TWICE in server.js:
//   app.use("/api/paths", pathsOnly)      -> handles GET /api/paths
//   app.use("/api/progress", router)      -> handles everything below
// That's why the paths route lives in its own tiny router (see bottom of file).

// Everything below requires login
router.use(protect);

// @route  GET /api/progress
// @desc   Get the logged-in student's progress across ALL paths
router.get("/", async (req, res) => {
  const progress = await Progress.find({ user: req.user.id });
  res.json(progress);
});

// @route  PUT /api/progress/toggle
// @desc   Mark a topic as completed or not completed
// body: { path: "dsa", topic: "Arrays & Strings", completed: true }
router.put("/toggle", async (req, res) => {
  try {
    const { path, topic, completed } = req.body;

    if (!path || !topic) {
      return res.status(400).json({ message: "path and topic are required" });
    }

    // "upsert" means: update it if it exists, otherwise create it
    const updated = await Progress.findOneAndUpdate(
      { user: req.user.id, path, topic },
      {
        completed: !!completed,
        completedAt: completed ? new Date() : null,
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Could not update progress", error: error.message });
  }
});

// A separate, tiny public router just for GET /api/paths (no login required)
const pathsRouter = express.Router();
pathsRouter.get("/", (req, res) => {
  res.json(learningPaths);
});

module.exports = { progressRouter: router, pathsRouter };