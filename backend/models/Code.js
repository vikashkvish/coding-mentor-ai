const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Snippet",
    },
    language: {
      type: String,
      default: "javascript",
    },
    code: {
      type: String,
      required: true,
    },
    aiFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Code", codeSchema);
