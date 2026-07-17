import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, ChevronRight, Sparkles, CheckCircle, RefreshCw,
  Upload, FileText, Trash2, ClipboardPaste, X, Zap,
  BarChart3, Shuffle, Bot
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const JOB_ROLES = [
  { id: 'Software Developer',  icon: '💻', desc: 'DSA, system design & HR',       color: 'from-blue-500/20 to-indigo-500/20',   border: 'border-blue-500/40' },
  { id: 'Frontend Developer',  icon: '🎨', desc: 'React, CSS, JS fundamentals',   color: 'from-pink-500/20 to-rose-500/20',     border: 'border-pink-500/40' },
  { id: 'Backend Developer',   icon: '⚙️', desc: 'APIs, DBs & scalability',       color: 'from-orange-500/20 to-amber-500/20',  border: 'border-orange-500/40' },
  { id: 'Data Analyst',        icon: '📊', desc: 'SQL, tools & communication',    color: 'from-emerald-500/20 to-teal-500/20',  border: 'border-emerald-500/40' },
  { id: 'Business Analyst',    icon: '📋', desc: 'Requirements & processes',      color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/40' },
  { id: 'DevOps Engineer',     icon: '🔧', desc: 'CI/CD, Docker, cloud infra',    color: 'from-cyan-500/20 to-sky-500/20',      border: 'border-cyan-500/40' },
  { id: 'Customer Support',    icon: '🎧', desc: 'Communication & empathy',       color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/40' },
  { id: 'HR Executive',        icon: '🤝', desc: 'People & conflict resolution',  color: 'from-red-500/20 to-rose-500/20',      border: 'border-red-500/40' },
  { id: 'Product Manager',     icon: '🚀', desc: 'Roadmap, strategy & analytics', color: 'from-indigo-500/20 to-blue-500/20',   border: 'border-indigo-500/40' },
  { id: 'UI/UX Designer',      icon: '✏️', desc: 'Design thinking & user flows',  color: 'from-fuchsia-500/20 to-pink-500/20', border: 'border-fuchsia-500/40' },
  { id: 'Data Scientist',      icon: '🧠', desc: 'ML, Python & statistics',       color: 'from-teal-500/20 to-green-500/20',   border: 'border-teal-500/40' },
  { id: 'Full Stack Developer',icon: '🌐', desc: 'End-to-end web development',    color: 'from-slate-500/20 to-gray-500/20',   border: 'border-slate-500/40' },
];

const DIFFICULTIES = [
  { id: 'Easy',   emoji: '🟢', desc: 'Fundamentals & basics',      color: 'border-green-500/50  bg-green-500/5  text-green-600' },
  { id: 'Medium', emoji: '🟡', desc: 'Real-world scenarios',       color: 'border-yellow-500/50 bg-yellow-500/5 text-yellow-600' },
  { id: 'Hard',   emoji: '🔴', desc: 'Expert-level deep dives',    color: 'border-red-500/50    bg-red-500/5    text-red-600' },
];

const EXPERIENCES = [
  { id: 'Fresher',    icon: '🌱', desc: '0 years' },
  { id: '1 Year',     icon: '📘', desc: '~12 months' },
  { id: '2-3 Years',  icon: '📗', desc: 'Mid-level' },
  { id: '5+ Years',   icon: '🏆', desc: 'Senior' },
];

export default function SetupInterview() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [experience, setExperience] = useState('Fresher');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeTab, setResumeTab] = useState('paste'); // 'paste' | 'upload'
  const [savedResumeLoaded, setSavedResumeLoaded] = useState(false);

  // Auto-load resume from profile if saved
  useEffect(() => {
    const savedMeta = localStorage.getItem('user_resume_meta');
    const savedBase64 = localStorage.getItem('user_resume_base64');
    if (savedMeta && savedBase64 && !resumeText) {
      const meta = JSON.parse(savedMeta);
      setResumeFile({ name: meta.name, size: meta.size, fromProfile: true });
      setSavedResumeLoaded(true);
      setResumeTab('upload');
    }
    if (user?.experience) {
      const expMap = { 'Fresher': 'Fresher', '1 Year': '1 Year', '2 Years': '2-3 Years', '5 Years': '5+ Years', '10+ Years': '5+ Years' };
      if (expMap[user.experience]) setExperience(expMap[user.experience]);
    }
    if (user?.targetRole) {
      const matched = JOB_ROLES.find(r => r.id.toLowerCase().includes(user.targetRole.toLowerCase()) || user.targetRole.toLowerCase().includes(r.id.toLowerCase().split(' ')[0]));
      if (matched) setRole(matched.id);
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowed.includes(file.type)) { alert('Please upload a PDF, Word or TXT file.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB allowed.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setResumeFile({ name: file.name, size: file.size, fromProfile: false });
      if (file.type === 'text/plain') setResumeText(ev.target.result);
      setSavedResumeLoaded(false);
    };
    reader.readAsText(file);
  };

  const handleStart = () => {
    if (!role) return;
    const finalResume = resumeTab === 'paste' ? resumeText : (resumeFile?.fromProfile ? localStorage.getItem('user_resume_base64') || '' : resumeText);
    const config = { role, difficulty, experience, resumeText: finalResume, hasResume: !!(resumeText || resumeFile) };
    sessionStorage.setItem('interviewConfig', JSON.stringify(config));
    navigate('/interview/session');
  };

  const canStart = !!role;

  const Step = ({ num, label }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{num}</div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{label}</h2>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-12 px-2">

      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          AI-Powered Mock Interview • Questions Shuffled Every Time
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-2">Ready for Your <span className="text-gradient">Interview?</span></h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Select your role, upload your resume and our AI will generate deeply personalized questions with instant feedback.</p>
      </motion.div>

      <div className="space-y-8">

        {/* ── Step 1: Role ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-3xl p-6 shadow-card">
          <Step num="1" label="Select Your Role" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {JOB_ROLES.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setRole(r.id)}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                  role === r.id
                    ? `border-primary bg-gradient-to-br ${r.color} shadow-md`
                    : `border-border hover:border-primary/40 bg-muted/20 hover:bg-gradient-to-br hover:${r.color}`
                }`}
              >
                {role === r.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="font-semibold text-sm mb-0.5 leading-tight">{r.id}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Steps 2 & 3: Difficulty + Experience ── */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Difficulty */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-3xl p-6 shadow-card">
            <Step num="2" label="Difficulty" />
            <div className="space-y-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-sm font-medium transition-all ${
                    difficulty === d.id ? `${d.color} border-opacity-100 shadow-sm` : 'border-border hover:border-primary/30 bg-muted/20'
                  }`}
                >
                  <span className="text-lg">{d.emoji}</span>
                  <div className="text-left">
                    <div className="font-semibold">{d.id}</div>
                    <div className="text-xs text-muted-foreground font-normal">{d.desc}</div>
                  </div>
                  {difficulty === d.id && <CheckCircle className="h-4 w-4 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-card border border-border rounded-3xl p-6 shadow-card">
            <Step num="3" label="Your Experience" />
            <div className="space-y-2">
              {EXPERIENCES.map(e => (
                <button
                  key={e.id}
                  onClick={() => setExperience(e.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-sm font-medium transition-all ${
                    experience === e.id ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:border-primary/30 bg-muted/20'
                  }`}
                >
                  <span className="text-lg">{e.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{e.id}</div>
                    <div className="text-xs text-muted-foreground font-normal">{e.desc}</div>
                  </div>
                  {experience === e.id && <CheckCircle className="h-4 w-4 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Step 4: Resume ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <Step num="4" label="Resume / CV" />
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold border border-primary/20">
              {resumeFile || resumeText ? '✅ Resume Added' : 'Optional'}
            </span>
          </div>

          {savedResumeLoaded && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-600 font-medium">
              <CheckCircle size={15} />
              Resume auto-loaded from your Profile! Questions will be personalized to your experience.
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4 p-1 bg-muted/40 rounded-xl w-fit">
            <button
              onClick={() => setResumeTab('paste')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${resumeTab === 'paste' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ClipboardPaste size={14} /> Paste Text
            </button>
            <button
              onClick={() => setResumeTab('upload')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${resumeTab === 'upload' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Upload size={14} /> Upload File
            </button>
          </div>

          <AnimatePresence mode="wait">
            {resumeTab === 'paste' ? (
              <motion.div key="paste" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume, work experience, skills or any background here...&#10;&#10;Our AI will craft deeply personalized interview questions based on YOUR specific experience!"
                  className="w-full min-h-[160px] rounded-2xl border border-border bg-muted/20 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y transition-all placeholder:text-muted-foreground/60"
                />
                {resumeText && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{resumeText.length} characters — AI will use this to personalize your interview</span>
                    <button onClick={() => setResumeText('')} className="text-xs text-destructive hover:underline flex items-center gap-1"><X size={12} /> Clear</button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {resumeFile ? (
                  <div className="flex items-center justify-between p-4 bg-primary/5 border-2 border-primary/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{resumeFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {resumeFile.fromProfile ? '📌 Loaded from your Profile' : `${(resumeFile.size / 1024).toFixed(0)} KB`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => { setResumeFile(null); setSavedResumeLoaded(false); }} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-8 text-center cursor-pointer transition-all group bg-muted/10 hover:bg-primary/5"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <Upload size={24} className="text-primary" />
                    </div>
                    <p className="font-semibold mb-1">Click to upload Resume</p>
                    <p className="text-muted-foreground text-sm">PDF, Word or TXT • Max 5MB</p>
                    <p className="text-xs text-primary mt-2 font-medium">AI will generate questions tailored to your resume</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileUpload} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Start Button ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="flex flex-col items-center gap-3">
          <motion.button
            whileHover={{ scale: canStart ? 1.03 : 1 }}
            whileTap={{ scale: canStart ? 0.97 : 1 }}
            onClick={handleStart}
            disabled={!canStart}
            className="flex items-center gap-3 px-12 py-5 rounded-2xl text-lg font-bold bg-gradient-hero text-white shadow-glow hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Mic className="h-5 w-5" />
            Start Interview
            <ChevronRight className="h-5 w-5" />
          </motion.button>
          {!canStart
            ? <p className="text-xs text-muted-foreground">👆 Select a role above to begin</p>
            : <p className="text-xs text-muted-foreground">
                Starting <strong>{role}</strong> • {difficulty} • {experience}
                {(resumeFile || resumeText) ? ' • 📄 Resume Added' : ''}
              </p>
          }
        </motion.div>

        {/* ── Features ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: <Shuffle size={22} />, label: 'Shuffled Questions', desc: 'Different every time', color: 'text-blue-500 bg-blue-500/10' },
            { icon: <Bot size={22} />, label: 'AI Feedback', desc: 'Instant improvement tips', color: 'text-purple-500 bg-purple-500/10' },
            { icon: <BarChart3 size={22} />, label: 'Full Report', desc: 'Detailed score analysis', color: 'text-emerald-500 bg-emerald-500/10' },
          ].map(f => (
            <div key={f.label} className="p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-purple transition-all">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 ${f.color}`}>{f.icon}</div>
              <p className="text-sm font-semibold mb-0.5">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

