// controllers/calendarController.js
// Read-only calendar views built from existing journal entries.
// No changes to your existing controllers/models required.

const mongoose = require('mongoose');
const Journal = require('../model/journalModal');// <-- If your model is named Journal.js, change this to: require('../models/Journal');
;
const { isValidObjectId } = mongoose;

// Helper: resolve timezone with a safe default
function getTz(tzFromQuery) {
  // you can also pull a default from process.env.CAL_TZ
  return tzFromQuery || process.env.CAL_TZ || 'Asia/Kolkata';
}

// GET /api/calendar/month?month=YYYY-MM&tz=Asia/Kolkata
// Returns: { month, days: [{ dayKey, emoji, mood, count }] }
exports.getMonthOverview = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { month, tz } = req.query;
    const timezone = getTz(tz);
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: 'month=YYYY-MM required' });
    }

    // We’ll compute the month boundaries inside the pipeline using $dateTrunc
    // and compare strings (YYYY-MM) for safety.
    // Latest entry per day => sort by createdAt desc, then group by local-day string.
    const data = await Journal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

      // Compute the local day (string) and local month (string) for each entry
      {
        $addFields: {
          _localDayStr: {
            $dateToString: { date: '$createdAt', format: '%Y-%m-%d', timezone: timezone }
          },
          _localMonthStr: {
            $dateToString: { date: '$createdAt', format: '%Y-%m', timezone: timezone }
          }
        }
      },
      // Keep only docs in requested month
      { $match: { _localMonthStr: month } },

      // Sort so latest of the day comes first
      { $sort: { createdAt: -1 } },

      // Group by local day; take first (latest) for mood/emoji; count entries per day
      {
        $group: {
          _id: '$_localDayStr',
          dayKey: { $first: '$_localDayStr' },
          mood: { $first: '$mood' },
          emoji: { $first: '$emoji' },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, dayKey: 1, mood: 1, emoji: 1, count: 1 } },
      { $sort: { dayKey: 1 } }
    ]);

    return res.json({ month, days: data });
  } catch (err) {
    console.error('[getMonthOverview] error:', err);
    return res.status(500).json({ message: 'Failed to load calendar month' });
  }
};

// GET /api/calendar/day?date=YYYY-MM-DD&tz=Asia/Kolkata
// Returns: list of entries for that local day, newest first
exports.getEntriesByDay = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { date, tz } = req.query;
    const timezone = getTz(tz);
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'date=YYYY-MM-DD required' });
    }

    // Compute local day string and match in pipeline to avoid timezone bugs
    const entries = await Journal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $addFields: {
          _localDayStr: {
            $dateToString: { date: '$createdAt', format: '%Y-%m-%d', timezone: timezone }
          }
        }
      },
      { $match: { _localDayStr: date } },
      { $sort: { createdAt: -1 } }
    ]);

    return res.json(entries);
  } catch (err) {
    console.error('[getEntriesByDay] error:', err);
    return res.status(500).json({ message: 'Failed to load entries for day' });
  }
};
