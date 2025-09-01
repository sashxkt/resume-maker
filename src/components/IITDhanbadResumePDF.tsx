import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import type { ResumeForm } from '../app/make-resume/page';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: '0.45in', // reduced padding
    fontFamily: 'Helvetica',
    fontSize: 10, // slightly smaller font
    color: '#000000',
    lineHeight: 1.15, // tighter line spacing
  },
  // Header Section
  header: {
    textAlign: 'center',
    marginBottom: 12, // less space below header
    paddingBottom: 6, // less padding
    borderBottom: '1pt solid #000000',
  },
  name: {
    fontSize: 17, // smaller name
    fontWeight: 'bold',
    letterSpacing: 0.3,
    marginBottom: 4, // less space below name
    color: '#000000',
  },
  contactInfo: {
    fontSize: 9,
    color: '#000000',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, // less gap
  },
  contactItem: {
    marginHorizontal: 5, // less margin
  },
  // Section Headers
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 10,
    marginBottom: 5,
    paddingBottom: 1,
    borderBottom: '1pt solid #000000',
    color: '#000000',
  },
  // Education specific styles (typically first section in IIT format)
  educationContainer: {
    marginBottom: 8,
  },
  educationTable: {
    width: '100%',
    border: '1pt solid #000000',
  },
  educationRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #000000',
  },
  educationCell: {
    padding: 2,
    fontSize: 9,
    borderRight: '0.5pt solid #000000',
    flex: 1,
    textAlign: 'center',
  },
  educationHeaderCell: {
    padding: 2,
    fontSize: 9,
    borderRight: '0.5pt solid #000000',
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  },
  // Experience/Work Section
  experienceItem: {
    marginBottom: 6,
    paddingLeft: 3,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'italic',
    color: '#000000',
  },
  dateRange: {
    fontSize: 9,
    color: '#000000',
  },
  description: {
    fontSize: 9,
    color: '#000000',
    marginTop: 1,
    paddingLeft: 7,
    lineHeight: 1.15,
  },
  // Projects Section
  projectItem: {
    marginBottom: 5,
    paddingLeft: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  projectTime: {
    fontSize: 9,
    color: '#000000',
  },
  // Skills Section
  skillsContainer: {
    marginBottom: 8,
  },
  skillCategory: {
    marginBottom: 3,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 1,
  },
  skillsList: {
    fontSize: 9,
    color: '#000000',
    paddingLeft: 7,
    lineHeight: 1.1,
  },
  // General content styles
  bulletPoint: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 1,
    paddingLeft: 7,
  },
  summary: {
    fontSize: 9,
    color: '#000000',
    textAlign: 'justify',
    lineHeight: 1.15,
    marginBottom: 7,
  },
});

