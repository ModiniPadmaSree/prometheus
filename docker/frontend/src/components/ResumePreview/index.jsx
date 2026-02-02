import React, { forwardRef } from 'react';
import styles from './ResumePreview.module.css';

const ResumePreview = forwardRef(({ formData }, ref) => {
  return (
    <div ref={ref} className={styles.preview}>
      <h1 className={styles.name}>{formData.name || 'Your Name'}</h1>

      <p className={styles.contact}>
        {formData.email} | {formData.phone}
        {formData.title && ` | ${formData.title}`}
      </p>

      {formData.summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <p>{formData.summary}</p>
        </section>
      )}

      {formData.education?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {formData.education.map((edu, i) => (
            <div key={i} className={styles.entry}>
              <h3 className={styles.entryTitle}>{edu.course}</h3>
              <p className={styles.entrySubtitle}>
                {edu.collegeName} | {edu.startYear} – {edu.endYear}
              </p>
            </div>
          ))}
        </section>
      )}

      {formData.experience?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {formData.experience.map((exp, i) => (
            <div key={i} className={styles.entry}>
              <h3 className={styles.entryTitle}>{exp.role}</h3>
              <p className={styles.entrySubtitle}>
                {exp.companyName} | {exp.startDate} – {exp.endDate}
              </p>
            </div>
          ))}
        </section>
      )}

      {formData.certificates?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Certificates</h2>
          {formData.certificates.map((cert, i) => (
            <div key={i} className={styles.entry}>
              <h3 className={styles.entryTitle}>{cert.name}</h3>
              <p className={styles.entrySubtitle}>
                {cert.issuingOrganization}
                {cert.date && ` | ${cert.date}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {formData.skills && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <p>{formData.skills}</p>
        </section>
      )}
    </div>
  );
});

export default ResumePreview;
