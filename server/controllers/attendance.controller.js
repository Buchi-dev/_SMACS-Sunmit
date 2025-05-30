const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status, arrivalTime, notes } = req.body;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
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

    // Format date (remove time portion)
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    // Check if attendance record already exists for this student, subject, and date
    let attendance = await Attendance.findOne({
      studentId,
      subjectId,
      date: formattedDate
    });

    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.arrivalTime = arrivalTime || attendance.arrivalTime;
      attendance.notes = notes || attendance.notes;
      attendance.markedBy = req.user._id;
      
      await attendance.save();
      
      return res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: attendance
      });
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        studentId,
        subjectId,
        date: formattedDate,
        status,
        arrivalTime: arrivalTime || null,
        notes: notes || '',
        markedBy: req.user._id
      });
      
      return res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendance
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Get attendance records with filtering options
exports.getAttendance = async (req, res) => {
  try {
    const { date, subjectId, class: className, startDate, endDate } = req.query;
    
    const query = {};
    
    // Filter by date
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      query.date = selectedDate;
    } else if (startDate && endDate) {
      // Date range filter
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      query.date = { $gte: start, $lte: end };
    }
    
    // Filter by subject
    if (subjectId) {
      query.subjectId = subjectId;
    }
    
    // Filter by class
    if (className) {
      // Find all students in the specified class
      const students = await Student.find({ class: className });
      const studentIds = students.map(student => student._id);
      
      query.studentId = { $in: studentIds };
    }
    
    // Perform the query with population
    const attendance = await Attendance.find(query)
      .populate('studentId', 'rollNumber name class course')
      .populate('subjectId', 'code name')
      .populate('markedBy', 'username');
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// Get attendance by student ID
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, subjectId } = req.query;
    
    const query = { studentId };
    
    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      query.date = { $gte: start, $lte: end };
    }
    
    // Filter by subject
    if (subjectId) {
      query.subjectId = subjectId;
    }
    
    // Perform the query with population
    const attendance = await Attendance.find(query)
      .populate('subjectId', 'code name')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance records',
      error: error.message
    });
  }
};

// Get attendance by subject ID
exports.getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { date, className } = req.query;
    
    const query = { subjectId };
    
    // Filter by date
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      query.date = selectedDate;
    }
    
    // Filter by class
    if (className) {
      // Find all students in the specified class
      const students = await Student.find({ class: className });
      const studentIds = students.map(student => student._id);
      
      query.studentId = { $in: studentIds };
    }
    
    // Perform the query with population
    const attendance = await Attendance.find(query)
      .populate('studentId', 'rollNumber name class course')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject attendance records',
      error: error.message
    });
  }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, arrivalTime, notes } = req.body;
    
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      {
        status,
        arrivalTime: arrivalTime || null,
        notes: notes || '',
        markedBy: req.user._id
      },
      { new: true, runValidators: true }
    );
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance record',
      error: error.message
    });
  }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res) => {
  try {
    const { subjectId, className, startDate, endDate } = req.query;
    
    // Validate required parameters
    if (!subjectId && !className) {
      return res.status(400).json({
        success: false,
        message: 'Either subjectId or className is required'
      });
    }
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate are required'
      });
    }
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    let matchStage = {
      date: { $gte: start, $lte: end }
    };
    
    // Add filters
    if (subjectId) {
      matchStage.subjectId = mongoose.Types.ObjectId(subjectId);
    }
    
    if (className) {
      // Find all students in the specified class
      const students = await Student.find({ class: className });
      const studentIds = students.map(student => student._id);
      
      matchStage.studentId = { $in: studentIds.map(id => mongoose.Types.ObjectId(id)) };
    }
    
    // Aggregate to get statistics
    const stats = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          present: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'present'] }, '$count', 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'absent'] }, '$count', 0]
            }
          },
          total: { $sum: '$count' }
        }
      },
      {
        $project: {
          date: '$_id',
          present: '$present',
          absent: '$absent',
          total: '$total',
          percentage: {
            $multiply: [
              { $divide: ['$present', '$total'] },
              100
            ]
          },
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);
    
    // Calculate overall statistics
    const totalRecords = stats.reduce((acc, curr) => acc + curr.total, 0);
    const totalPresent = stats.reduce((acc, curr) => acc + curr.present, 0);
    const totalAbsent = stats.reduce((acc, curr) => acc + curr.absent, 0);
    const overallPercentage = totalRecords > 0 
      ? (totalPresent / totalRecords) * 100 
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        dailyStats: stats,
        summary: {
          totalRecords,
          totalPresent,
          totalAbsent,
          overallPercentage
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics',
      error: error.message
    });
  }
};

// Get recent check-ins
exports.getRecentCheckins = async (req, res) => {
  try {
    // Get current date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find attendance records marked today with 'present' status
    const recentCheckins = await Attendance.find({
      date: { $gte: today },
      status: 'present'
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('studentId', 'rollNumber name course class')
      .populate('subjectId', 'name');
    
    res.status(200).json({
      success: true,
      count: recentCheckins.length,
      data: recentCheckins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent check-ins',
      error: error.message
    });
  }
}; 