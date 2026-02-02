
const express = require('express');
const router = express.Router(); // Create a new Express router instance
const resumeController = require('../controllers/resumeController'); // Import the controller functions

// Define routes for /api/resumes
// POST request to create a new resume
router.post('/', resumeController.createResume);

// GET request to retrieve all resumes
router.get('/', resumeController.getAllResumes);

// GET request to retrieve a single resume by its ID
router.get('/:id', resumeController.getResumeById);

// PUT request to update a resume by its ID
router.put('/:id', resumeController.updateResume);

// DELETE request to delete a resume by its ID
router.delete('/:id', resumeController.deleteResume);

module.exports = router; // Export the router so it can be used in server.js