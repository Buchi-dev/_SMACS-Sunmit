const Faculty = require('../models/Faculty');
const User = require('../models/User');

// Get all faculty members
exports.getAllFaculty = async (req, res) => {
  try {
    const { name, department, status } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (department) filter.department = department;
    if (status) filter.status = status;
    
    const faculty = await Faculty.find(filter).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get faculty member by ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Error fetching faculty by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new faculty member
exports.createFaculty = async (req, res) => {
  try {
    // Check if employee ID already exists
    const existingFaculty = await Faculty.findOne({ employeeId: req.body.employeeId });
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: 'Faculty with this employee ID already exists'
      });
    }
    
    // Create new faculty
    const faculty = await Faculty.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Faculty member created successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update faculty member
exports.updateFaculty = async (req, res) => {
  try {
    // Find faculty member
    let faculty = await Faculty.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }
    
    // Update faculty
    faculty = await Faculty.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    // If faculty has a user account, update status if changed
    if (faculty.userId && req.body.status) {
      await User.findByIdAndUpdate(
        faculty.userId,
        { status: req.body.status },
        { new: true }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Faculty member updated successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete faculty member
exports.deleteFaculty = async (req, res) => {
  try {
    // Find faculty member
    const faculty = await Faculty.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }
    
    // Check if faculty has associated user account
    if (faculty.userId) {
      // Delete associated user account
      await User.findByIdAndDelete(faculty.userId);
    }
    
    // Delete faculty
    await Faculty.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Faculty member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 