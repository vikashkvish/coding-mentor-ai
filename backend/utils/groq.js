// This file talks to the Groq AI API to analyze a student's code.
// Groq gives out a generous free tier, and its API works just like OpenAI's.

const axios = require("axios");

async function analyzeCodeWithAI(code, language) {
  const systemPrompt = `You are a friendly coding mentor helping a beginner student.
Rules:
1. If the code has a bug or is incomplete, give a short HINT that guides the
   student toward the fix. Do NOT write the full corrected code or the full solution.
2. If the code looks correct, give short encouraging feedback and one tip to improve it.
3. Keep your reply under 120 words.
4. Use simple, beginner-friendly language.`;

  const userPrompt = `Language: ${language}\n\nHere is my code:\n\n${code}\n\nCan you review it?`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = analyzeCodeWithAI;