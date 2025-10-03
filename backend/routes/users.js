// routes/users.js
const express = require('express');
const {
  getStudents,
  getStaff,
  updateLeaveBalance
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/students', getStudents);
router.get('/staff', authorize('coach', 'admin'), getStaff);
router.patch('/leave-balance', authorize('admin'), updateLeaveBalance);

module.exports = router;