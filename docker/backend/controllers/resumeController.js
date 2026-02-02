
const Resume = require('../models/Resume'); // Import the Resume model
const {
  resumeCreatedCounter, resumeCreationFailedCounter} = require('../metrics');

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Public
exports.createResume = async (req, res) => {
  try {
    const newResume = new Resume(req.body); // Create a new Resume instance with request body data
    const savedResume = await newResume.save(); // Save the new resume to the database
   resumeCreatedCounter.inc();
    res.status(201).json(savedResume); // Send back the saved resume with a 201 Created status
  } catch (error) {
      resumeCreationFailedCounter.inc();
    // Handle duplicate key error (e.g., if email is already in use due to 'unique' constraint)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A resume with this email already exists.', error: error.message });
    }
    // Handle Mongoose validation errors (e.g., required fields missing)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    console.error('Error creating resume:', error); // Log the full error for debugging
    res.status(500).json({ message: 'Server Error: Could not create resume', error: error.message });
  }
};

// @desc    Get all resumes
// @route   GET /api/resumes
// @access  Public
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find(); // Find all resumes in the database
    res.status(200).json(resumes); // Send them back with a 200 OK status
  } catch (error) {
    console.error('Error fetching all resumes:', error);
    res.status(500).json({ message: 'Server Error: Could not retrieve resumes', error: error.message });
  }
};

// @desc    Get a single resume by ID
// @route   GET /api/resumes/:id
// @access  Public
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id); // Find a single resume by its ID from the URL
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' }); // If no resume found, send 404
    }
    res.status(200).json(resume); // Send the found resume
  } catch (error) {
    console.error('Error fetching resume by ID:', error);
    // Handle invalid MongoDB ID format (e.g., ID is not 24 hex characters)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid resume ID format' });
    }
    res.status(500).json({ message: 'Server Error: Could not retrieve resume', error: error.message });
  }
};

// @desc    Update a resume by ID
// @route   PUT /api/resumes/:id
// @access  Public
exports.updateResume = async (req, res) => {
  try {
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id, // ID of the resume to update
      req.body,      // Data to update with
      { new: true, runValidators: true } // `new: true` returns the updated document; `runValidators: true` ensures schema validations run on update
    );

    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(updatedResume); // Send back the updated resume
  } catch (error) {
    console.error('Error updating resume:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid resume ID format' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A resume with this email already exists.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Server Error: Could not update resume', error: error.message });
  }
};

// @desc    Delete a resume by ID
// @route   DELETE /api/resumes/:id
// @access  Public
exports.deleteResume = async (req, res) => {
  try {
    const deletedResume = await Resume.findByIdAndDelete(req.params.id); // Find and delete a resume by ID
    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json({ message: 'Resume deleted successfully' }); // Confirm deletion
  } catch (error) {
    console.error('Error deleting resume:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid resume ID format' });
    }
    res.status(500).json({ message: 'Server Error: Could not delete resume', error: error.message });
  }
};
