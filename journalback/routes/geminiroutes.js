const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const gemrouter = express.Router();

gemrouter.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  console.log("Gemini route hit with prompt:", req.body);

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
         contents: [
    {
      role: "user",
      parts: [
        {
          text: `Analyze this journal entry briefly (3–4 lines max). 
                 Focus only on mood, emotion, and self-reflection insight.
                 Keep it concise and empathetic.\n\n${prompt}`,
        },
      ],
    },
  ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    // Extract the AI text response safely
    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    res.json({ response: aiText });
  } catch (err) {
    console.error("Gemini API Error Details:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

module.exports = gemrouter;
