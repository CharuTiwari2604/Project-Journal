const Journal = require('../model/journalModal');
const axios = require('axios'); 

async function createJournal(req, res) {
  try {
    const { title, entry, mood, analysis } = req.body; 

    // Call NLP service
    let sentimentResult = null;
    try {
      const response = await axios.post(
        "https://nlp-services.onrender.com/analyze-sentiment",
        { text: entry }
      );
      sentimentResult = response.data.result;
    } catch (nlpErr) {
      console.error("NLP service error:", nlpErr);
    }

    let moodString = "";
    if (mood && mood.emoji && mood.label) {
      moodString = `${mood.emoji} ${mood.label}`;
    }

    const newJournal = await Journal.create({
      user: req.user.id,
      title,
      content: entry,
      sentiment: sentimentResult,
      analysis,
      mood: mood || {},
      createdAt: new Date()
    });

    res.status(201).json(newJournal);
  } catch (err) {
    console.error('Error creating journal:', err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createJournal };
