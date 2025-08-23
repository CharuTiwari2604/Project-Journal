const express = require('express');
const journalRouter = express.Router();
const Journal =require('../model/journalModal');
const authMiddleware = require('../middleware/authMiddleware');
const { createJournal } = require('../controller/journalController');
const { getProfileWithJournals, updateUsername } = require('../controller/profilepageController');

journalRouter.get('/profile', authMiddleware, getProfileWithJournals);
journalRouter.post('/', authMiddleware, createJournal);
journalRouter.put("/update", authMiddleware, updateUsername);

journalRouter.delete('/:id', authMiddleware, async (req, res) => {

  try {
    const deleted = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, 
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Journal not found or unauthorized' });
    }
    res.json({ message: 'Journal deleted successfully' });
  } catch (err) {
    console.error('Error deleting journal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = journalRouter;
