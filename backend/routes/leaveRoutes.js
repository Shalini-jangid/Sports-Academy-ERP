// routes/leave.js
const express = require('express');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(protect);

router.post('/', upload.single('attachment'), applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/', authorize('coach', 'admin'), getAllLeaves);
router.patch('/:id/status', authorize('coach', 'admin'), updateLeaveStatus);

module.exports = router;