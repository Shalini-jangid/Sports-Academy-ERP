// controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { sendSMS } = require('../config/twilio');

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, type, status, notes } = req.body;

    // Check if attendance already marked for this date and type
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: new Date(date),
      type
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this date and session type'
      });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date: new Date(date),
      type,
      status,
      notes,
      markedBy: req.user.id
    });

    // If absent and no leave, notify parent
    if (status === 'absent') {
      const student = await User.findById(studentId);
      const parent = await User.findOne({ 
        role: 'parent', 
        linkedStudent: studentId 
      });

      // Check if student has approved leave for this date
      const Leave = require('../models/Leave');
      const hasLeave = await Leave.findOne({
        student: studentId,
        startDate: { $lte: new Date(date) },
        endDate: { $gte: new Date(date) },
        status: 'approved'
      });

      if (!hasLeave && parent && parent.phone) {
        const message = `Alert: ${student.name} was absent from ${type} on ${date}.`;
        await sendSMS(parent.phone, message);
      }
    }

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    let studentId = req.user.id;
    
    // If parent is requesting, get their child's attendance
    if (req.user.role === 'parent') {
      const parent = await User.findById(req.user.id);
      studentId = parent.linkedStudent;
    }

    const { startDate, endDate } = req.query;
    let query = { student: studentId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    // Calculate attendance summary
    const totalSessions = attendance.length;
    const presentSessions = attendance.filter(a => a.status === 'present').length;
    const absentSessions = attendance.filter(a => a.status === 'absent').length;
    const leaveSessions = attendance.filter(a => a.status === 'leave').length;

    res.status(200).json({
      success: true,
      data: {
        attendance,
        summary: {
          totalSessions,
          presentSessions,
          absentSessions,
          leaveSessions,
          attendancePercentage: totalSessions > 0 ? (presentSessions / totalSessions * 100).toFixed(2) : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSportAttendance = async (req, res) => {
  try {
    const { date, sport } = req.query;
    const targetSport = sport || req.user.sport;

    const students = await User.find({ 
      role: 'student', 
      sport: targetSport 
    });

    const studentIds = students.map(student => student._id);

    const attendance = await Attendance.find({
      student: { $in: studentIds },
      date: new Date(date)
    }).populate('student', 'name class enrollmentId');

    // Create a complete roster with attendance status
    const roster = students.map(student => {
      const studentAttendance = attendance.find(a => 
        a.student._id.toString() === student._id.toString()
      );
      
      return {
        student: {
          _id: student._id,
          name: student.name,
          class: student.class,
          enrollmentId: student.enrollmentId
        },
        attendance: studentAttendance ? {
          status: studentAttendance.status,
          notes: studentAttendance.notes,
          markedBy: studentAttendance.markedBy
        } : null
      };
    });

    res.status(200).json({
      success: true,
      data: roster
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};