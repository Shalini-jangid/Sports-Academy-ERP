// models/TrainingSchedule.js
const mongoose = require('mongoose');

const trainingScheduleSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TrainingSchedule', trainingScheduleSchema);