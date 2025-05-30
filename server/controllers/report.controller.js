const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Get class report
exports.getClassReport = async (req, res) => {
  try {
    const { className } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startDate and endDate'
      });
    }
    
    // Find all subjects for this class
    const subjects = await Subject.find({ class: className });
    
    // Get all students in the class
    const students = await Student.find({ class: className });
    
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found in this class'
      });
    }
    
    // Prepare report data for each subject
    const reportData = [];
    
    for (const subject of subjects) {
      // Get attendance records for this subject within date range
      const attendanceRecords = await Attendance.find({
        subjectId: subject._id,
        date: { $gte: startDate, $lte: endDate }
      });
      
      // Calculate statistics
      const totalStudents = students.length;
      const presentCount = new Set(attendanceRecords.map(record => record.studentId)).size;
      const absentCount = totalStudents - presentCount;
      const attendancePercentage = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;
      
      reportData.push({
        subjectId: subject._id,
        subjectName: subject.name,
        subjectCode: subject.code,
        className,
        totalStudents,
        presentCount,
        absentCount,
        attendancePercentage
      });
    }
    
    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Error generating class report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get subject report
exports.getSubjectReport = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startDate and endDate'
      });
    }
    
    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // Get all students enrolled in the subject
    const students = await Student.find({ subjects: subject.name });
    
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found for this subject'
      });
    }
    
    // Get attendance records for each date within range
    const dates = getDatesInRange(new Date(startDate), new Date(endDate));
    const reportData = [];
    
    for (const date of dates) {
      const formattedDate = date.toISOString().split('T')[0];
      
      // Get attendance records for this date
      const attendanceRecords = await Attendance.find({
        subjectId,
        date: formattedDate
      });
      
      // Calculate statistics
      const totalStudents = students.length;
      const presentCount = attendanceRecords.length;
      const absentCount = totalStudents - presentCount;
      const attendancePercentage = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;
      
      reportData.push({
        date: formattedDate,
        subjectId,
        subjectName: subject.name,
        className: subject.class || 'N/A',
        totalStudents,
        presentCount,
        absentCount,
        attendancePercentage
      });
    }
    
    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Error generating subject report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get student report
exports.getStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, subjectId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startDate and endDate'
      });
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Define filter for attendance records
    const filter = {
      studentId,
      date: { $gte: startDate, $lte: endDate }
    };
    
    // Add subject filter if provided
    if (subjectId) {
      filter.subjectId = subjectId;
    }
    
    // Get attendance records
    const attendanceRecords = await Attendance.find(filter);
    
    // Get subjects the student is enrolled in
    let subjects;
    if (subjectId) {
      subjects = await Subject.find({ _id: subjectId });
    } else {
      subjects = await Subject.find({ name: { $in: student.subjects } });
    }
    
    // Prepare report data
    const reportData = [];
    
    for (const subject of subjects) {
      // Get attendance records for this subject
      const subjectAttendance = attendanceRecords.filter(
        record => record.subjectId.toString() === subject._id.toString()
      );
      
      // Calculate total classes
      const dates = getDatesInRange(new Date(startDate), new Date(endDate));
      const totalClasses = dates.length; // This assumes classes are held every day - adjust as needed
      
      // Calculate statistics
      const presentCount = subjectAttendance.length;
      const absentCount = totalClasses - presentCount;
      const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      
      reportData.push({
        studentId,
        studentName: student.name,
        studentRollNumber: student.rollNumber,
        subjectId: subject._id,
        subjectName: subject.name,
        className: student.class,
        totalClasses,
        presentCount,
        absentCount,
        attendancePercentage
      });
    }
    
    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Error generating student report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get attendance summary
exports.getAttendanceSummary = async (req, res) => {
  try {
    // Get overall attendance statistics
    const totalAttendanceRecords = await Attendance.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    
    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.countDocuments({ date: today });
    
    // Get last 7 days attendance trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      
      const count = await Attendance.countDocuments({ date: formattedDate });
      last7Days.push({
        date: formattedDate,
        count
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalAttendanceRecords,
        totalStudents,
        totalSubjects,
        todayAttendance,
        last7Days
      }
    });
  } catch (error) {
    console.error('Error generating attendance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Export report
exports.exportReport = async (req, res) => {
  try {
    const { type, format, id, startDate, endDate } = req.body;
    
    if (!type || !format) {
      return res.status(400).json({
        success: false,
        message: 'Please provide report type and format'
      });
    }
    
    // Here you would generate the actual report file (Excel, PDF, etc.)
    // For now, we'll just return a success message
    
    res.status(200).json({
      success: true,
      message: `${type} report exported successfully in ${format} format`,
      downloadUrl: `/api/reports/download/${type}_${id}_${startDate}_${endDate}.${format}`
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to get all dates in a range
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
} 