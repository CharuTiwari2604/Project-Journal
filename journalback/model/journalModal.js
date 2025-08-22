// correct
const mongoose = require('mongoose');
const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required:true
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    emoji: String,
    label: String
  },
  sentiment: {
    label: { type: String, default: "neutral" },
    score: { type: Number, default: 0 }
  },
  analysis: {
    type: String,
    default: ""
  },
createdAt: {type:Date, default: Date.now}
})

module.exports = mongoose.model("Journal", journalSchema);
