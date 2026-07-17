import { useState, useRef } from 'react';
import { FileEdit, Download, Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useAuthStore from '../../store/authStore';

const initialData = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  experience: [
    { id: 1, company: '', role: '', startDate: '', endDate: '', current: false, description: '' },
  ],
  education: [
    { id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' },
  ],
  skills: [
    { id: 1, category: 'Technical', skills: '' },
  ],
  projects: [
    { id: 1, name: '', url: '', description: '', tech: '' },
  ],
};

const SECTIONS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'summary', label: 'Professional Summary' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
];

function InputField({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        rows={rows}
        className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
      />
    </div>
  );
}

// ─── Resume Preview (the actual printable document) ───────────────────────────
function ResumePreview({ data }) {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div
      id="resume-preview"
      className="bg-white text-gray-900 font-sans w-full"
      style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.4', padding: '32px' }}
    >
      {/* Header */}
      <div style={{ borderBottom: '2px solid #4f46e5', paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px', color: '#6b7280', fontSize: '10px' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>📞 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
          {personal.github && <span>⚡ {personal.github}</span>}
          {personal.website && <span>🌐 {personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            Professional Summary
          </h2>
          <p style={{ color: '#374151', margin: 0 }}>{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company || e.role) && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Work Experience
          </h2>
          {experience.map(exp => (exp.company || exp.role) && (
            <div key={exp.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '12px', color: '#111827' }}>{exp.role}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>{exp.company}</div>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '10px', whiteSpace: 'nowrap' }}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <p style={{ color: '#374151', marginTop: '4px', margin: '4px 0 0 0' }}>{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.some(e => e.institution || e.degree) && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Education
          </h2>
          {education.map(edu => (edu.institution || edu.degree) && (
            <div key={edu.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#111827' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>{edu.institution}{edu.grade ? ` | ${edu.grade}` : ''}</div>
              </div>
              <div style={{ color: '#9ca3af', fontSize: '10px', whiteSpace: 'nowrap' }}>
                {edu.startDate} – {edu.endDate}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.some(s => s.skills) && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Skills
          </h2>
          {skills.map(s => s.skills && (
            <div key={s.id} style={{ marginBottom: '4px' }}>
              <span style={{ fontWeight: '700', color: '#111827' }}>{s.category}: </span>
              <span style={{ color: '#374151' }}>{s.skills}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.some(p => p.name) && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Projects
          </h2>
          {projects.map(proj => proj.name && (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: '700', fontSize: '12px', color: '#111827' }}>
                {proj.name}{proj.url ? ` — ` : ''}
                {proj.url && <a href={proj.url} style={{ color: '#4f46e5', fontWeight: '400', fontSize: '10px' }}>{proj.url}</a>}
              </div>
              {proj.tech && <div style={{ color: '#6b7280', fontSize: '10px', margin: '2px 0' }}>Tech: {proj.tech}</div>}
              {proj.description && <p style={{ color: '#374151', margin: '2px 0 0 0' }}>{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Resume Builder Component ────────────────────────────────────────────
export default function ResumeBuilder() {
  const { user } = useAuthStore();
  const [data, setData] = useState(() => ({
    ...initialData,
    personal: { ...initialData.personal, name: user?.name || '', email: user?.email || '' },
  }));
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const updatePersonal = (key, val) =>
    setData(d => ({ ...d, personal: { ...d.personal, [key]: val } }));

  const updateItem = (section, id, key, val) =>
    setData(d => ({
      ...d,
      [section]: d[section].map(item => item.id === id ? { ...item, [key]: val } : item),
    }));

  const addItem = (section, template) =>
    setData(d => ({
      ...d,
      [section]: [...d[section], { ...template, id: Date.now() }],
    }));

  const removeItem = (section, id) =>
    setData(d => ({ ...d, [section]: d[section].filter(item => item.id !== id) }));

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const el = document.getElementById('resume-preview');
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personal.name || 'resume'}_resume.pdf`);
    } catch (err) {
      alert('Download failed: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // ── Render form based on active section ──────────────────────────────────────
  const renderForm = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-3">
            <InputField label="Full Name *" value={data.personal.name} onChange={v => updatePersonal('name', v)} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Email *" type="email" value={data.personal.email} onChange={v => updatePersonal('email', v)} />
              <InputField label="Phone" value={data.personal.phone} onChange={v => updatePersonal('phone', v)} placeholder="+91 9XXXXXXXXX" />
            </div>
            <InputField label="Location" value={data.personal.location} onChange={v => updatePersonal('location', v)} placeholder="City, State" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="LinkedIn URL" value={data.personal.linkedin} onChange={v => updatePersonal('linkedin', v)} />
              <InputField label="GitHub URL" value={data.personal.github} onChange={v => updatePersonal('github', v)} />
            </div>
            <InputField label="Portfolio/Website" value={data.personal.website} onChange={v => updatePersonal('website', v)} />
          </div>
        );

      case 'summary':
        return (
          <TextArea
            label="Professional Summary"
            value={data.personal.summary}
            onChange={v => updatePersonal('summary', v)}
            rows={6}
            placeholder="Write a compelling 2-3 sentence summary highlighting your core skills and career goals..."
          />
        );

      case 'experience':
        return (
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3 relative">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-foreground">Position {idx + 1}</h4>
                  {data.experience.length > 1 && (
                    <button onClick={() => removeItem('experience', exp.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Company *" value={exp.company} onChange={v => updateItem('experience', exp.id, 'company', v)} />
                  <InputField label="Job Title *" value={exp.role} onChange={v => updateItem('experience', exp.id, 'role', v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Start Date" value={exp.startDate} onChange={v => updateItem('experience', exp.id, 'startDate', v)} placeholder="Jan 2023" />
                  <InputField label="End Date" value={exp.endDate} onChange={v => updateItem('experience', exp.id, 'endDate', v)} placeholder="Dec 2024 or Present" />
                </div>
                <TextArea label="Description (bullet points or prose)" value={exp.description} onChange={v => updateItem('experience', exp.id, 'description', v)} rows={3} placeholder="• Built React features that reduced load time by 40%..." />
              </div>
            ))}
            <button
              onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', current: false, description: '' })}
              className="w-full py-2.5 border border-dashed border-primary/50 rounded-xl text-sm text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Plus size={16} /> Add Experience
            </button>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold">Education {idx + 1}</h4>
                  {data.education.length > 1 && (
                    <button onClick={() => removeItem('education', edu.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <InputField label="Institution *" value={edu.institution} onChange={v => updateItem('education', edu.id, 'institution', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Degree" value={edu.degree} onChange={v => updateItem('education', edu.id, 'degree', v)} placeholder="B.Tech, BCA..." />
                  <InputField label="Field of Study" value={edu.field} onChange={v => updateItem('education', edu.id, 'field', v)} placeholder="Computer Science" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <InputField label="Start" value={edu.startDate} onChange={v => updateItem('education', edu.id, 'startDate', v)} placeholder="2020" />
                  <InputField label="End" value={edu.endDate} onChange={v => updateItem('education', edu.id, 'endDate', v)} placeholder="2024" />
                  <InputField label="Grade / %age" value={edu.grade} onChange={v => updateItem('education', edu.id, 'grade', v)} placeholder="8.5 CGPA" />
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' })}
              className="w-full py-2.5 border border-dashed border-primary/50 rounded-xl text-sm text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Add skills grouped by category. Separate individual skills with commas.</p>
            {data.skills.map((s, idx) => (
              <div key={s.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Skill Group {idx + 1}</h4>
                  {data.skills.length > 1 && (
                    <button onClick={() => removeItem('skills', s.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <InputField label="Category" value={s.category} onChange={v => updateItem('skills', s.id, 'category', v)} placeholder="Technical, Frontend, Tools..." />
                <TextArea label="Skills (comma separated)" value={s.skills} onChange={v => updateItem('skills', s.id, 'skills', v)} rows={2} placeholder="React.js, Node.js, MongoDB, Docker..." />
              </div>
            ))}
            <button
              onClick={() => addItem('skills', { category: '', skills: '' })}
              className="w-full py-2.5 border border-dashed border-primary/50 rounded-xl text-sm text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Plus size={16} /> Add Skill Group
            </button>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold">Project {idx + 1}</h4>
                  {data.projects.length > 1 && (
                    <button onClick={() => removeItem('projects', proj.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Project Name *" value={proj.name} onChange={v => updateItem('projects', proj.id, 'name', v)} />
                  <InputField label="URL (GitHub / Live)" value={proj.url} onChange={v => updateItem('projects', proj.id, 'url', v)} />
                </div>
                <InputField label="Tech Stack" value={proj.tech} onChange={v => updateItem('projects', proj.id, 'tech', v)} placeholder="React, Node.js, MongoDB" />
                <TextArea label="Description" value={proj.description} onChange={v => updateItem('projects', proj.id, 'description', v)} rows={3} placeholder="Describe what you built and the impact..." />
              </div>
            ))}
            <button
              onClick={() => addItem('projects', { name: '', url: '', description: '', tech: '' })}
              className="w-full py-2.5 border border-dashed border-primary/50 rounded-xl text-sm text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            Resume Builder <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full align-middle ml-2">Live Preview</span>
          </h1>
          <p className="text-muted-foreground text-sm">Build an ATS-friendly resume and download it as a PDF.</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={() => setShowPreview(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className={`grid gap-6 ${showPreview ? 'xl:grid-cols-2' : 'xl:grid-cols-1'}`}>
        {/* ─── Editor Panel ─── */}
        <div className="flex gap-4 h-[calc(100vh-12rem)] overflow-hidden">
          {/* Section Tabs */}
          <div className="flex flex-col gap-1 w-40 shrink-0 overflow-y-auto custom-scrollbar pr-1">
            {SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeSection === sec.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Form Panel */}
          <div className="flex-1 overflow-y-auto custom-scrollbar glass-card rounded-2xl p-5 border border-border shadow-card">
            <h3 className="font-display font-semibold mb-4 text-base">
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </h3>
            {renderForm()}
          </div>
        </div>

        {/* ─── Preview Panel ─── */}
        {showPreview && (
          <div className="h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar rounded-2xl border border-border shadow-card bg-gray-100">
            <div className="p-4 bg-secondary/50 border-b border-border text-center text-xs text-muted-foreground font-medium">
              📄 Live Preview — this is how your resume will look
            </div>
            <div className="p-4">
              <div className="shadow-2xl rounded overflow-hidden">
                <ResumePreview data={data} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
