const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect, authorize } = require('../middlewares/auth');

// Get all students - accessible by admin and faculty
router.get('/', protect, studentController.getAllStudents);

// Get student by ID
router.get('/:id', protect, studentController.getStudentById);

// Create a new student - accessible by admin only
router.post('/', protect, authorize('admin'), studentController.createStudent);

// Update student - accessible by admin only
router.put('/:id', protect, authorize('admin'), studentController.updateStudent);

// Delete student - accessible by admin only
router.delete('/:id', protect, authorize('admin'), studentController.deleteStudent);

// Get students by class
router.get('/class/:class', protect, studentController.getStudentsByClass);

// Get students by subject
router.get('/subject/:subjectId', protect, studentController.getStudentsBySubject);

// Get student by NFC ID
router.get('/nfc/:nfcId', protect, studentController.getStudentByNfcId);

module.exports = router; 