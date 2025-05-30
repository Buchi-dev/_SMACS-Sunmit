const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middlewares/auth');

// Get class report
router.get('/class/:className', auth.protect, reportController.getClassReport);

// Get subject report
router.get('/subject/:subjectId', auth.protect, reportController.getSubjectReport);

// Get student report
router.get('/student/:studentId', auth.protect, reportController.getStudentReport);

// Get attendance summary
router.get('/summary', auth.protect, reportController.getAttendanceSummary);

// Export reports
router.post('/export', auth.protect, reportController.exportReport);

module.exports = router; 