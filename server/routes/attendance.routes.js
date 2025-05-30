const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { protect, authorize } = require('../middlewares/auth');

// Mark attendance
router.post('/', protect, attendanceController.markAttendance);

// Get attendance by date, subject, and class
router.get('/', protect, attendanceController.getAttendance);

// Get attendance by student ID
router.get('/student/:studentId', protect, attendanceController.getAttendanceByStudent);

// Get attendance by subject ID
router.get('/subject/:subjectId', protect, attendanceController.getAttendanceBySubject);

// Update attendance record
router.put('/:id', protect, attendanceController.updateAttendance);

// Get attendance statistics
router.get('/stats', protect, attendanceController.getAttendanceStats);

// Get recent check-ins
router.get('/recent-checkins', protect, attendanceController.getRecentCheckins);

module.exports = router; 