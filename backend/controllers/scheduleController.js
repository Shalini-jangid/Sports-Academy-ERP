// controllers/scheduleController.js
const TrainingSchedule = require('../models/training');

exports.getSchedule = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      query.sport = req.user.sport;
    } else if (req.user.role === 'coach') {
      query.coach = req.user.id;
    }

    const schedule = await TrainingSchedule.find(query)
      .populate('coach', 'name')
      .sort({ day: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { sport, day, startTime, endTime, location } = req.body;

    const schedule = await TrainingSchedule.create({
      sport,
      day,
      startTime,
      endTime,
      location,
      coach: req.user.id
    });

    await schedule.populate('coach', 'name');

    res.status(201).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};