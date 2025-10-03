// controllers/userController.js
const User = require('../models/User');

exports.getStudents = async (req, res) => {
  try {
    const { sport } = req.query;
    let query = { role: 'student' };

    if (sport) {
      query.sport = sport;
    }

    // If coach, only show students in their sport
    if (req.user.role === 'coach') {
      query.sport = req.user.sport;
    }

    const students = await User.find(query)
      .select('name email class sport enrollmentId leaveBalance')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ['coach', 'admin'] }
    }).select('name email role sport department');

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateLeaveBalance = async (req, res) => {
  try {
    const { studentId, leaveBalance } = req.body;

    const student = await User.findOneAndUpdate(
      { _id: studentId, role: 'student' },
      { leaveBalance },
      { new: true }
    ).select('name email class sport enrollmentId leaveBalance');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};