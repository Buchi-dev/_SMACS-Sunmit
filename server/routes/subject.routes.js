const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const auth = require('../middlewares/auth');

// Get all subjects
router.get('/', auth.protect, subjectController.getAllSubjects);

// Get subjects by faculty ID - more specific route should come before generic :id route
router.get('/faculty/:facultyId', auth.protect, subjectController.getSubjectsByFaculty);

// Get subject by ID
router.get('/:id', auth.protect, subjectController.getSubjectById);

// Create new subject
router.post('/', auth.protect, auth.authorize('admin', 'faculty'), subjectController.createSubject);

// Update subject
router.put('/:id', auth.protect, auth.authorize('admin', 'faculty'), subjectController.updateSubject);

// Delete subject
router.delete('/:id', auth.protect, auth.authorize('admin'), subjectController.deleteSubject);

module.exports = router; 