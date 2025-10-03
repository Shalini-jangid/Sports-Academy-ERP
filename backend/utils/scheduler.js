// utils/scheduler.js
const cron = require('node-cron');
const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendSMS } = require('../config/twilio');

// Check for pending leave requests every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running leave reminder scheduler...');
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const pendingLeaves = await Leave.find({
      status: 'pending',
      createdAt: { $lte: twentyFourHoursAgo },
      reminderSent: false
    }).populate('student');

    for (const leave of pendingLeaves) {
      // Find coach for the student's sport
      const coach = await User.findOne({
        role: 'coach',
        sport: leave.student.sport
      });

      if (coach && coach.phone) {
        const message = `Reminder: Leave request from ${leave.student.name} is pending for more than 24 hours. Please review.`;
        await sendSMS(coach.phone, message);
        
        leave.reminderSent = true;
        await leave.save();
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
});

// Generate weekly attendance reports every Sunday at 6 PM
cron.schedule('0 18 * * 0', async () => {
  try {
    console.log('Generating weekly attendance reports...');
    
    const coaches = await User.find({ role: 'coach' });
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const Attendance = require('../models/Attendance');
    
    for (const coach of coaches) {
      const students = await User.find({
        role: 'student',
        sport: coach.sport
      });
      
      const studentIds = students.map(s => s._id);
      
      const attendanceData = await Attendance.find({
        student: { $in: studentIds },
        date: { $gte: oneWeekAgo }
      }).populate('student', 'name class');
      
      // Generate report summary
      const report = students.map(student => {
        const studentAttendance = attendanceData.filter(a => 
          a.student._id.toString() === student._id.toString()
        );
        
        const presentCount = studentAttendance.filter(a => a.status === 'present').length;
        const totalCount = studentAttendance.length;
        
        return {
          student: student.name,
          class: student.class,
          presentSessions: presentCount,
          totalSessions: totalCount,
          attendanceRate: totalCount > 0 ? (presentCount / totalCount * 100).toFixed(2) : 0
        };
      });
      
      // In a real implementation, send this report via email
      console.log(`Weekly report for ${coach.sport}:`, report);
    }
  } catch (error) {
    console.error('Weekly report generation error:', error);
  }
});