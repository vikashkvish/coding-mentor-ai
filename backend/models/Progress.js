// This tracks which topics a student has completed, per learning path.
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: {
      type: String, // e.g. "dsa", "machine-learning", "java-developer", "mern-fullstack"
      required: true,
    },
    topic: {
      type: String, // e.g. "Arrays & Strings"
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// A student should only have ONE progress entry per (path + topic)
progressSchema.index({ user: 1, path: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
