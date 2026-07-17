import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ChevronRight, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const JOB_ROLES = [
  { id: 'Software Developer', icon: '💻', desc: 'DSA, system design & HR' },
  { id: 'Frontend Developer', icon: '🎨', desc: 'React, CSS, JS fundamentals' },
  { id: 'Backend Developer', icon: '⚙️', desc: 'APIs, DBs & scalability' },
  { id: 'Data Analyst', icon: '📊', desc: 'SQL, tools & communication' },
  { id: 'Business Analyst', icon: '📋', desc: 'Requirements & processes' },
  { id: 'DevOps Engineer', icon: '🔧', desc: 'CI/CD, Docker, cloud infra' },
  { id: 'Customer Support', icon: '🎧', desc: 'Communication & empathy' },
  { id: 'HR Executive', icon: '🤝', desc: 'People & conflict resolution' },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const EXPERIENCES = ['Fresher', '1 Year', '2-3 Years', '5+ Years'];

export default function SetupInterview() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [experience, setExperience] = useState('Fresher');

  const canStart = !!role;

  const handleStart = () => {
    if (!canStart) return;
    const resumeText = document.getElementById('resume-input')?.value || '';
    const config = { role, difficulty, experience, resumeText };
    sessionStorage.setItem('interviewConfig', JSON.stringify(config));
    navigate('/interview/session');
  };

  return (
    <div className="max-w-4xl mx-auto pt-2 pb-10 px-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'hsl(var(--primary)/0.1)', color: 'hsl(var(--primary))' }}>
          <Sparkles className="h-3.5 w-3.5" /> AI-Powered Mock Interview • Questions Shuffled Every Time
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Ready for Your Interview?</h1>
        <p className="text-muted-foreground">Select your target role and our AI interviewer will ask you personalized questions with instant feedback.</p>
      </motion.div>

      {/* Role Selection */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">1. Select Your Role</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {JOB_ROLES.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setRole(r.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                role === r.id ? 'border-primary bg-primary/5 shadow-purple' : 'border-border glass-card hover:border-primary/40'
              }`}
            >
              <div className="text-2xl mb-2">{r.icon}</div>
              <div className="font-semibold text-sm mb-1">{r.id}</div>
              <div className="text-xs text-muted-foreground">{r.desc}</div>
              {role === r.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Config options */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">2. Difficulty</h2>
          <div className="flex flex-col gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                  difficulty === d ? 'border-primary bg-primary/5 text-primary' : 'border-border glass-card hover:border-primary/30'
                }`}
              >
                {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">3. Your Experience</h2>
          <div className="flex flex-col gap-2">
            {EXPERIENCES.map(e => (
              <button
                key={e}
                onClick={() => setExperience(e)}
                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                  experience === e ? 'border-primary bg-primary/5 text-primary' : 'border-border glass-card hover:border-primary/30'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Resume Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          4. Resume / CV <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Optional</span>
        </h2>
        <div className="relative">
          <textarea
            placeholder="Paste your resume or key experience here. Our AI will generate custom questions tailored to your profile!"
            className="w-full min-h-[120px] rounded-2xl border border-border glass-card p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            onChange={(e) => {
              // Store directly to window to avoid re-renders on every keystroke slowing it down, 
              // or use state. State is fine.
            }}
            id="resume-input"
          ></textarea>
        </div>
      </div>

      {/* Start button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: canStart ? 1.02 : 1 }}
          whileTap={{ scale: canStart ? 0.98 : 1 }}
          onClick={handleStart}
          disabled={!canStart}
          className="flex items-center gap-3 px-10 py-5 rounded-2xl text-base font-bold bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Mic className="h-5 w-5" /> Start Interview <ChevronRight className="h-5 w-5" />
        </motion.button>
        {!canStart && <p className="text-xs text-muted-foreground">Select a role to begin</p>}
      </div>

      {/* Features row */}
      <div className="grid grid-cols-3 gap-4 mt-10 text-center">
        {[
          { icon: '🔀', label: 'Shuffled Questions', desc: 'Different every time' },
          { icon: '🤖', label: 'AI Feedback', desc: 'Instant improvement tips' },
          { icon: '📊', label: 'Full Report', desc: 'Detailed score analysis' },
        ].map(f => (
          <div key={f.label} className="p-4 rounded-xl glass-card">
            <div className="text-2xl mb-1">{f.icon}</div>
            <p className="text-xs font-semibold">{f.label}</p>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
