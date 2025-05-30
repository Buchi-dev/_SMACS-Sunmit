const User = require('../models/User');
const Faculty = require('../models/Faculty');
const jwt = require('jsonwebtoken');
const config = require('../configs/config');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, name, phone } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'faculty'
    });

    await user.save();

    // If role is faculty, create faculty record
    if (role === 'faculty') {
      const faculty = new Faculty({
        employeeId: username, // Using username as employeeId for simplicity
        name,
        email,
        phone,
        department: req.body.department || 'General',
        qualification: req.body.qualification || 'Not specified',
        joiningDate: new Date().toISOString().split('T')[0], // Today's date
        subjects: [],
        userId: user._id
      });

      await faculty.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};

// Register a user account for an existing faculty member
exports.registerFaculty = async (req, res) => {
  try {
    const { username, email, password, existingFacultyId } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }

    // Check if faculty exists
    const faculty = await Faculty.findById(existingFacultyId);
    if (!faculty) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty not found' 
      });
    }

    // Check if faculty already has a user account
    if (faculty.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'This faculty member already has a user account' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: 'faculty'
    });

    await user.save();

    // Update faculty with user ID
    faculty.userId = user._id;
    await faculty.save();

    res.status(201).json({
      success: true,
      message: 'User account created successfully for faculty member',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Faculty registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user account', 
      error: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is inactive. Please contact administrator.' 
      });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during login', 
      error: error.message 
    });
  }
}; 