"use client";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { IITDhanbadResumePDF } from '@/components/IITDhanbadResumePDF';
import Header from '@/components/header';

const sections = [
  { id: "personal", title: "Personal Information" },
  { id: "education", title: "Education" },
  { id: "summary", title: "Objective" },
  { id: "experience", title: "Work Experience" },
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Technical Skills" },
  { id: "achievements", title: "Achievements" },
  { id: "por", title: "Position of Responsibility" },
];

interface AccordionSectionProps {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  completed?: boolean;
}


interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  time: string;
  bio: string;
  technologies?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
}

interface POR {
  id: string;
  position: string;
  organization: string;
  duration: string;
  description: string;
}


export interface ResumeForm {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
  };
  education: Education[];
  summary: {
    overview: string;
  };
  experience: Experience[];
  projects: Project[];
  skills: {
    programming: string[];
    technologies: string[];
    tools: string[];
    databases: string[];
  };
  achievements: Achievement[];
  por: POR[];
}

function AccordionSection({ id, title, open, onToggle, children, completed }: AccordionSectionProps) {
  return (
    <div className="border-b border-gray-800">
      <button
        className={`w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none transition-colors hover:bg-indigo-950/40 ${open ? "bg-gray-800" : "bg-gray-900"}`}
        onClick={() => onToggle(id)}
      >
        <span className="font-semibold text-lg flex items-center gap-2 text-indigo-200">
          {title}
          {completed && <span className="text-green-400">✔</span>}
        </span>
        <span className={`transform transition-transform duration-300 text-indigo-400 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[2000px] opacity-100 py-6 px-6" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}

// Helper type guards
function isArraySection(section: string): section is 'education' | 'experience' | 'projects' | 'achievements' | 'por' {
  return ["education", "experience", "projects", "achievements", "por"].includes(section);
}

export default function ResumeBuddy() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  // Move all useState and useEffect hooks to top-level, outside any conditionals
  const [openSections, setOpenSections] = useState<string[]>([sections[0].id]);
  const [form, setForm] = useState<ResumeForm>({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      github: ""
    },
    education: [{ id: "edu_1", degree: "B.Tech in Computer Science & Engineering", institution: "IIT (ISM) Dhanbad", year: "2024", grade: "" }],
    summary: { overview: "" },
    experience: [{ id: "exp_1", title: "", company: "", startDate: "", endDate: "", description: "" }],
    projects: [{ id: "proj_1", title: "", time: "", bio: "", technologies: "" }],
    skills: {
      programming: [""],
      technologies: [""],
      tools: [""],
      databases: [""]
    },
    achievements: [{ id: "ach_1", title: "", description: "", year: "" }],
    por: [{ id: "por_1", position: "", organization: "", duration: "", description: "" }],
  });
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && user) {
      setForm(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.fullName || user.emailAddresses[0]?.emailAddress || "",
          email: user.emailAddresses[0]?.emailAddress || "",
        }
      }));
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return null;
  }


  const completed = {
    personal: !!form.personal.fullName && !!form.personal.email && !!form.personal.phone && !!form.personal.address,
    education: form.education.some(e => e.degree && e.institution),
    summary: !!form.summary.overview,
    experience: form.experience.some(e => e.title && e.company),
    projects: form.projects.some(p => p.title),
    skills: Object.values(form.skills).flat().some(s => s),
    achievements: form.achievements.some(a => a.title),
    por: form.por.some(p => p.position),
  };

  
  const handleToggle = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

 
  function updateField(section: string, field: string, value: string, idx?: number) {
    setForm(prev => {
      if (isArraySection(section) && typeof idx === 'number') {
        let arr;
        if (section === 'education') arr = [...prev.education];
        else if (section === 'experience') arr = [...prev.experience];
        else if (section === 'projects') arr = [...prev.projects];
        else if (section === 'achievements') arr = [...prev.achievements];
        else arr = [...prev.por];
        arr[idx] = { ...arr[idx], [field]: value };
        return { ...prev, [section]: arr };
      } else if (section === 'personal' || section === 'summary' || section === 'skills') {
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      }
      return prev;
    });
  }

  
  function addArrayItem(section: string) {
    if (section === 'experience') {
      const newItem: Experience = { id: `exp_${Date.now()}`, title: "", company: "", startDate: "", endDate: "", description: "" };
      setForm(prev => ({ ...prev, experience: [...prev.experience, newItem] }));
    } else if (section === 'projects') {
      const newItem: Project = { id: `proj_${Date.now()}`, title: "", time: "", bio: "", technologies: "" };
      setForm(prev => ({ ...prev, projects: [...prev.projects, newItem] }));
    } else if (section === 'education') {
      const newItem: Education = { id: `edu_${Date.now()}`, degree: "", institution: "", year: "", grade: "" };
      setForm(prev => ({ ...prev, education: [...prev.education, newItem] }));
    } else if (section === 'achievements') {
      const newItem: Achievement = { id: `ach_${Date.now()}`, title: "", description: "", year: "" };
      setForm(prev => ({ ...prev, achievements: [...prev.achievements, newItem] }));
    } else if (section === 'por') {
      const newItem: POR = { id: `por_${Date.now()}`, position: "", organization: "", duration: "", description: "" };
      setForm(prev => ({ ...prev, por: [...prev.por, newItem] }));
    }
  }

 
  function removeArrayItem(section: string, idx: number) {
    if (section === 'experience') {
      setForm(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
    } else if (section === 'projects') {
      setForm(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
    } else if (section === 'education') {
      setForm(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
    } else if (section === 'achievements') {
      setForm(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
    } else if (section === 'por') {
      setForm(prev => ({ ...prev, por: prev.por.filter((_, i) => i !== idx) }));
    }
  }


  function updateSkills(category: keyof typeof form.skills, value: string) {
    setForm(prev => ({ ...prev, skills: { ...prev.skills, [category]: value.split(",").map(s => s.trim()).filter(Boolean) } }));
  }

  const handleSave = async () => {
    setSaveError("Saving to cloud is disabled. Download your PDF instead.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="max-w-[96vw] mx-auto flex flex-col xl:flex-row gap-8 p-4">
        {/* Form Section */}
        <div className="xl:w-2/3 bg-gray-900 shadow-2xl border border-gray-800 rounded-3xl p-8 max-h-[85vh] overflow-y-auto">
          <div>
            <AccordionSection id="personal" title="Personal Information" open={openSections.includes("personal")} onToggle={handleToggle} completed={completed.personal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(form.personal).map(([field, value]) => (
                  <input
                    key={field}
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    className="w-full border border-gray-700 bg-gray-800 text-indigo-100 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                    placeholder={field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                    value={value || ""}
                    onChange={e => updateField("personal", field, e.target.value)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection id="education" title="Education" open={openSections.includes("education")} onToggle={handleToggle} completed={completed.education}>
              {form.education.map((edu, idx) => (
                <div key={edu.id} className="mb-6 bg-gray-800 rounded-lg p-4 relative">
                  {form.education.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("education", idx)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(edu).filter(([k]) => k !== "id").map(([field, value]) => (
                      <input
                        key={field}
                        type="text"
                        className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={value}
                        onChange={e => updateField("education", field, e.target.value, idx)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addArrayItem("education")} 
                className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition"
              >
                + Add Education
              </button>
            </AccordionSection>

            <AccordionSection id="summary" title="Objective" open={openSections.includes("summary")} onToggle={handleToggle} completed={completed.summary}>
              <textarea 
                className="w-full border border-gray-700 bg-gray-800 text-indigo-100 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" 
                rows={4} 
                placeholder="Objective" 
                value={form.summary.overview} 
                onChange={e => updateField("summary", "overview", e.target.value)} 
              />
            </AccordionSection>

            <AccordionSection id="experience" title="Work Experience" open={openSections.includes("experience")} onToggle={handleToggle} completed={completed.experience}>
              {form.experience.map((exp, idx) => (
                <div key={exp.id} className="mb-6 bg-gray-800 rounded-lg p-4 relative">
                  {form.experience.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("experience", idx)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.entries(exp).filter(([k]) => k !== "id" && k !== "description").map(([field, value]) => (
                      <input 
                        key={field} 
                        type={field.includes('Date') ? 'date' : 'text'}
                        className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                        placeholder={field === 'startDate' ? 'Start Date' : field === 'endDate' ? 'End Date' : field.charAt(0).toUpperCase() + field.slice(1)} 
                        value={value} 
                        onChange={e => updateField("experience", field, e.target.value, idx)} 
                      />
                    ))}
                  </div>
                  <textarea 
                    className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                    rows={3} 
                    placeholder="Description" 
                    value={exp.description}
                    onChange={e => updateField("experience", "description", e.target.value, idx)} 
                  />
                </div>
              ))}
              <button 
                onClick={() => addArrayItem("experience")} 
                className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition"
              >
                + Add Experience
              </button>
            </AccordionSection>

            <AccordionSection id="projects" title="Projects" open={openSections.includes("projects")} onToggle={handleToggle} completed={completed.projects}>
              {form.projects.map((proj, idx) => (
                <div key={proj.id} className="mb-6 bg-gray-800 rounded-lg p-4 relative">
                  {form.projects.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("projects", idx)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.entries(proj).filter(([k]) => k !== "id" && k !== "bio").map(([field, value]) => (
                      <input 
                        key={field} 
                        type="text" 
                        className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
                        value={value || ""} 
                        onChange={e => updateField("projects", field, e.target.value, idx)} 
                      />
                    ))}
                  </div>
                  <textarea 
                    className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                    rows={3} 
                    placeholder="Project Description" 
                    value={proj.bio} 
                    onChange={e => updateField("projects", "bio", e.target.value, idx)} 
                  />
                </div>
              ))}
              <button 
                onClick={() => addArrayItem("projects")} 
                className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition"
              >
                + Add Project
              </button>
            </AccordionSection>

            <AccordionSection id="skills" title="Technical Skills" open={openSections.includes("skills")} onToggle={handleToggle} completed={completed.skills}>
              <div className="space-y-4">
                {Object.entries(form.skills).map(([category, arr]) => (
                  <div key={category}>
                    <label className="block text-indigo-300 text-sm font-semibold mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-700 bg-gray-800 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                      placeholder={`e.g., ${category} (comma separated)`} 
                      value={arr.join(", ")} 
                      onChange={e => updateSkills(category as keyof typeof form.skills, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection id="achievements" title="Achievements" open={openSections.includes("achievements")} onToggle={handleToggle} completed={completed.achievements}>
              {form.achievements.map((ach, idx) => (
                <div key={ach.id} className="mb-6 bg-gray-800 rounded-lg p-4 relative">
                  {form.achievements.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("achievements", idx)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.entries(ach).filter(([k]) => k !== "id" && k !== "description").map(([field, value]) => (
                      <input 
                        key={field} 
                        type="text" 
                        className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
                        value={value} 
                        onChange={e => updateField("achievements", field, e.target.value, idx)} 
                      />
                    ))}
                  </div>
                  <textarea 
                    className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                    rows={2} 
                    placeholder="Description" 
                    value={ach.description} 
                    onChange={e => updateField("achievements", "description", e.target.value, idx)} 
                  />
                </div>
              ))}
              <button 
                onClick={() => addArrayItem("achievements")} 
                className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition"
              >
                + Add Achievement
              </button>
            </AccordionSection>

            <AccordionSection id="por" title="Position of Responsibility" open={openSections.includes("por")} onToggle={handleToggle} completed={completed.por}>
              {form.por.map((por, idx) => (
                <div key={por.id} className="mb-6 bg-gray-800 rounded-lg p-4 relative">
                  {form.por.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("por", idx)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.entries(por).filter(([k]) => k !== "id" && k !== "description").map(([field, value]) => (
                      <input 
                        key={field} 
                        type="text" 
                        className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
                        value={value} 
                        onChange={e => updateField("por", field, e.target.value, idx)} 
                      />
                    ))}
                  </div>
                  <textarea 
                    className="w-full border border-gray-700 bg-gray-700 text-indigo-100 rounded-lg p-3 placeholder-gray-400" 
                    rows={2} 
                    placeholder="Description" 
                    value={por.description} 
                    onChange={e => updateField("por", "description", e.target.value, idx)} 
                  />
                </div>
              ))}
              <button 
                onClick={() => addArrayItem("por")} 
                className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition"
              >
                + Add Position
              </button>
            </AccordionSection>

            <div className="mt-6 space-y-4">
              <button 
                onClick={handleSave} 
                className="w-full py-3 rounded-xl bg-indigo-600 text-indigo-100 font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={false}
              >
                Save Resume
              </button>
              
              <PDFDownloadLink 
                document={<IITDhanbadResumePDF data={form} />} 
                fileName={`resume_${form.personal.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
                className="w-full"
              >
                {({ loading }) => (
                  <button 
                    className="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50" 
                    disabled={loading}
                  >
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>

            {saveError && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <div className="text-red-400 font-semibold mb-2">Error:</div>
                <div className="text-red-300 text-sm">{saveError}</div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Preview Section */}
        <div className="xl:w-1/3 bg-gray-950/90 p-6 rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-800 flex flex-col">
          {/* Live PDF Preview Only */}
          <div className="mb-6 border border-indigo-900 rounded-lg overflow-hidden" style={{ height: '650px' }}>
            <PDFViewer width="100%" height={650}>
              <IITDhanbadResumePDF data={form} />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}