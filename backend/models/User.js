// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'parent', 'coach', 'admin'],
    required: true
  },
  phone: {
    type: String,
    sparse: true
  },
  class: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  sport: {
    type: String,
    required: function() { return this.role === 'student' || this.role === 'coach'; }
  },
  enrollmentId: {
    type: String,
    unique: true,
    sparse: true,
    required: function() { return this.role === 'student'; }
  },
  linkedStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.role === 'parent'; }
  },
  department: {
    type: String,
    required: function() { return this.role === 'coach' || this.role === 'admin'; }
  },
  leaveBalance: {
    type: Number,
    default: 15
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);