const mongoose = require('mongoose');

// Define sub-schema for education entries
const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  years: { // e.g., "2018 - 2022" or "2020 - Present"
    type: String,
    required: true,
  },
  score: { // New score field
    type: String,
    required: false, // Make it optional
  },
  description: { // e.g., honors, relevant coursework
    type: String,
    required: false,
  },
});

// Define sub-schema for experience entries
const ExperienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  years: { // e.g., "Jan 2020 - Dec 2023" or "March 2022 - Present"
    type: String,
    required: true,
  },
  description: { // e.g., responsibilities, achievements
    type: String,
    required: false,
  },
});

// Define sub-schema for certificate entries
const CertificateSchema = new mongoose.Schema({
  name: { // Name of the certificate
    type: String,
    required: true,
  },
  issuingOrganization: { // Organization that issued the certificate
    type: String,
    required: true,
  },
  date: { // Date of issuance (e.g., "Oct 2023")
    type: String,
    required: false, // Make it optional
  },
});


// Main Resume Schema
const ResumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  title: { // Desired job title / professional title
    type: String,
    required: false,
  },
  summary: {
    type: String,
    required: false,
  },
  education: [EducationSchema], // Array of education entries
  experience: [ExperienceSchema], // Array of experience entries
  certificates: [CertificateSchema], // New array of certificate entries
  skills: { // Storing as an array of strings (parsed from comma-separated input)
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);