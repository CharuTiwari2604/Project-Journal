const mongoose = require('mongoose');
const Journal = require('../model/journalModal');// <-- If your model is named Journal.js, change this to: require('../models/Journal');
;
const { isValidObjectId } = mongoose;

function getTz(tzFromQuery) {
  return tzFromQuery || process.env.CAL_TZ || 'Asia/Kolkata';
}

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

    const data = await Journal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

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
      { $match: { _localMonthStr: month } },

      // Sort so latest of the day comes first
      { $sort: { createdAt: -1 } },

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
