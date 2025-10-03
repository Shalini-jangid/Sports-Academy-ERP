// routes/attendance.js
const express = require('express');
const {
  markAttendance,
  getStudentAttendance,
  getSportAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/mark', authorize('coach', 'admin'), markAttendance);
router.get('/my-attendance', getStudentAttendance);
router.get('/sport', getSportAttendance);

module.exports = router;