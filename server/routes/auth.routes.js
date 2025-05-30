const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Register a user account for existing faculty (admin only)
router.post('/register-faculty', auth.protect, auth.authorize('admin'), authController.registerFaculty);

module.exports = router; 