export function IITDhanbadResumePDF({ data }: { data: ResumeForm }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Name and Contact */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personal.fullName.toUpperCase()}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{data.personal.email}</Text>
            <Text style={styles.contactItem}>|</Text>
            <Text style={styles.contactItem}>{data.personal.phone}</Text>
            <Text style={styles.contactItem}>|</Text>
            <Text style={styles.contactItem}>{data.personal.address}</Text>
          </View>
          {(data.personal.linkedin || data.personal.github) && (
            <View style={styles.contactInfo}>
              {data.personal.linkedin && <Text style={styles.contactItem}>LinkedIn: {data.personal.linkedin}</Text>}
              {data.personal.linkedin && data.personal.github && <Text style={styles.contactItem}>|</Text>}
              {data.personal.github && <Text style={styles.contactItem}>GitHub: {data.personal.github}</Text>}
            </View>
          )}
        </View>

        {/* Education Section - Always first in IIT format */}
        <View style={styles.educationContainer}>
          <Text style={styles.sectionHeader}>Education</Text>
          <View style={styles.educationTable}>
            <View style={styles.educationRow}>
              <Text style={styles.educationHeaderCell}>Degree</Text>
              <Text style={styles.educationHeaderCell}>Institution</Text>
              <Text style={styles.educationHeaderCell}>Year</Text>
              <Text style={styles.educationHeaderCell}>CPI/Percentage</Text>
            </View>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.educationRow}>
                <Text style={styles.educationCell}>{edu.degree}</Text>
                <Text style={styles.educationCell}>{edu.institution}</Text>
                <Text style={styles.educationCell}>{edu.year}</Text>
                <Text style={styles.educationCell}>{edu.grade || '-'}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Professional Summary/Objective */}
        {data.summary.overview && (
          <View>
            <Text style={styles.sectionHeader}>Objective</Text>
            <Text style={styles.summary}>{data.summary.overview}</Text>
          </View>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && data.experience.some(exp => exp.title || exp.company) && (
          <View>
            <Text style={styles.sectionHeader}>Work Experience</Text>
            {data.experience.map((exp, idx) => (
              (exp.title || exp.company) && (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View>
                      <Text style={styles.jobTitle}>{exp.title}</Text>
                      <Text style={styles.companyName}>{exp.company}</Text>
                    </View>
                    <Text style={styles.dateRange}>{exp.startDate} - {exp.endDate}</Text>
                  </View>
                  <Text style={styles.description}>{exp.description}</Text>
                </View>
              )
            ))}
          </View>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && data.projects.some(proj => proj.title) && (
          <View>
            <Text style={styles.sectionHeader}>Projects</Text>
            {data.projects.map((proj, idx) => (
              proj.title && (
                <View key={proj.id} style={styles.projectItem}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{proj.title}</Text>
                    <Text style={styles.projectTime}>{proj.time}</Text>
                  </View>
                  {proj.technologies && (
                    <Text style={styles.description}>Technologies: {proj.technologies}</Text>
                  )}
                  <Text style={styles.description}>{proj.bio}</Text>
                </View>
              )
            ))}
          </View>
        )}

        {/* Skills Section */}
        {Object.values(data.skills).some(skillArray => skillArray.some(s => s)) && (
          <View style={styles.skillsContainer}>
            <Text style={styles.sectionHeader}>Technical Skills</Text>
            {data.skills.programming.some(s => s) && (
              <View style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>Programming Languages:</Text>
                <Text style={styles.skillsList}>
                  {data.skills.programming.filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
            {data.skills.technologies.some(s => s) && (
              <View style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>Technologies & Frameworks:</Text>
                <Text style={styles.skillsList}>
                  {data.skills.technologies.filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
            {data.skills.tools.some(s => s) && (
              <View style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>Tools & Platforms:</Text>
                <Text style={styles.skillsList}>
                  {data.skills.tools.filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
            {data.skills.databases.some(s => s) && (
              <View style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>Databases:</Text>
                <Text style={styles.skillsList}>
                  {data.skills.databases.filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Achievements Section */}
        {data.achievements.length > 0 && data.achievements.some(ach => ach.title) && (
          <View>
            <Text style={styles.sectionHeader}>Achievements</Text>
            {data.achievements.map((ach) => (
              ach.title && (
                <View key={ach.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.jobTitle}>{ach.title}</Text>
                    <Text style={styles.dateRange}>{ach.year}</Text>
                  </View>
                  <Text style={styles.description}>{ach.description}</Text>
                </View>
              )
            ))}
          </View>
        )}

        {/* Position of Responsibility Section */}
        {data.por.length > 0 && data.por.some(por => por.position) && (
          <View>
            <Text style={styles.sectionHeader}>Position of Responsibility</Text>
            {data.por.map((por) => (
              por.position && (
                <View key={por.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View>
                      <Text style={styles.jobTitle}>{por.position}</Text>
                      <Text style={styles.companyName}>{por.organization}</Text>
                    </View>
                    <Text style={styles.dateRange}>{por.duration}</Text>
                  </View>
                  <Text style={styles.description}>{por.description}</Text>
                </View>
              )
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}