const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const { code, name, status } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (code) filter.code = { $regex: code, $options: 'i' };
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (status) filter.status = status;
    
    const subjects = await Subject.find(filter).sort({ code: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get subjects by faculty ID
exports.getSubjectsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty && facultyId !== 'undefined') {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }
    
    // Find subjects by faculty ID
    const subjects = await Subject.find({ facultyId }).sort({ code: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Error fetching subjects by faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new subject
exports.createSubject = async (req, res) => {
  try {
    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ code: req.body.code });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this code already exists'
      });
    }
    
    // Create new subject
    const subject = await Subject.create(req.body);
    
    // If faculty is assigned, update faculty's subjects array
    if (req.body.facultyId) {
      await Faculty.findByIdAndUpdate(
        req.body.facultyId,
        { $addToSet: { subjects: subject.name } },
        { new: true }
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    // Find subject
    let subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // Check if current user is admin or the assigned faculty
    if (req.user.role !== 'admin' && subject.facultyId && 
        subject.facultyId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this subject'
      });
    }
    
    // If faculty is being changed, update both old and new faculty's subjects array
    if (req.body.facultyId && subject.facultyId && 
        req.body.facultyId !== subject.facultyId.toString()) {
      // Remove subject from old faculty's subjects array
      await Faculty.findByIdAndUpdate(
        subject.facultyId,
        { $pull: { subjects: subject.name } },
        { new: true }
      );
      
      // Add subject to new faculty's subjects array
      await Faculty.findByIdAndUpdate(
        req.body.facultyId,
        { $addToSet: { subjects: req.body.name || subject.name } },
        { new: true }
      );
    }
    
    // Update subject
    subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    // Find subject
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // If subject has assigned faculty, update faculty's subjects array
    if (subject.facultyId) {
      await Faculty.findByIdAndUpdate(
        subject.facultyId,
        { $pull: { subjects: subject.name } },
        { new: true }
      );
    }
    
    // Delete subject
    await Subject.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 