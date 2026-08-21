const express = require("express");
const Code = require("../models/Code");
const protect = require("../middleware/auth");
const analyzeCodeWithAI = require("../utils/groq");

const router = express.Router();

router.use(protect);

//GET /api/code
//Get all code snippets saved by the logged-in student
router.get("/", async (req, res) => {
  const snippets = await Code.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json(snippets);
});

//POST /api/code
//Save a new code snippet
router.post("/", async (req, res) => {
  try {
    const { title, language, code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code cannot be empty" });
    }

    const snippet = await Code.create({
      user: req.user.id,
      title,
      language,
      code,
    });

    res.status(201).json(snippet);
  } catch (error) {
    res.status(500).json({ message: "Could not save code", error: error.message });
  }
});

//PUT /api/code/:id
//Update an existing code snippet
router.put("/:id", async (req, res) => {
  try {
    const snippet = await Code.findOne({ _id: req.params.id, user: req.user.id });
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    const { title, language, code } = req.body;
    if (title !== undefined) snippet.title = title;
    if (language !== undefined) snippet.language = language;
    if (code !== undefined) snippet.code = code;

    await snippet.save();
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ message: "Could not update code", error: error.message });
  }
});

//DELETE /api/code/:id
//Delete a saved code snippet
router.delete("/:id", async (req, res) => {
  const snippet = await Code.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!snippet) {
    return res.status(404).json({ message: "Snippet not found" });
  }
  res.json({ message: "Snippet deleted" });
});

//POST /api/code/:id/analyze
//Send the saved snippet's code to Groq AI and store the feedback
router.post("/:id/analyze", async (req, res) => {
  try {
    const snippet = await Code.findOne({ _id: req.params.id, user: req.user.id });
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    const feedback = await analyzeCodeWithAI(snippet.code, snippet.language);

    snippet.aiFeedback = feedback;
    await snippet.save();

    res.json({ feedback });
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI analysis failed. Check your Groq API key." });
  }
});
module.exports = router;