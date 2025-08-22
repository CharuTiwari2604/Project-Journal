const router = require('express').Router();
const { getMonthOverview, getEntriesByDay } = require('../controller/calenderController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/month', authMiddleware, getMonthOverview);
router.get('/day', authMiddleware, getEntriesByDay);

module.exports = router;
