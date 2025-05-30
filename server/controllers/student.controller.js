const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    let query = {};
    
    // Filter options
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    if (req.query.year) {
      query.year = req.query.year;
    }
    
    if (req.query.course) {
      query.course = req.query.course;
    }
    
    if (req.query.class) {
      query.class = req.query.class;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.subject) {
      query.subjects = { $in: [req.query.subject] };
    }
    
    if (req.query.nfcId) {
      query.nfcId = { $regex: req.query.nfcId, $options: 'i' };
    }
    
    const students = await Student.find(query);
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    // Check if roll number or NFC ID already exists
    const existingStudent = await Student.findOne({
      $or: [
        { rollNumber: req.body.rollNumber },
        { nfcId: req.body.nfcId }
      ]
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number or NFC ID already exists'
      });
    }
    
    const student = await Student.create(req.body);
    
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    // Check if roll number or NFC ID already exists for another student
    if (req.body.rollNumber || req.body.nfcId) {
      const existingStudent = await Student.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          {
            $or: [
              { rollNumber: req.body.rollNumber },
              { nfcId: req.body.nfcId }
            ]
          }
        ]
      });
      
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Student with this roll number or NFC ID already exists'
        });
      }
    }
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// Get students by class
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.class });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students by class',
      error: error.message
    });
  }
};

// Get students by subject
exports.getStudentsBySubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    const students = await Student.find({ subjects: { $in: [subject.name] } });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students by subject',
      error: error.message
    });
  }
};

// Get student by NFC ID
exports.getStudentByNfcId = async (req, res) => {
  try {
    const student = await Student.findOne({ nfcId: req.params.nfcId });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student by NFC ID',
      error: error.message
    });
  }
}; 