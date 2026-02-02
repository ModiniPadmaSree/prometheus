import React, { useState } from 'react';
import styles from './ResumeForm.module.css';
import Suggestions from '../Suggestions';

const ResumeForm = ({ formData, setFormData }) => {
  const [currentField, setCurrentField] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducation = [...formData.education];
    newEducation[index] = {
      ...newEducation[index],
      [name]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      education: newEducation,
    }));
  };

  const handleAddEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        // Add new empty fields including score
        { startYear: '', endYear: '', course: '', collegeName: '', score: '', description: '' },
      ],
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperience = [...formData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [name]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      experience: newExperience,
    }));
  };

  const handleAddExperience = () => {
    setFormData((prevData) => ({
      ...prevData,
      experience: [
        ...prevData.experience,
        { startDate: '', endDate: '', companyName: '', role: '', description: '' },
      ],
    }));
  };

  const handleRemoveExperience = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      experience: prevData.experience.filter((_, i) => i !== index),
    }));
  };

  // Handler for changes within Certificate entries
  const handleCertificateChange = (index, e) => {
    const { name, value } = e.target;
    const newCertificates = [...formData.certificates];
    newCertificates[index] = {
      ...newCertificates[index],
      [name]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      certificates: newCertificates,
    }));
  };

  // Function to add a new empty certificate entry
  const handleAddCertificate = () => {
    setFormData((prevData) => ({
      ...prevData,
      certificates: [
        ...prevData.certificates,
        { name: '', issuingOrganization: '', date: '' },
      ],
    }));
  };

  // Function to remove a certificate entry by its index
  const handleRemoveCertificate = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      certificates: prevData.certificates.filter((_, i) => i !== index),
    }));
  };

  const formatDataForBackend = (data) => {
    const formattedEducation = data.education.map(edu => ({
      degree: edu.course,
      institution: edu.collegeName,
      years: `${edu.startYear || ''}-${edu.endYear || ''}`.trim().replace(/^-|-$/g, ''),
      score: edu.score, // Map new score field
      description: edu.description,
    }));

    const formattedExperience = data.experience.map(exp => ({
      title: exp.role,
      company: exp.companyName,
      years: `${exp.startDate || ''}-${exp.endDate || ''}`.trim().replace(/^-|-$/g, ''),
      description: exp.description,
    }));

    // Format new certificates data
    const formattedCertificates = data.certificates.map(cert => ({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      date: cert.date,
    }));

    const parsedSkills = data.skills
      ? data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      title: data.title,
      summary: data.summary,
      education: formattedEducation,
      experience: formattedExperience,
      certificates: formattedCertificates, // Include formatted certificates
      skills: parsedSkills,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const dataToSend = formatDataForBackend(formData);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/resumes`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Resume saved successfully!');
      } else {
        setMessage(`Error saving resume: ${result.message || 'Unknown error'}`);
        console.error('API Error Response:', result);
      }
    } catch (error) {
      setMessage('Network error: Could not connect to the server. Please ensure the backend is running.');
      console.error('Fetch operation failed:', error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Resume Details</h2>
      <label>
        Full Name <span className={styles.required}>*</span>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Email <span className={styles.required}>*</span>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Phone
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
      </label>
      <label>
        Title / Desired Role
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </label>
      <label>
        Summary
        <textarea name="summary" value={formData.summary} onChange={handleChange} onFocus={() => setCurrentField('summary')} rows="4" />
        {currentField === 'summary' && <Suggestions field="summary" />}
      </label>
      <section className={styles.section}>
        <h3>Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className={styles.entryBlock}>
            <h4>Education Entry #{index + 1}</h4>
            <label>
              Course/Degree
              <input type="text" name="course" value={edu.course || ''} onChange={(e) => handleEducationChange(index, e)} />
            </label>
            <label>
              College/Institution
              <input type="text" name="collegeName" value={edu.collegeName || ''} onChange={(e) => handleEducationChange(index, e)} />
            </label>
            <div className={styles.dateInputs}>
              <label>
                Start Year
                <input type="text" name="startYear" value={edu.startYear || ''} onChange={(e) => handleEducationChange(index, e)} placeholder="YYYY" />
              </label>
              <label>
                End Year
                <input type="text" name="endYear" value={edu.endYear || ''} onChange={(e) => handleEducationChange(index, e)} placeholder="YYYY (or 'Present')" />
              </label>
            </div>
            <label>
              Score (e.g., GPA, Percentage)
              <input type="text" name="score" value={edu.score || ''} onChange={(e) => handleEducationChange(index, e)} placeholder="e.g., 3.8/4.0, 92%" />
            </label>
            <label>
              Description (e.g., Honors, relevant coursework)
              <textarea name="description" value={edu.description || ''} onChange={(e) => handleEducationChange(index, e)} rows="2"></textarea>
            </label>
            <button type="button" onClick={() => handleRemoveEducation(index)} className={styles.removeBtn}>
              Remove Education
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddEducation} className={styles.addBtn}>
          Add Education
        </button>
        {currentField === 'education' && <Suggestions field="education" />}
      </section>
      <section className={styles.section}>
        <h3>Experience</h3>
        {formData.experience.map((exp, index) => (
          <div key={index} className={styles.entryBlock}>
            <h4>Experience Entry #{index + 1}</h4>
            <label>
              Company Name
              <input type="text" name="companyName" value={exp.companyName || ''} onChange={(e) => handleExperienceChange(index, e)} />
            </label>
            <label>
              Role/Job Title
              <input type="text" name="role" value={exp.role || ''} onChange={(e) => handleExperienceChange(index, e)} />
            </label>
            <div className={styles.dateInputs}>
              <label>
                Start Date
                <input type="text" name="startDate" value={exp.startDate || ''} onChange={(e) => handleExperienceChange(index, e)} placeholder="Month YYYY" />
              </label>
              <label>
                End Date
                <input type="text" name="endDate" value={exp.endDate || ''} onChange={(e) => handleExperienceChange(index, e)} placeholder="Month YYYY (or 'Present')" />
              </label>
            </div>
            <label>
              Description (responsibilities, achievements)
              <textarea name="description" value={exp.description || ''} onChange={(e) => handleExperienceChange(index, e)} rows="4"></textarea>
            </label>
            <button type="button" onClick={() => handleRemoveExperience(index)} className={styles.removeBtn}>
              Remove Experience
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddExperience} className={styles.addBtn}>
          Add Experience
        </button>
        {currentField === 'experience' && <Suggestions field="experience" />}
      </section>
      <section className={styles.section}>
        <h3>Certificates</h3>
        {formData.certificates.map((cert, index) => (
          <div key={index} className={styles.entryBlock}>
            <h4>Certificate Entry #{index + 1}</h4>
            <label>
              Certificate Name
              <input type="text" name="name" value={cert.name || ''} onChange={(e) => handleCertificateChange(index, e)} />
            </label>
            <label>
              Issuing Organization
              <input type="text" name="issuingOrganization" value={cert.issuingOrganization || ''} onChange={(e) => handleCertificateChange(index, e)} />
            </label>
            <label>
              Date of Issuance
              <input type="text" name="date" value={cert.date || ''} onChange={(e) => handleCertificateChange(index, e)} placeholder="Month YYYY" />
            </label>
            <button type="button" onClick={() => handleRemoveCertificate(index)} className={styles.removeBtn}>
              Remove Certificate
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddCertificate} className={styles.addBtn}>
          Add Certificate
        </button>
        
      </section>
      <label>
        Skills (comma-separated, e.g., "JavaScript, React, Node.js")
        <textarea name="skills" value={formData.skills} onChange={handleChange} onFocus={() => setCurrentField('skills')} rows="3" />
        {currentField === 'skills' && <Suggestions field="skills" />}
      </label>
      <button type="submit" className={styles.saveBtn}>
        Save Resume
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
};

export default ResumeForm;