const User = require('../models/userModels.js');
const jwt = require('jsonwebtoken');

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, 
    { expiresIn: '30d' });
};

// @desc Register user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Try to create the user
    const user = new User({ name, email, password });
    const savedUser = await user.save();

    // Check if saved successfully
    if (!savedUser || !savedUser._id) {
      return res.status(500).json({ message: 'User creation failed. Could not save to database.' });
    }

    // Return success response
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      token: generateToken(savedUser._id, savedUser.role)
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      message: 'Internal server error during registration',
      error: error.message || 'Unknown error'
    });
  }
};


// @desc Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

// @desc Get current user
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json(user);
};
