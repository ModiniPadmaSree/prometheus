import React from 'react';
import styles from './Suggestions.module.css'; // Make sure to define styles in this CSS module

const Suggestions = ({ field }) => {
  const tips = {
    summary: [
      "Keep it concise — 2-3 lines max.",
      "Mention your core strengths and goals.",
      "Use action words like 'driven', 'motivated', 'experienced'."
    ],
    skills: [
      "List both technical and soft skills.",
      "Separate by commas: JavaScript, React, Node.js, Leadership",
      "Prioritize skills relevant to the job you're applying for."
    ],
    experience: [
      "Use bullet points for clarity.",
      "Start each point with an action verb.",
      "Quantify achievements: 'Increased sales by 25%'"
    ],
    education: [
      "Include degree, institution, and graduation year.",
      "Mention any honors or relevant coursework.",
      "List most recent first."
    ]
  };

  const suggestions = tips[field] || []; // Get suggestions based on the current field

  return (
    <div className={styles.suggestions}>
      <h4>Suggestions for {field.charAt(0).toUpperCase() + field.slice(1)}</h4>
      <ul>
        {suggestions.map((tip, index) => (
          <li key={index}>{tip}</li> // Render each tip as a list item
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;