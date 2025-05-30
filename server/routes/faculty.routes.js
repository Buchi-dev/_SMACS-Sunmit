const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const auth = require('../middlewares/auth');

// Get all faculty
router.get('/', auth.protect, facultyController.getAllFaculty);

// Get faculty by ID
router.get('/:id', auth.protect, facultyController.getFacultyById);

// Create new faculty
router.post('/', auth.protect, auth.authorize('admin'), facultyController.createFaculty);

// Update faculty
router.put('/:id', auth.protect, auth.authorize('admin'), facultyController.updateFaculty);

// Delete faculty
router.delete('/:id', auth.protect, auth.authorize('admin'), facultyController.deleteFaculty);

module.exports = router; 