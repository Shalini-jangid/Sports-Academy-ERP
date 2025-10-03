// controllers/leaveController.js
const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendSMS } = require('../config/twilio');

exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const studentId = req.user.id;

    // Validate leave dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check if student has sufficient leave balance
    const student = await User.findById(studentId);
    if (student.leaveBalance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient leave balance'
      });
    }

    const leave = await Leave.create({
      student: studentId,
      type,
      startDate,
      endDate,
      reason,
      attachment: req.file ? req.file.path : undefined
    });

    // Notify parent via SMS
    if (req.user.role === 'student') {
      const parent = await User.findOne({ 
        role: 'parent', 
        linkedStudent: studentId 
      });
      
      if (parent && parent.phone) {
        const message = `Your child ${student.name} has applied for ${type} from ${startDate} to ${endDate}. Reason: ${reason}`;
        await sendSMS(parent.phone, message);
        
        // Update leave record
        leave.parentNotified = true;
        await leave.save();
      }
    }

    // Notify coach (in real implementation, this would be via email/notification system)
    console.log(`Leave application submitted for ${student.name}. Notifying coach...`);

    res.status(201).json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'parent') {
      const parent = await User.findById(req.user.id);
      query.student = parent.linkedStudent;
    }

    const leaves = await Leave.find(query)
      .populate('student', 'name email class sport')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const { status, sport } = req.query;
    let query = {};

    if (status) query.status = status;
    
    // If coach, only show leaves for students in their sport
    if (req.user.role === 'coach') {
      const students = await User.find({ 
        role: 'student', 
        sport: req.user.sport 
      });
      query.student = { $in: students.map(s => s._id) };
    }

    const leaves = await Leave.find(query)
      .populate('student', 'name email class sport')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const leave = await Leave.findById(id).populate('student');
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found'
      });
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    await leave.save();

    // Update student's leave balance if approved
    if (status === 'approved') {
      const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24));
      await User.findByIdAndUpdate(leave.student._id, {
        $inc: { leaveBalance: -days }
      });
    }

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};