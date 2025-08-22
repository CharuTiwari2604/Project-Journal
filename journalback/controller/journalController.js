const Journal = require('../model/journalModal');

async function createJournal(req, res) {
  try {
    const { title, entry, sentiment, mood, analysis } = req.body;

    let moodString = "";
    if (mood && mood.emoji && mood.label) {
      moodString = `${mood.emoji} ${mood.label}`;
    }

    const newJournal = await Journal.create({
      user: req.user.id,
      title,
      content: entry,
      sentiment,
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
