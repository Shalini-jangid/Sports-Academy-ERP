// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, class: studentClass, sport, enrollmentId, linkedStudent, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate role-specific fields
    if (role === 'student' && (!studentClass || !sport || !enrollmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Class, sport, and enrollment ID are required for students'
      });
    }

    if (role === 'parent' && !linkedStudent) {
      return res.status(400).json({
        success: false,
        message: 'Linked student is required for parents'
      });
    }

    if ((role === 'coach' || role === 'admin') && !department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required for staff'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phone,
      class: studentClass,
      sport,
      enrollmentId,
      linkedStudent,
      department
    });

    // Remove password from output
    newUser.password = undefined;

    // Create token
    const token = signToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    // Remove password from output
    user.password = undefined;

    // Create token
    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};