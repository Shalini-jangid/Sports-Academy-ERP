// routes/schedule.js
const express = require('express');
const {
  getSchedule,
  createSchedule
} = require('../controllers/scheduleController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/', getSchedule);
router.post('/', authorize('coach', 'admin'), createSchedule);

module.exports = router;